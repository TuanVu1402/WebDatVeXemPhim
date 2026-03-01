import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      
      // Kiểm tra đã đăng nhập chưa
      const user = JSON.parse(localStorage.getItem('user') || 'null');

      if (user && user.id) {
        // ĐÃ ĐĂNG NHẬP → Lấy vé theo tài khoản từ API
        const response = await axios.get(`http://localhost:8000/api/nguoidung/${user.id}/ve`);
        const ves = response.data.data || [];
        // Gán ghes cho mỗi vé (đồng bộ tên field)
        const bookingsWithGhes = ves.map(ve => ({
          ...ve,
          ghes: ve.ghe_da_dat || ve.ghes || []
        }));
        setBookings(bookingsWithGhes);
      } else {
        // CHƯA ĐĂNG NHẬP → Lấy vé từ localStorage
        const savedTickets = JSON.parse(localStorage.getItem('my_tickets') || '[]');
        
        if (savedTickets.length === 0) {
          setBookings([]);
          return;
        }

        // Fetch chi tiết từng vé từ API
        const bookingPromises = savedTickets.map(async (veId) => {
          try {
            const response = await axios.get(`http://localhost:8000/api/ve/${veId}`);
            if (response.data.success) {
              const ve = response.data.data;
              ve.ghes = ve.ghe_da_dat;
              return ve;
            }
            return null;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(bookingPromises);
        const validBookings = results.filter(b => b !== null);
        
        // Cập nhật lại localStorage (loại bỏ vé không tồn tại)
        const validIds = validBookings.map(b => b.id);
        localStorage.setItem('my_tickets', JSON.stringify(validIds));
        
        setBookings(validBookings);
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đặt vé:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseInt(price).toLocaleString('vi-VN') + ' đ';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'da_thanh_toan':
        return <span className="badge bg-success px-3 py-2">Đã thanh toán</span>;
      case 'da_huy':
        return <span className="badge bg-danger px-3 py-2">Đã hủy</span>;
      case 'cho_thanh_toan':
        return <span className="badge bg-warning text-dark px-3 py-2">Chờ thanh toán</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{status}</span>;
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy vé này?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/ve/${bookingId}`);
      alert('Hủy vé thành công!');
      
      // Reload bookings
      fetchMyBookings();
    } catch (error) {
      console.error('Lỗi khi hủy vé:', error);
      alert(error.response?.data?.message || 'Không thể hủy vé');
    }
  };

  const handlePrint = (booking) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Vé xem phim - ${booking.ma_ve}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .ticket { border: 2px solid #000; padding: 20px; max-width: 600px; margin: 0 auto; }
            h1 { text-align: center; color: #dc3545; }
            .info { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h1>🎬 VÉ XEM PHIM</h1>
            <div class="info"><span class="label">Mã vé:</span> ${booking.ma_ve}</div>
            <div class="info"><span class="label">Phim:</span> ${booking.suat_chieu?.phim?.ten_phim}</div>
            <div class="info"><span class="label">Rạp:</span> ${booking.suat_chieu?.rap_chieu?.ten_rap}</div>
            <div class="info"><span class="label">Ngày chiếu:</span> ${formatDate(booking.suat_chieu?.ngay_chieu)}</div>
            <div class="info"><span class="label">Giờ chiếu:</span> ${booking.suat_chieu?.gio_chieu}</div>
            <div class="info"><span class="label">Phòng:</span> ${booking.suat_chieu?.phong_chieu}</div>
            <div class="info"><span class="label">Ghế:</span> ${booking.ghes?.map(g => g.hang_ghe + g.so_ghe).join(', ')}</div>
            <div class="info"><span class="label">Tổng tiền:</span> ${formatPrice(booking.tong_tien)}</div>
            <div class="info"><span class="label">Khách hàng:</span> ${booking.ho_ten}</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-danger" role="status"></div>
            <p className="mt-2">Đang tải lịch sử đặt vé...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">
              <i className="bi bi-ticket-perforated me-2 text-danger"></i>
              Lịch sử đặt vé của tôi
            </h2>

            {bookings.length === 0 ? (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Bạn chưa có vé nào. Hãy đặt vé để xem phim nhé!
              </div>
            ) : (
              <div className="row g-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-header bg-danger text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{booking.ma_ve}</strong>
                          {getStatusBadge(booking.trang_thai)}
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title text-danger mb-3">
                          {booking.suat_chieu?.phim?.ten_phim}
                        </h5>
                        
                        <div className="mb-2">
                          <i className="bi bi-building me-2 text-muted"></i>
                          <small className="text-muted">
                            {booking.suat_chieu?.rap_chieu?.ten_rap}
                          </small>
                        </div>

                        <div className="mb-2">
                          <i className="bi bi-calendar3 me-2 text-muted"></i>
                          <small>
                            {formatDate(booking.suat_chieu?.ngay_chieu)}
                          </small>
                        </div>

                        <div className="mb-2">
                          <i className="bi bi-clock me-2 text-muted"></i>
                          <small>
                            {booking.suat_chieu?.gio_chieu} - Phòng {booking.suat_chieu?.phong_chieu}
                          </small>
                        </div>

                        <div className="mb-3">
                          <i className="bi bi-grid-3x3 me-2 text-muted"></i>
                          <small>
                            Ghế: {booking.ghes?.map(g => g.hang_ghe + g.so_ghe).join(', ')}
                          </small>
                        </div>

                        <div className="border-top pt-3 mb-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>Tổng tiền:</strong>
                            <span className="text-danger fs-5">
                              {formatPrice(booking.tong_tien)}
                            </span>
                          </div>
                        </div>

                        <div className="text-muted small">
                          <i className="bi bi-clock-history me-1"></i>
                          Đặt lúc: {formatDateTime(booking.created_at)}
                        </div>
                      </div>
                      <div className="card-footer bg-white">
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary flex-fill"
                            onClick={() => handlePrint(booking)}
                          >
                            <i className="bi bi-printer me-1"></i>
                            In vé
                          </button>
                          {booking.trang_thai !== 'da_huy' && (
                            <button
                              className="btn btn-sm btn-outline-danger flex-fill"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Hủy
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
        }
        .card-header {
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default MyBookings;
