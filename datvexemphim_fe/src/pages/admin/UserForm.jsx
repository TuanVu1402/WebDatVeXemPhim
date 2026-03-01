import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hoten: '',
    email: '',
    mat_khau: '',
    vai_tro: 'user'
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/nguoidung/${id}`);
      if (response.data.success) {
        const user = response.data.data;
        setFormData({
          hoten: user.hoten,
          email: user.email,
          mat_khau: '', // Không hiển thị mật khẩu cũ
          vai_tro: user.vai_tro
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      alert('Không tìm thấy người dùng!');
      navigate('/admin/users');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.hoten || !formData.email) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    if (!id && !formData.mat_khau) {
      alert('Mật khẩu không được để trống khi tạo mới!');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = { ...formData };
      // Nếu đang edit và không đổi mật khẩu thì bỏ field mat_khau
      if (id && !formData.mat_khau) {
        delete dataToSend.mat_khau;
      }

      if (id) {
        const response = await axios.put(`http://localhost:8000/api/nguoidung/${id}`, dataToSend);
        if (response.data.success) {
          alert('Cập nhật người dùng thành công!');
          navigate('/admin/users');
        }
      } else {
        const response = await axios.post('http://localhost:8000/api/taonguoidung', dataToSend);
        if (response.data.success) {
          alert('Thêm người dùng thành công!');
          navigate('/admin/users');
        }
      }
    } catch (error) {
      console.error('Lỗi:', error);
      const errorMsg = error.response?.data?.message || error.message;
      const errors = error.response?.data?.errors;
      let fullError = 'Có lỗi xảy ra: ' + errorMsg;
      if (errors) {
        fullError += '\n\n' + Object.values(errors).flat().join('\n');
      }
      alert(fullError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2>
          <i className="bi bi-people me-2"></i>
          {id ? 'Cập nhật' : 'Thêm'} Người dùng
        </h2>
        <Link to="/admin/users" className="btn-secondary">
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
                  <label>Họ tên <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="hoten"
                    className="form-control"
                    value={formData.hoten}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Email <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Mật khẩu {id ? '' : <span className="text-danger">*</span>}
                  </label>
                  <input
                    type="password"
                    name="mat_khau"
                    className="form-control"
                    value={formData.mat_khau}
                    onChange={handleChange}
                    placeholder={id ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                    required={!id}
                  />
                  {id && (
                    <small className="text-muted">
                      Để trống nếu không muốn thay đổi mật khẩu
                    </small>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Vai trò <span className="text-danger">*</span></label>
                  <select
                    name="vai_tro"
                    className="form-control"
                    value={formData.vai_tro}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/admin/users" className="btn-secondary">
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

      {/* Preview Card */}
      <div className="admin-card mt-4">
        <div className="admin-card-header">
          <h5 className="mb-0">
            <i className="bi bi-eye me-2"></i>
            Xem trước thông tin
          </h5>
        </div>
        <div className="p-4">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Họ tên:</strong> {formData.hoten || '(Chưa nhập)'}</p>
              <p><strong>Email:</strong> {formData.email || '(Chưa nhập)'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Vai trò:</strong> {' '}
                {formData.vai_tro === 'admin' ? (
                  <span className="badge bg-danger">Admin</span>
                ) : (
                  <span className="badge bg-primary">User</span>
                )}
              </p>
              <p><strong>Mật khẩu:</strong> {formData.mat_khau ? '••••••' : '(Chưa nhập)'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUserForm;
