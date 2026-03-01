import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h3>🎬 Admin Panel</h3>
          <button 
            className="btn-toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`bi bi-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item">
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </Link>

          <div className="nav-section">
            <div className="nav-section-title">Quản lý nội dung</div>
            
            <Link to="/admin/phims" className="nav-item">
              <i className="bi bi-film"></i>
              <span>Phim</span>
            </Link>

            <Link to="/admin/raps" className="nav-item">
              <i className="bi bi-building"></i>
              <span>Rạp chiếu</span>
            </Link>

            <Link to="/admin/suat-chieu" className="nav-item">
              <i className="bi bi-calendar3"></i>
              <span>Suất chiếu</span>
            </Link>

            <Link to="/admin/banners" className="nav-item">
              <i className="bi bi-image"></i>
              <span>Banner</span>
            </Link>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Quản lý người dùng</div>
            
            <Link to="/admin/users" className="nav-item">
              <i className="bi bi-people"></i>
              <span>Người dùng</span>
            </Link>

            <Link to="/admin/ve" className="nav-item">
              <i className="bi bi-ticket-perforated"></i>
              <span>Vé đặt</span>
            </Link>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Khác</div>
            
            <Link to="/" className="nav-item" target="_blank">
              <i className="bi bi-house"></i>
              <span>Xem trang chủ</span>
            </Link>

            <button onClick={handleLogout} className="nav-item btn-logout">
              <i className="bi bi-box-arrow-right"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="btn-menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list"></i>
            </button>
            <h4>Quản trị hệ thống</h4>
          </div>

          <div className="header-right">
            <div className="admin-user">
              <i className="bi bi-person-circle"></i>
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
