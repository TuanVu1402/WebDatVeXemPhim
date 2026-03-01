import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
  const [searchText, setSearchText] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid px-4">
          {/* Logo */}
          <Link to="/" className="navbar-brand fw-bold" style={{ color: '#e74c3c', fontSize: '1.8rem' }}>
            move<span style={{ color: '#000' }}>ok</span>
          </Link>

          {/* Toggle button for mobile */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link fw-semibold text-danger">
                  Đặt vé phim chiếu rạp
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Lịch chiếu
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/lich-chieu" className="dropdown-item">Lịch chiếu theo rạp</Link></li>
                  <li><Link to="/lich-chieu-phim" className="dropdown-item">Lịch chiếu theo phim</Link></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Phim
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/phim-dang-chieu" className="dropdown-item">Phim đang chiếu</Link></li>
                  <li><Link to="/phim-sap-chieu" className="dropdown-item">Phim sắp chiếu</Link></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Rạp
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/raps" className="dropdown-item">Danh sách rạp</Link></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Tin tức
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/tin-tuc" className="dropdown-item">Tin điện ảnh</Link></li>
                  <li><Link to="/khuyen-mai" className="dropdown-item">Khuyến mãi</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link to="/cong-dong" className="nav-link">
                  Cộng đồng
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-bookings" className="nav-link text-primary">
                  <i className="bi bi-ticket-perforated me-1"></i>
                  Vé của tôi
                </Link>
              </li>
            </ul>

            {/* Search Bar */}
            <form className="d-flex me-3" style={{ minWidth: '250px' }}>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control border-start-0"
                  placeholder="Từ khóa tìm kiếm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ boxShadow: 'none' }}
                />
              </div>
            </form>

            {/* Right Icons */}
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-link text-dark text-decoration-none">
                <i className="bi bi-geo-alt fs-5"></i>
              </button>
              <button className="btn btn-link text-dark text-decoration-none">
                <i className="bi bi-question-circle fs-5 me-1"></i>
                <span className="d-none d-lg-inline">Hỗ trợ</span>
              </button>
              <div className="dropdown">
                <button className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-1" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle fs-5"></i>
                  {user && (
                    <span className="d-none d-lg-inline fw-semibold" style={{ fontSize: '0.9rem' }}>
                      {user.hoten}
                    </span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {user ? (
                    <>
                      <li className="dropdown-header">
                        <strong>{user.hoten}</strong>
                        <br />
                        <small className="text-muted">{user.email}</small>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link to="/my-bookings" className="dropdown-item">
                        <i className="bi bi-ticket-perforated me-2"></i>Vé của tôi
                      </Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i>Đăng xuất
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/dang-nhap" className="dropdown-item">
                        <i className="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
                      </Link></li>
                      <li><Link to="/dang-ky" className="dropdown-item">
                        <i className="bi bi-person-plus me-2"></i>Đăng ký
                      </Link></li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
  );
}

export default Header;