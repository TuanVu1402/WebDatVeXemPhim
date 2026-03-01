import { useLocation, useNavigate } from 'react-router-dom';

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h3>Không tìm thấy thông tin đặt vé</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Về trang chủ
        </button>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body text-center p-5">
              {/* Success Icon */}
              <div className="success-icon mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{fontSize: '100px'}}></i>
              </div>

              <h1 className="text-success mb-3">Đặt vé thành công!</h1>
              <p className="text-muted mb-4">
                Cảm ơn bạn đã đặt vé. Vui lòng kiểm tra email để nhận thông tin chi tiết.
              </p>

              {/* Booking Details */}
              <div className="booking-details bg-light p-4 rounded mb-4">
                <h4 className="mb-3">Thông tin đặt vé</h4>
                
                <div className="mb-3 text-start">
                  <p className="mb-2">
                    <strong>Mã đặt vé:</strong>{' '}
                    <span className="badge bg-danger fs-6">{booking.ma_dat_ve}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Phim:</strong> {booking.suat_chieu?.phim?.ten_phim}
                  </p>
                  <p className="mb-2">
                    <strong>Rạp:</strong> {booking.suat_chieu?.rap_chieu?.ten_rap}
                  </p>
                  <p className="mb-2">
                    <strong>Phòng:</strong> {booking.suat_chieu?.phong_chieu}
                  </p>
                  <p className="mb-2">
                    <strong>Ngày chiếu:</strong> {formatDate(booking.suat_chieu?.ngay_chieu)}
                  </p>
                  <p className="mb-2">
                    <strong>Giờ chiếu:</strong> {booking.suat_chieu?.gio_chieu}
                  </p>
                  <p className="mb-2">
                    <strong>Ghế:</strong>{' '}
                    {booking.ghe_da_dat?.map(g => g.so_ghe).join(', ')}
                  </p>
                  <p className="mb-2">
                    <strong>Số lượng vé:</strong> {booking.ve?.so_luong_ve}
                  </p>
                  <hr />
                  <h4 className="text-danger mb-0">
                    <strong>Tổng tiền:</strong> {formatPrice(booking.ve?.tong_tien)}
                  </h4>
                </div>
              </div>

              {/* Customer Info */}
              <div className="customer-info bg-light p-4 rounded mb-4">
                <h5 className="mb-3">Thông tin khách hàng</h5>
                <p className="mb-2"><strong>Họ tên:</strong> {booking.ve?.ho_ten}</p>
                <p className="mb-2"><strong>Email:</strong> {booking.ve?.email}</p>
                <p className="mb-0"><strong>SĐT:</strong> {booking.ve?.so_dien_thoai}</p>
              </div>

              {/* Actions */}
              <div className="d-flex gap-3 justify-content-center">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-house-door me-2"></i>
                  Về trang chủ
                </button>
                <button 
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer me-2"></i>
                  In vé
                </button>
              </div>

              {/* Note */}
              <div className="alert alert-info mt-4 text-start">
                <strong><i className="bi bi-info-circle me-2"></i>Lưu ý:</strong>
                <ul className="mb-0 mt-2">
                  <li>Vui lòng đến rạp trước giờ chiếu 15 phút</li>
                  <li>Mang theo mã đặt vé hoặc email xác nhận</li>
                  <li>Liên hệ hotline nếu cần hỗ trợ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
