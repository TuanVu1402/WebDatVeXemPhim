import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminRapList() {
  const [raps, setRaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchRaps();
  }, []);

  const fetchRaps = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/raps');
      if (response.data.success) {
        setRaps(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách rạp:', error);
      alert('Không thể tải danh sách rạp');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchRaps();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/raps/search?keyword=${searchKeyword}`);
      if (response.data.success) {
        setRaps(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, tenRap) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa rạp "${tenRap}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/api/raps/${id}`);
      if (response.data.success) {
        alert('Xóa rạp thành công!');
        fetchRaps();
      }
    } catch (error) {
      console.error('Lỗi khi xóa rạp:', error);
      const errorMsg = error.response?.data?.message || 'Không thể xóa rạp';
      alert(errorMsg);
    }
  };

  const filteredRaps = raps.filter(rap => {
    if (filterStatus !== '' && rap.trang_thai !== parseInt(filterStatus)) {
      return false;
    }
    return true;
  });

  const tongRap = filteredRaps.length;
  const rapHoatDong = filteredRaps.filter(r => r.trang_thai === 1).length;
  const rapTamNgung = filteredRaps.filter(r => r.trang_thai === 0).length;

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2><i className="bi bi-building me-2"></i>Quản lý Rạp Chiếu</h2>
        <Link to="/admin/raps/add" className="btn-primary">
          <i className="bi bi-plus-circle"></i>
          Thêm Rạp Mới
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
                placeholder="Tìm theo tên rạp hoặc địa chỉ..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn-search" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="1">Đang hoạt động</option>
              <option value="0">Tạm ngưng</option>
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn-secondary w-100" onClick={fetchRaps}>
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
            <i className="bi bi-building"></i>
          </div>
          <div className="stat-details">
            <h3>{tongRap}</h3>
            <p>Tổng số rạp</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-details">
            <h3>{rapHoatDong}</h3>
            <p>Đang hoạt động</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="bi bi-pause-circle"></i>
          </div>
          <div className="stat-details">
            <h3>{rapTamNgung}</h3>
            <p>Tạm ngưng</p>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Danh sách rạp ({filteredRaps.length})</h3>
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
                  <th>Tên rạp</th>
                  <th>Địa chỉ</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRaps.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
                      <p className="text-muted mt-2">Không có dữ liệu</p>
                    </td>
                  </tr>
                ) : (
                  filteredRaps.map((rap) => (
                    <tr key={rap.id}>
                      <td>#{rap.id}</td>
                      <td><strong>{rap.ten_rap}</strong></td>
                      <td>
                        <i className="bi bi-geo-alt text-muted me-1"></i>
                        {rap.dia_chi}
                      </td>
                      <td>
                        <i className="bi bi-telephone text-muted me-1"></i>
                        {rap.so_dien_thoai || '-'}
                      </td>
                      <td>
                        {rap.trang_thai === 1 ? (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Hoạt động
                          </span>
                        ) : (
                          <span className="badge bg-warning">
                            <i className="bi bi-pause-circle me-1"></i>
                            Tạm ngưng
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/raps/edit/${rap.id}`}
                            className="btn btn-sm btn-primary"
                            title="Sửa"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(rap.id, rap.ten_rap)}
                            className="btn btn-sm btn-danger"
                            title="Xóa"
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
    </div>
  );
}

export default AdminRapList;
