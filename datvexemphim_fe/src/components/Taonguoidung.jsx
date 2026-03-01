import { useState } from 'react';
import { nguoidungService } from '../services/api';
import { Link } from 'react-router-dom';

function TaoNguoiDung() {
    const [formData, setFormData] = useState({
        hoten: '',
        email: '',
        mat_khau: '',
        vai_tro: 'user'
    });

    const [errors, setErrors] = useState({});
    const [thongBao, setThongBao] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi khi người dùng sửa
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setThongBao({ type: '', message: '' });

        try {
            const response = await nguoidungService.taoMoi(formData);
            
            if (response.data.success) {
                setThongBao({
                    type: 'success',
                    message: 'Đăng ký tài khoản thành công! Bạn có thể đặt vé ngay bây giờ.'
                });

                setTimeout(() => {
                    Navigate('/dang-nhap');
                },2000);
                
                // Reset form
                setFormData({
                    hoten: '',
                    email: '',
                    mat_khau: '',
                    vai_tro: 'user'
                });
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                // Lỗi validation
                setErrors(error.response.data.errors);
                setThongBao({
                    type: 'error',
                    message: 'Vui lòng kiểm tra lại thông tin!'
                });
            } else {
                setThongBao({
                    type: 'error',
                    message: 'Có lỗi xảy ra! Vui lòng thử lại.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid px-3 py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow border-0">
                        <div className="card-header text-white">
                            <h4 className="mb-0 d-flex align-items-center justify-content-center">
                                <i className="bi bi-camera-reels-fill me-2"></i>
                                <span>Đăng Ký Tài Khoản</span>
                            </h4>
                            <p className="text-center mb-0 mt-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                Tạo tài khoản để đặt vé xem phim
                            </p>
                        </div>
                        <div className="card-body p-3 p-md-4">
                            {/* Thông báo */}
                            {thongBao.message && (
                                <div className={`alert alert-${thongBao.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
                                    {thongBao.message}
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setThongBao({ type: '', message: '' })}
                                    ></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Họ tên */}
                                <div className="mb-3">
                                    <label htmlFor="hoten" className="form-label">
                                        Họ tên <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.hoten ? 'is-invalid' : ''}`}
                                        id="hoten"
                                        name="hoten"
                                        value={formData.hoten}
                                        onChange={handleChange}
                                        placeholder="Nhập họ tên"
                                    />
                                    {errors.hoten && (
                                        <div className="invalid-feedback">
                                            {errors.hoten[0]}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Nhập email"
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {errors.email[0]}
                                        </div>
                                    )}
                                </div>

                                {/* Mật khẩu */}
                                <div className="mb-3">
                                    <label htmlFor="mat_khau" className="form-label">
                                        Mật khẩu <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.mat_khau ? 'is-invalid' : ''}`}
                                        id="mat_khau"
                                        name="mat_khau"
                                        value={formData.mat_khau}
                                        onChange={handleChange}
                                        placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                                    />
                                    {errors.mat_khau && (
                                        <div className="invalid-feedback">
                                            {errors.mat_khau[0]}
                                        </div>
                                    )}
                                </div>

                                {/* Nút submit */}
                                <div className="d-grid gap-2 mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                        style={{ padding: '12px' }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-ticket-perforated-fill me-2"></i>
                                                Đăng ký ngay
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-center" style={{ backgroundColor: '#f8f9fa' }}>
                            <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                Đã có tài khoản? <Link to="/dang-nhap" className="text-decoration-none fw-bold">Đăng nhập ngay</Link>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaoNguoiDung;