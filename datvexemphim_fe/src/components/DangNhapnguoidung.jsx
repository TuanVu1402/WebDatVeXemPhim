import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom';
import { nguoidungService } from '../services/api';

function DangNhap() {
   const navigate = useNavigate();  

    const [formData, setFormData] = useState({
        email: '',
        mat_khau: ''
    });

    const [showPassword, setShowPassword] = useState(false);


    const[errors,setErrors]=useState({});
    const[thongBao,setThongBao]=useState({type:'',message:''});
    const[loading,setLoading]=useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if(errors[name]){
            setErrors(prev=>({
                ...prev,
                [name]:''
            }));
        }                   
        
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setThongBao({type:'',message:''});
        try {
            const response = await nguoidungService.dangNhap(formData);

            if(response.data.success){
                localStorage.setItem('user', JSON.stringify(response.data.data));
                setThongBao({ 
                    type: 'success', 
                    message: `Chào mừng ${response.data.data.hoten}! Đăng nhập thành công.` 
                });
                
                // Chuyển hướng sau 1.5s
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
        } catch (error) {

            if (error.response.status ===422) {
                setErrors(error.response.data.errors);
            }
            else if(error.response.status ===401){
                setThongBao({ type: 'error', message: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.' });
            }
            else{
            setThongBao({ type: 'error', message: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.' });

            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container-fluid px-3 py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
                    <div className="card shadow border-0">
                        <div className="card-header text-white">
                            <h4 className="mb-0 d-flex align-items-center justify-content-center">
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                <span>Đăng Nhập</span>
                            </h4>
                            <p className="text-center mb-0 mt-2" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                Đăng nhập để đặt vé xem phim
                            </p>
                        </div>
                        <div className="card-body p-3 p-md-4">
                            {


                                thongBao.message && (
                                    <div className={`alert alert-${thongBao.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                                        {thongBao.message}
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                )   

                            }
                            <form onSubmit={handleSubmit}>
                                {/* Email */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <i className="bi bi-envelope me-1"></i>
                                        Email <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Nhập email của bạn"
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
                                        <i className="bi bi-lock me-1"></i>
                                        Mật khẩu <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className={`form-control ${errors.mat_khau ? 'is-invalid' : ''}`}
                                            id="mat_khau"
                                            name="mat_khau"
                                            value={formData.mat_khau}
                                            onChange={handleChange}
                                            placeholder="Nhập mật khẩu"
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                        </button>
                                        {errors.mat_khau && (
                                            <div className="invalid-feedback d-block">
                                                {errors.mat_khau[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Ghi nhớ & Quên mật khẩu */}
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="remember"
                                        />
                                        <label className="form-check-label" htmlFor="remember">
                                            Ghi nhớ đăng nhập
                                        </label>
                                    </div>
                                    <a href="#" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>
                                        Quên mật khẩu?
                                    </a>
                                </div>

                                {/* Nút đăng nhập */}
                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        style={{ padding: '12px' }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Đang đăng nhập...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Đăng nhập
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Đăng nhập mạng xã hội */}
                                <div className="text-center my-3">
                                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>hoặc đăng nhập với</span>
                                </div>

                                <div className="row g-2">
                                    <div className="col-6">
                                        <button type="button" className="btn btn-outline-danger w-100">
                                            <i className="bi bi-google me-1"></i> Google
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button type="button" className="btn btn-outline-primary w-100">
                                            <i className="bi bi-facebook me-1"></i> Facebook
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-center" style={{ backgroundColor: '#f8f9fa' }}>
                            <small className="text-muted">
                                <i className="bi bi-person-plus me-1"></i>
                                Chưa có tài khoản? <Link to="/dang-ky" className="text-decoration-none fw-bold">Đăng ký ngay</Link>
                            </small>
                        </div>
                    </div>

                    {/* Thông tin bảo mật */}
                    <div className="text-center mt-3">
                        <small className="text-white-50">
                            <i className="bi bi-shield-check me-1"></i>
                            Thông tin của bạn được bảo mật tuyệt đối
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DangNhap;
