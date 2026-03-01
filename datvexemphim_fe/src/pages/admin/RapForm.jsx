import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminRapForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ten_rap: '',
    dia_chi: '',
    so_dien_thoai: '',
    mo_ta: '',
    trang_thai: 1
  });

  useEffect(() => {
    if (id) {
      fetchRap();
    }
  }, [id]);

  const fetchRap = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/raps/${id}`);
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin rạp:', error);
      alert('Không tìm thấy rạp!');
      navigate('/admin/raps');
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
    
    if (!formData.ten_rap || !formData.dia_chi) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    setLoading(true);

    try {
      if (id) {
        const response = await axios.put(`http://localhost:8000/api/raps/${id}`, formData);
        if (response.data.success) {
          alert('Cập nhật rạp thành công!');
          navigate('/admin/raps');
        }
      } else {
        const response = await axios.post('http://localhost:8000/api/raps', formData);
        if (response.data.success) {
          alert('Thêm rạp thành công!');
          navigate('/admin/raps');
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
          <i className="bi bi-building me-2"></i>
          {id ? 'Cập nhật' : 'Thêm'} Rạp Chiếu
        </h2>
        <Link to="/admin/raps" className="btn-secondary">
          <i className="bi bi-arrow-left"></i>
          Quay lại
        </Link>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-section">
            <h4 className="form-section-title">Thông tin cơ bản</h4>
            
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Tên rạp <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="ten_rap"
                    className="form-control"
                    value={formData.ten_rap}
                    onChange={handleChange}
                    placeholder="Nhập tên rạp chiếu"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="so_dien_thoai"
                    className="form-control"
                    value={formData.so_dien_thoai}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label>Địa chỉ <span className="text-danger">*</span></label>
                  <textarea
                    name="dia_chi"
                    className="form-control"
                    value={formData.dia_chi}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ đầy đủ của rạp"
                    rows="2"
                    required
                  ></textarea>
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
                    placeholder="Nhập mô tả về rạp (tùy chọn)"
                    rows="4"
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
                    <i className="bi bi-check-circle me-1"></i>
                    Đang hoạt động
                  </span>
                ) : (
                  <span className="text-warning">
                    <i className="bi bi-pause-circle me-1"></i>
                    Tạm ngưng
                  </span>
                )}
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/raps" className="btn-secondary">
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
  );
}

export default AdminRapForm;
