import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminPhimList() {
  const [phims, setPhims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPhims();
  }, []);

  const fetchPhims = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/phims');
      setPhims(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa phim này?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/phims/${id}`);
      alert('Xóa phim thành công!');
      fetchPhims();
    } catch (error) {
      console.error('Lỗi khi xóa phim:', error);
      alert('Không thể xóa phim!');
    }
  };

  const filteredPhims = phims.filter(phim =>
    phim.ten_phim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-phim-list">
      <div className="page-header">
        <h2><i className="bi bi-film me-2"></i>Quản lý Phim</h2>
        <Link to="/admin/phims/add" className="btn-primary">
          <i className="bi bi-plus-circle"></i>
          Thêm phim mới
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Danh sách phim ({filteredPhims.length})</h3>
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
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
                  <th>Hình ảnh</th>
                  <th>Tên phim</th>
                  <th>Thể loại</th>
                  <th>Thời lượng</th>
                  <th>Trạng thái</th>
                  <th>Hot</th>
                  <th>Lượt xem</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPhims.map((phim) => (
                  <tr key={phim.id}>
                    <td>#{phim.id}</td>
                    <td>
                      <img
                        src={phim.hinh_anh || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="80"%3E%3Crect fill="%23ddd" width="60" height="80"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'}
                        alt={phim.ten_phim}
                        style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => {
                          e.target.onerror = null; // Ngăn loop vô hạn
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="80"%3E%3Crect fill="%23ddd" width="60" height="80"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </td>
                    <td>
                      <strong>{phim.ten_phim}</strong>
                    </td>
                    <td>{phim.the_loai}</td>
                    <td>{phim.thoi_luong} phút</td>
                    <td>
                      <span className={`badge ${
                        phim.trang_thai === 'dang_chieu' ? 'bg-success' : 
                        phim.trang_thai === 'sap_chieu' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                        {phim.trang_thai === 'dang_chieu' ? 'Đang chiếu' :
                         phim.trang_thai === 'sap_chieu' ? 'Sắp chiếu' : 'Ngừng chiếu'}
                      </span>
                    </td>
                    <td>
                      {phim.is_hot ? (
                        <span className="badge bg-danger">
                          <i className="bi bi-fire"></i> HOT
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>{phim.luot_xem?.toLocaleString() || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/phims/edit/${phim.id}`}
                          className="btn btn-sm btn-primary"
                          title="Sửa"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(phim.id)}
                          className="btn btn-sm btn-danger"
                          title="Xóa"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .search-box {
          position: relative;
          width: 300px;
        }

        .search-box i {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-box input {
          padding-left: 40px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default AdminPhimList;
