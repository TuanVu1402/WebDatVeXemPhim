import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingPage.css';

function BookingPage() {
  const { suatChieuId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suatChieu, setSuatChieu] = useState(null);
  const [soDoGhe, setSoDoGhe] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1); // 1: Chọn ghế, 2: Điền thông tin
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: ''
  });

  useEffect(() => {
    fetchSoDoGhe();
  }, [suatChieuId]);

  const fetchSoDoGhe = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/suat-chieu/${suatChieuId}/ghe`);
      if (response.data.success) {
        setSuatChieu(response.data.data.suat_chieu);
        setSoDoGhe(response.data.data.so_do_ghe);
      }
    } catch (error) {
      console.error('Lỗi khi lấy sơ đồ ghế:', error);
      alert('Không thể tải sơ đồ ghế');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.trang_thai === 1) return; // Ghế đã đặt

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatClass = (seat) => {
    if (seat.trang_thai === 1) return 'seat occupied';
    if (selectedSeats.some(s => s.id === seat.id)) return 'seat selected';
    
    switch(seat.loai_ghe) {
      case 'vip':
        return 'seat vip';
      case 'doi':
        return 'seat double';
      case 'thuong':
        return 'seat normal';
      default:
        return 'seat normal';
    }
  };

  const calculateTotal = () => {
    if (!suatChieu) return 0;
    return selectedSeats.length * suatChieu.gia_ve;
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ghế!');
      return;
    }
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!formData.ho_ten || !formData.email || !formData.so_dien_thoai) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      // Kiểm tra đã đăng nhập chưa
      const user = JSON.parse(localStorage.getItem('user') || 'null');

      const response = await axios.post('http://localhost:8000/api/dat-ve', {
        suatchieu_id: suatChieuId,
        ghe_ids: selectedSeats.map(s => s.id),
        nguoidung_id: user?.id || null,
        ...formData
      });

      if (response.data.success) {
        // Nếu chưa đăng nhập → lưu vé vào localStorage
        if (!user) {
          const savedTickets = JSON.parse(localStorage.getItem('my_tickets') || '[]');
          const veId = response.data.data.ve?.id;
          if (veId && !savedTickets.includes(veId)) {
            savedTickets.push(veId);
            localStorage.setItem('my_tickets', JSON.stringify(savedTickets));
          }
        }

        alert('Đặt vé thành công! Mã đặt vé: ' + response.data.data.ma_dat_ve);
        navigate('/booking-success', { state: { booking: response.data.data } });
      }
    } catch (error) {
      console.error('Lỗi khi đặt vé:', error);
      alert(error.response?.data?.message || 'Không thể đặt vé. Vui lòng thử lại!');
      fetchSoDoGhe(); // Reload ghế
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="text-center py-5">
          <div className="spinner-border text-danger"></div>
          <p>Đang tải sơ đồ ghế...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container py-5">
        {/* Movie Info Header */}
        <div className="movie-info-header mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2 className="mb-2">{suatChieu?.phim?.ten_phim}</h2>
              <p className="mb-1">
                <i className="bi bi-building me-2"></i>
                {suatChieu?.rap_chieu?.ten_rap}
              </p>
              <p className="mb-0">
                <i className="bi bi-calendar3 me-2"></i>
                {new Date(suatChieu?.ngay_chieu).toLocaleDateString('vi-VN')}
                {' - '}
                <i className="bi bi-clock ms-2 me-2"></i>
                {suatChieu?.gio_chieu}
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="badge bg-info text-dark fs-6">
                Phòng: {suatChieu?.phong_chieu}
              </div>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <>
            {/* Screen */}
            <div className="screen-container mb-4">
              <div className="screen">MÀN HÌNH</div>
            </div>

            {/* Seat Map */}
            <div className="seat-map">
              {Object.keys(soDoGhe).sort().map(hang => (
                <div key={hang} className="seat-row">
                  <div className="row-label">{hang}</div>
                  <div className="seats">
                    {soDoGhe[hang].map(seat => (
                      <div
                        key={seat.id}
                        className={getSeatClass(seat)}
                        onClick={() => handleSeatClick(seat)}
                        title={`Ghế ${seat.so_ghe} - ${seat.loai_ghe === 'vip' ? 'VIP' : seat.loai_ghe === 'doi' ? 'Đôi' : 'Thường'}`}
                      >
                        {seat.so_ghe.substring(1)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="legend mt-4">
              <div className="legend-item">
                <div className="seat normal"></div>
                <span>Ghế thường</span>
              </div>
              <div className="legend-item">
                <div className="seat vip"></div>
                <span>Ghế VIP</span>
              </div>
              <div className="legend-item">
                <div className="seat double"></div>
                <span>Ghế đôi</span>
              </div>
              <div className="legend-item">
                <div className="seat selected"></div>
                <span>Đang chọn</span>
              </div>
              <div className="legend-item">
                <div className="seat occupied"></div>
                <span>Đã đặt</span>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="booking-summary">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5>Ghế đã chọn:</h5>
                  <p className="selected-seats">
                    {selectedSeats.length > 0
                      ? selectedSeats.map(s => s.so_ghe).join(', ')
                      : 'Chưa chọn ghế nào'}
                  </p>
                </div>
                <div className="col-md-6 text-end">
                  <h5>Tổng tiền:</h5>
                  <p className="total-price">{formatPrice(calculateTotal())}</p>
                  <button 
                    className="btn btn-danger btn-lg"
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0}
                  >
                    Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: User Info Form */}
            <div className="booking-form-container">
              <button 
                className="btn btn-outline-secondary mb-4"
                onClick={() => setStep(1)}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại chọn ghế
              </button>

              <div className="row">
                <div className="col-md-7">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="mb-0">Thông tin đặt vé</h4>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleSubmitBooking}>
                        <div className="mb-3">
                          <label className="form-label">Họ tên *</label>
                          <input
                            type="text"
                            name="ho_ten"
                            className="form-control"
                            value={formData.ho_ten}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email *</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Số điện thoại *</label>
                          <input
                            type="tel"
                            name="so_dien_thoai"
                            className="form-control"
                            value={formData.so_dien_thoai}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <button type="submit" className="btn btn-danger btn-lg w-100">
                          <i className="bi bi-check-circle me-2"></i>
                          Xác nhận đặt vé
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Thông tin đặt vé</h5>
                    </div>
                    <div className="card-body">
                      <p><strong>Phim:</strong> {suatChieu?.phim?.ten_phim}</p>
                      <p><strong>Rạp:</strong> {suatChieu?.rap_chieu?.ten_rap}</p>
                      <p><strong>Phòng:</strong> {suatChieu?.phong_chieu}</p>
                      <p><strong>Ngày:</strong> {new Date(suatChieu?.ngay_chieu).toLocaleDateString('vi-VN')}</p>
                      <p><strong>Giờ:</strong> {suatChieu?.gio_chieu}</p>
                      <hr />
                      <p><strong>Ghế:</strong> {selectedSeats.map(s => s.so_ghe).join(', ')}</p>
                      <p><strong>Số lượng:</strong> {selectedSeats.length} vé</p>
                      <hr />
                      <h4 className="text-danger">
                        <strong>Tổng:</strong> {formatPrice(calculateTotal())}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingPage;
