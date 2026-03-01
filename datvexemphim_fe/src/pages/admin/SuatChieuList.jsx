import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminSuatChieuList() {
  const [suatChieus, setSuatChieus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPhim, setFilterPhim] = useState('');
  const [filterRap, setFilterRap] = useState('');
  const [filterNgay, setFilterNgay] = useState('');

  useEffect(() => {
    fetchSuatChieus();
  }, []);

  const fetchSuatChieus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/suat-chieu');
      console.log('Response suất chiếu:', response.data);
      if (response.data.success && Array.isArray(response.data.data)) {
        setSuatChieus(response.data.data);
      } else {
        setSuatChieus([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách suất chiếu:', error);
      setSuatChieus([]);
      alert('Không thể tải danh sách suất chiếu: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa suất chiếu này?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/api/suat-chieu/${id}`);
      if (response.data.success) {
        alert('Xóa suất chiếu thành công!');
        fetchSuatChieus();
      }
    } catch (error) {
      console.error('Lỗi khi xóa suất chiếu:', error);
      alert(error.response?.data?.message || 'Không thể xóa suất chiếu');
    }
  };

  const filteredSuatChieus = Array.isArray(suatChieus) ? suatChieus.filter(suat => {
    if (filterPhim && !suat.phim?.ten_phim.toLowerCase().includes(filterPhim.toLowerCase())) {
      return false;
    }
    if (filterRap && !suat.rap_chieu?.ten_rap.toLowerCase().includes(filterRap.toLowerCase())) {
      return false;
    }
    if (filterNgay && suat.ngay_chieu !== filterNgay) {
      return false;
    }
    return true;
  }) : [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h2><i className="bi bi-calendar-event me-2"></i>Quản lý Suất Chiếu</h2>
        <Link to="/admin/suat-chieu/add" className="btn-primary">
          <i className="bi bi-plus-circle"></i>
          Thêm Suất Chiếu
        </Link>
      </div>

      {/* Bộ lọc */}
      <div className="admin-card mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo phim..."
              value={filterPhim}
              onChange={(e) => setFilterPhim(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo rạp..."
              value={filterRap}
              onChange={(e) => setFilterRap(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={filterNgay}
              onChange={(e) => setFilterNgay(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button 
              className="btn-secondary w-100" 
              onClick={() => {
                setFilterPhim('');
                setFilterRap('');
                setFilterNgay('');
                fetchSuatChieus();
              }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Danh sách suất chiếu ({filteredSuatChieus.length})</h3>
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
                  <th>Phim</th>
                  <th>Rạp</th>
                  <th>Phòng</th>
                  <th>Ngày chiếu</th>
                  <th>Giờ chiếu</th>
                  <th>Giá vé</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuatChieus.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
                      <p className="text-muted mt-2">Không có dữ liệu</p>
                    </td>
                  </tr>
                ) : (
                  filteredSuatChieus.map((suat) => (
                    <tr key={suat.id}>
                      <td>#{suat.id}</td>
                      <td>
                        <strong>{suat.phim?.ten_phim || 'N/A'}</strong>
                      </td>
                      <td>{suat.rap_chieu?.ten_rap || 'N/A'}</td>
                      <td>
                        <span className="badge bg-info">
                          {suat.phong_chieu}
                        </span>
                      </td>
                      <td>
                        <i className="bi bi-calendar3 text-muted me-1"></i>
                        {formatDate(suat.ngay_chieu)}
                      </td>
                      <td>
                        <i className="bi bi-clock text-muted me-1"></i>
                        {suat.gio_chieu}
                      </td>
                      <td>
                        <strong className="text-danger">
                          {formatPrice(suat.gia_ve)}
                        </strong>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/suat-chieu/edit/${suat.id}`}
                            className="btn btn-sm btn-primary"
                            title="Sửa"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(suat.id)}
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

export default AdminSuatChieuList;
