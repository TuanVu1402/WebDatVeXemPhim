import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminBannerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tieu_de: '',
    hinh_anh: '',
    lien_ket: '',
    mo_ta: '',
    trang_thai: 1
  });

  useEffect(() => {
    if (id) {
      fetchBanner();
    }
  }, [id]);

  const fetchBanner = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/banners/${id}`);
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin banner:', error);
      alert('Không tìm thấy banner!');
      navigate('/admin/banners');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tieu_de || !formData.hinh_anh) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    setLoading(true);

    try {
      if (id) {
        const response = await axios.put(`http://localhost:8000/api/banners/${id}`, formData);
        if (response.data.success) {
          alert('Cập nhật banner thành công!');
          navigate('/admin/banners');
        }
      } else {
        const response = await axios.post('http://localhost:8000/api/banners', formData);
        if (response.data.success) {
          alert('Thêm banner thành công!');
          navigate('/admin/banners');
        }
      }
    } catch (error) {
      console.error('Lỗi:', error);
      const errorMsg = error.response?.data?.message || error.message;
      alert('Có lỗi xảy ra: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2>
          <i className="bi bi-images me-2"></i>
          {id ? 'Cập nhật' : 'Thêm'} Banner
        </h2>
        <Link to="/admin/banners" className="btn-secondary">
          <i className="bi bi-arrow-left"></i>
          Quay lại
        </Link>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="admin-card">
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-section">
                <h4 className="form-section-title">Thông tin banner</h4>
                
                <div className="row g-3">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Tiêu đề <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="tieu_de"
                        className="form-control"
                        value={formData.tieu_de}
                        onChange={handleChange}
                        placeholder="Nhập tiêu đề banner"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Link hình ảnh <span className="text-danger">*</span></label>
                      <input
                        type="url"
                        name="hinh_anh"
                        className="form-control"
                        value={formData.hinh_anh}
                        onChange={handleChange}
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Link điều hướng</label>
                      <input
                        type="url"
                        name="lien_ket"
                        className="form-control"
                        value={formData.lien_ket}
                        onChange={handleChange}
                        placeholder="https://... (Link khi click vào banner)"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Mô tả</label>
                      <textarea
                        name="mo_ta"
                        className="form-control"
                        value={formData.mo_ta}
                        onChange={handleChange}
                        placeholder="Nhập mô tả (tùy chọn)"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">Trạng thái</h4>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="trang_thai"
                    id="trang_thai"
                    checked={formData.trang_thai === 1}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="trang_thai">
                    {formData.trang_thai === 1 ? (
                      <span className="text-success">
                        <i className="bi bi-eye me-1"></i>
                        Hiển thị trên trang chủ
                      </span>
                    ) : (
                      <span className="text-warning">
                        <i className="bi bi-eye-slash me-1"></i>
                        Đã ẩn
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <Link to="/admin/banners" className="btn-secondary">
                  <i className="bi bi-x-circle"></i>
                  Hủy
                </Link>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save"></i>
                      {id ? 'Cập nhật' : 'Thêm mới'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="admin-card">
            <div className="admin-card-header">
              <h5 className="mb-0">
                <i className="bi bi-eye me-2"></i>
                Xem trước
              </h5>
            </div>
            <div className="p-3">
              {formData.hinh_anh ? (
                <img
                  src={formData.hinh_anh}
                  alt={formData.tieu_de}
                  className="img-fluid rounded"
                  style={{ width: '100%', height: 'auto' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23ddd" width="400" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELỗi tải ảnh%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="text-center py-5 bg-light rounded">
                  <i className="bi bi-image text-muted" style={{fontSize: '3rem'}}></i>
                  <p className="text-muted mt-2 mb-0">Chưa có hình ảnh</p>
                </div>
              )}
              <div className="mt-3">
                <h6>{formData.tieu_de || '(Chưa có tiêu đề)'}</h6>
                <p className="text-muted small mb-0">
                  {formData.mo_ta || '(Chưa có mô tả)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBannerForm;
