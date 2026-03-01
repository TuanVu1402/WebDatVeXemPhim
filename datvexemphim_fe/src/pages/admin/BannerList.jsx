import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminBannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/banners');
      if (response.data.success) {
        setBanners(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách banner:', error);
      alert('Không thể tải danh sách banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/api/banners/${id}`);
      if (response.data.success) {
        alert('Xóa banner thành công!');
        fetchBanners();
      }
    } catch (error) {
      console.error('Lỗi khi xóa banner:', error);
      alert(error.response?.data?.message || 'Không thể xóa banner');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/banners/${id}`, {
        trang_thai: currentStatus === 1 ? 0 : 1
      });
      if (response.data.success) {
        alert('Cập nhật trạng thái thành công!');
        fetchBanners();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Không thể cập nhật trạng thái');
    }
  };

  const activeBanners = banners.filter(b => b.trang_thai === 1).length;
  const inactiveBanners = banners.filter(b => b.trang_thai === 0).length;

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2><i className="bi bi-images me-2"></i>Quản lý Banner</h2>
        <Link to="/admin/banners/add" className="btn-primary">
          <i className="bi bi-plus-circle"></i>
          Thêm Banner
        </Link>
      </div>

      {/* Thống kê */}
      <div className="stats-grid mb-4">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="bi bi-images"></i>
          </div>
          <div className="stat-details">
            <h3>{banners.length}</h3>
            <p>Tổng banner</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="bi bi-eye"></i>
          </div>
          <div className="stat-details">
            <h3>{activeBanners}</h3>
            <p>Đang hiển thị</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="bi bi-eye-slash"></i>
          </div>
          <div className="stat-details">
            <h3>{inactiveBanners}</h3>
            <p>Đã ẩn</p>
          </div>
        </div>
      </div>

      {/* Danh sách */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Danh sách banner ({banners.length})</h3>
          <button className="btn-secondary" onClick={fetchBanners}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Làm mới
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger"></div>
          </div>
        ) : (
          <div className="row g-4 p-4">
            {banners.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
                <p className="text-muted mt-2">Chưa có banner nào</p>
              </div>
            ) : (
              banners.map((banner) => (
                <div className="col-md-6 col-lg-4" key={banner.id}>
                  <div className="card h-100">
                    <div className="position-relative">
                      <img
                        src={banner.hinh_anh || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23ddd" width="400" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'}
                        alt={banner.tieu_de}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23ddd" width="400" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <span 
                        className={`badge position-absolute top-0 end-0 m-2 ${banner.trang_thai === 1 ? 'bg-success' : 'bg-secondary'}`}
                      >
                        {banner.trang_thai === 1 ? 'Hiển thị' : 'Đã ẩn'}
                      </span>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{banner.tieu_de}</h5>
                      <p className="card-text text-muted small">
                        {banner.mo_ta || 'Không có mô tả'}
                      </p>
                      {banner.lien_ket && (
                        <p className="card-text">
                          <small className="text-muted">
                            <i className="bi bi-link-45deg me-1"></i>
                            <a href={banner.lien_ket} target="_blank" rel="noopener noreferrer">
                              {banner.lien_ket.substring(0, 40)}...
                            </a>
                          </small>
                        </p>
                      )}
                      <div className="d-flex gap-2 mt-3">
                        <button
                          className={`btn btn-sm flex-fill ${banner.trang_thai === 1 ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleStatus(banner.id, banner.trang_thai)}
                        >
                          <i className={`bi bi-${banner.trang_thai === 1 ? 'eye-slash' : 'eye'} me-1`}></i>
                          {banner.trang_thai === 1 ? 'Ẩn' : 'Hiện'}
                        </button>
                        <Link
                          to={`/admin/banners/edit/${banner.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBannerList;
