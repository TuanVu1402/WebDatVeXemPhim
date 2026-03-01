import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminPhimForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ten_phim: '',
    the_loai: '',
    dao_dien: '',
    dien_vien: '',
    quoc_gia: '',
    nam_san_xuat: new Date().getFullYear(),
    thoi_luong: '',
    mo_ta: '',
    hinh_anh: '',
    trailer: '',
    trang_thai: 'dang_chieu',
    ngay_khoi_chieu: '',
    is_hot: false
  });

  useEffect(() => {
    if (id) {
      fetchPhim();
    }
  }, [id]);

  const fetchPhim = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/phims/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin phim:', error);
      alert('Không tìm thấy phim!');
      navigate('/admin/phims');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/phims/${id}`, formData);
        alert('Cập nhật phim thành công!');
      } else {
        await axios.post('http://localhost:8000/api/phims', formData);
        alert('Thêm phim thành công!');
      }
      navigate('/admin/phims');
    } catch (error) {
      console.error('Lỗi:', error);
      // Show detailed backend error when available
      const backendMessage = error.response?.data?.message;
      const backendError = error.response?.data?.error || error.response?.data || null;
      let detail = backendMessage || error.message;
      if (backendError) {
        // append error details (stringify if object)
        detail += '\n\n' + (typeof backendError === 'string' ? backendError : JSON.stringify(backendError));
      }
      alert('Có lỗi xảy ra: ' + detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-phim-form">
      <div className="page-header">
        <h2>
          <i className="bi bi-film me-2"></i>
          {id ? 'Cập nhật' : 'Thêm'} phim
        </h2>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h4>Thông tin cơ bản</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Tên phim <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="ten_phim"
                  className="form-control"
                  value={formData.ten_phim}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Thể loại <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="the_loai"
                  className="form-control"
                  value={formData.the_loai}
                  onChange={handleChange}
                  placeholder="Hành động, Phiêu lưu..."
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Đạo diễn</label>
                <input
                  type="text"
                  name="dao_dien"
                  className="form-control"
                  value={formData.dao_dien}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Quốc gia</label>
                <input
                  type="text"
                  name="quoc_gia"
                  className="form-control"
                  value={formData.quoc_gia}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Diễn viên</label>
              <input
                type="text"
                name="dien_vien"
                className="form-control"
                value={formData.dien_vien}
                onChange={handleChange}
                placeholder="Nguyễn Văn A, Trần Thị B..."
              />
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="mo_ta"
                className="form-control"
                rows="5"
                value={formData.mo_ta}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Chi tiết */}
          <div className="form-section">
            <h4>Chi tiết phim</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Thời lượng (phút) <span className="text-danger">*</span></label>
                <input
                  type="number"
                  name="thoi_luong"
                  className="form-control"
                  value={formData.thoi_luong}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Năm sản xuất</label>
                <input
                  type="number"
                  name="nam_san_xuat"
                  className="form-control"
                  value={formData.nam_san_xuat}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                />
              </div>

              <div className="form-group">
                <label>Ngày khởi chiếu</label>
                <input
                  type="date"
                  name="ngay_khoi_chieu"
                  className="form-control"
                  value={formData.ngay_khoi_chieu}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="form-section">
            <h4>Hình ảnh & Video</h4>
            <div className="form-row">
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
                {formData.hinh_anh && (
                  <img
                    src={formData.hinh_anh}
                    alt="Preview"
                    style={{ width: '200px', marginTop: '10px', borderRadius: '8px' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>

              <div className="form-group">
                <label>Link trailer (YouTube) <span className="text-danger">*</span></label>
                <input
                  type="url"
                  name="trailer"
                  className="form-control"
                  value={formData.trailer}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                
              </div>
            </div>
          </div>

          {/* Trạng thái */}
          <div className="form-section">
            <h4>Trạng thái</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Trạng thái chiếu</label>
                <select
                  name="trang_thai"
                  className="form-control"
                  value={formData.trang_thai}
                  onChange={handleChange}
                >
                  <option value="dang_chieu">Đang chiếu</option>
                  <option value="sap_chieu">Sắp chiếu</option>
                  <option value="ngung_chieu">Ngừng chiếu</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_hot"
                    checked={formData.is_hot}
                    onChange={handleChange}
                  />
                  <span>Phim HOT</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  {id ? 'Cập nhật' : 'Thêm'} phim
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin/phims')}
            >
              <i className="bi bi-x-circle me-2"></i>
              Hủy
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-section h4 {
          margin-bottom: 20px;
          color: #2c3e50;
          font-size: 18px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-top: 30px;
        }

        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .text-danger {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
}

export default AdminPhimForm;
