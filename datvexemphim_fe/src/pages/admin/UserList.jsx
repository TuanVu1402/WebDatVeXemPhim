import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/nguoidung');
      console.log('Response người dùng:', response.data);
      if (response.data.success && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      setUsers([]);
      alert('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, hoten) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${hoten}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/api/nguoidung/${id}`);
      if (response.data.success) {
        alert('Xóa người dùng thành công!');
        fetchUsers();
      }
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      alert(error.response?.data?.message || 'Không thể xóa người dùng');
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (searchKeyword && !user.hoten.toLowerCase().includes(searchKeyword.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return false;
    }
    if (filterRole && user.vai_tro !== filterRole) {
      return false;
    }
    return true;
  }) : [];

  const totalUsers = filteredUsers.length;
  const adminUsers = filteredUsers.filter(u => u.vai_tro === 'admin').length;
  const normalUsers = filteredUsers.filter(u => u.vai_tro === 'user').length;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2><i className="bi bi-people me-2"></i>Quản lý Người dùng</h2>
        <Link to="/admin/users/add" className="btn-primary">
          <i className="bi bi-plus-circle"></i>
          Thêm Người dùng
        </Link>
      </div>

      {/* Bộ lọc */}
      <div className="admin-card mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="search-box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm theo tên hoặc email..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn-secondary w-100" onClick={fetchUsers}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Thống kê */}
      <div className="stats-grid mb-4">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-details">
            <h3>{totalUsers}</h3>
            <p>Tổng người dùng</p>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">
            <i className="bi bi-shield-check"></i>
          </div>
          <div className="stat-details">
            <h3>{adminUsers}</h3>
            <p>Admin</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="bi bi-person"></i>
          </div>
          <div className="stat-details">
            <h3>{normalUsers}</h3>
            <p>User thường</p>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Danh sách người dùng ({filteredUsers.length})</h3>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
                      <p className="text-muted mt-2">Không có dữ liệu</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2">
                            {user.hoten.charAt(0).toUpperCase()}
                          </div>
                          <strong>{user.hoten}</strong>
                        </div>
                      </td>
                      <td>
                        <i className="bi bi-envelope text-muted me-1"></i>
                        {user.email}
                      </td>
                      <td>
                        {user.vai_tro === 'admin' ? (
                          <span className="badge bg-danger">
                            <i className="bi bi-shield-check me-1"></i>
                            Admin
                          </span>
                        ) : (
                          <span className="badge bg-primary">
                            <i className="bi bi-person me-1"></i>
                            User
                          </span>
                        )}
                      </td>
                      <td>
                        <i className="bi bi-calendar3 text-muted me-1"></i>
                        {formatDate(user.created_at)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/users/edit/${user.id}`}
                            className="btn btn-sm btn-primary"
                            title="Sửa"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id, user.hoten)}
                            className="btn btn-sm btn-danger"
                            title="Xóa"
                            disabled={user.vai_tro === 'admin'}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}

export default AdminUserList;
