import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function VeList() {
  const [ves, setVes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchVes();
  }, []);

  const fetchVes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/ve');
      console.log('Response vé:', response.data);
      setVes(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách vé:', error);
      alert('Không thể tải danh sách vé: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy vé này? Ghế sẽ được giải phóng.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/ve/${id}`);
      alert('Hủy vé thành công!');
      fetchVes();
    } catch (error) {
      console.error('Lỗi khi hủy vé:', error);
      alert(error.response?.data?.message || 'Không thể hủy vé');
    }
  };

  const formatPrice = (price) => {
    return parseInt(price).toLocaleString('vi-VN') + ' đ';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'da_thanh_toan':
        return <span className="badge bg-success">Đã thanh toán</span>;
      case 'da_huy':
        return <span className="badge bg-danger">Đã hủy</span>;
      case 'cho_thanh_toan':
        return <span className="badge bg-warning text-dark">Chờ thanh toán</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const filteredVes = ves.filter(ve => {
    const matchSearch = 
      ve.ma_ve?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ve.ho_ten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ve.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ve.suat_chieu?.phim?.ten_phim?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !filterStatus || ve.trang_thai === filterStatus;
    
    const matchDate = !filterDate || 
      (ve.suat_chieu?.ngay_chieu && ve.suat_chieu.ngay_chieu.startsWith(filterDate));

    return matchSearch && matchStatus && matchDate;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0"><i className="bi bi-ticket-perforated me-2"></i>Quản lý Vé Đặt</h2>
        </div>

        <div className="card-body">
          {/* Filters */}
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Tìm theo mã vé, tên, email, phim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="da_thanh_toan">Đã thanh toán</option>
                <option value="cho_thanh_toan">Chờ thanh toán</option>
                <option value="da_huy">Đã hủy</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Lọc theo ngày chiếu"
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('');
                  setFilterDate('');
                }}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Reset
              </button>
            </div>
          </div>

          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Tìm thấy <strong>{filteredVes.length}</strong> vé
            {searchTerm || filterStatus || filterDate ? ' (đã lọc)' : ''}
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Mã Vé</th>
                  <th>Phim</th>
                  <th>Rạp</th>
                  <th>Suất Chiếu</th>
                  <th>Ghế</th>
                  <th>Khách Hàng</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Đặt</th>
                  <th className="text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredVes.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      Không có vé nào
                    </td>
                  </tr>
                ) : (
                  filteredVes.map((ve) => (
                    <tr key={ve.id}>
                      <td>
                        <strong className="text-danger">{ve.ma_ve}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{ve.suat_chieu?.phim?.ten_phim || 'N/A'}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="text-muted small">
                          {ve.suat_chieu?.rap_chieu?.ten_rap || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div>
                          <i className="bi bi-calendar3 me-1"></i>
                          {ve.suat_chieu?.ngay_chieu ? formatDate(ve.suat_chieu.ngay_chieu) : 'N/A'}
                        </div>
                        <div className="text-muted small">
                          <i className="bi bi-clock me-1"></i>
                          {ve.suat_chieu?.gio_chieu || 'N/A'} - Phòng {ve.suat_chieu?.phong_chieu || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {ve.ghes && ve.ghes.length > 0 ? (
                            ve.ghes.map((ghe, index) => (
                              <span key={index} className="badge bg-secondary">
                                {ghe.hang_ghe}{ghe.so_ghe}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted small">Không có</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div><strong>{ve.ho_ten}</strong></div>
                        <div className="text-muted small">{ve.email}</div>
                        <div className="text-muted small">
                          <i className="bi bi-telephone me-1"></i>
                          {ve.so_dien_thoai}
                        </div>
                      </td>
                      <td>
                        <strong className="text-danger">
                          {formatPrice(ve.tong_tien)}
                        </strong>
                      </td>
                      <td>{getStatusBadge(ve.trang_thai)}</td>
                      <td className="text-muted small">
                        {ve.created_at ? formatDateTime(ve.created_at) : 'N/A'}
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(ve.id)}
                            disabled={ve.trang_thai === 'da_huy'}
                            title="Hủy vé"
                          >
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Statistics */}
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h3>{ves.filter(v => v.trang_thai === 'da_thanh_toan').length}</h3>
                  <small>Đã thanh toán</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-dark">
                <div className="card-body text-center">
                  <h3>{ves.filter(v => v.trang_thai === 'cho_thanh_toan').length}</h3>
                  <small>Chờ thanh toán</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-danger text-white">
                <div className="card-body text-center">
                  <h3>{ves.filter(v => v.trang_thai === 'da_huy').length}</h3>
                  <small>Đã hủy</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h3>
                    {formatPrice(
                      ves
                        .filter(v => v.trang_thai === 'da_thanh_toan')
                        .reduce((sum, v) => sum + parseFloat(v.tong_tien || 0), 0)
                    )}
                  </h3>
                  <small>Tổng doanh thu</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .table-hover tbody tr:hover {
          background-color: #fff3cd;
        }
        .btn-group-sm .btn {
          padding: 0.25rem 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default VeList;
