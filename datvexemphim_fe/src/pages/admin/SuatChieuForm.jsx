import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GIO_CHIEU_MAC_DINH = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00',
  '20:00', '21:00', '22:00', '23:00'
];

function AdminSuatChieuForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [phims, setPhims] = useState([]);
  const [raps, setRaps] = useState([]);

  // Form đơn lẻ (khi edit)
  const [formData, setFormData] = useState({
    phim_id: '',
    rapchieu_id: '',
    phong_chieu: '',
    ngay_chieu: '',
    gio_chieu: '',
    gia_ve: ''
  });

  // Form batch (khi thêm mới)
  const [batchData, setBatchData] = useState({
    phim_id: '',
    rapchieu_ids: [],
    phong_chieu: '',
    ngay_chieu: '',
    gio_chieus: [],
    gia_ve: ''
  });

  const [customGio, setCustomGio] = useState('');

  useEffect(() => {
    fetchPhims();
    fetchRaps();
    if (id) {
      fetchSuatChieu();
    }
  }, [id]);

  const fetchPhims = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/phims');
      if (response.data.success) {
        setPhims(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phim:', error);
    }
  };

  const fetchRaps = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/raps');
      if (response.data.success) {
        setRaps(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách rạp:', error);
    }
  };

  const fetchSuatChieu = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/suat-chieu/${id}`);
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin suất chiếu:', error);
      alert('Không tìm thấy suất chiếu!');
      navigate('/admin/suat-chieu');
    }
  };

  // === Handlers cho form edit (đơn lẻ) ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // === Handlers cho form batch ===
  const handleBatchChange = (e) => {
    const { name, value } = e.target;
    setBatchData({ ...batchData, [name]: value });
  };

  const toggleRap = (rapId) => {
    setBatchData(prev => {
      const exists = prev.rapchieu_ids.includes(rapId);
      return {
        ...prev,
        rapchieu_ids: exists
          ? prev.rapchieu_ids.filter(id => id !== rapId)
          : [...prev.rapchieu_ids, rapId]
      };
    });
  };

  const selectAllRaps = () => {
    setBatchData(prev => ({ ...prev, rapchieu_ids: raps.map(r => r.id) }));
  };

  const deselectAllRaps = () => {
    setBatchData(prev => ({ ...prev, rapchieu_ids: [] }));
  };

  const toggleGio = (gio) => {
    setBatchData(prev => {
      const exists = prev.gio_chieus.includes(gio);
      return {
        ...prev,
        gio_chieus: exists
          ? prev.gio_chieus.filter(g => g !== gio)
          : [...prev.gio_chieus, gio].sort()
      };
    });
  };

  const addCustomGio = () => {
    if (customGio && !batchData.gio_chieus.includes(customGio)) {
      setBatchData(prev => ({
        ...prev,
        gio_chieus: [...prev.gio_chieus, customGio].sort()
      }));
      setCustomGio('');
    }
  };

  const selectCommonGios = () => {
    setBatchData(prev => ({
      ...prev,
      gio_chieus: ['09:00', '12:00', '15:00', '18:00', '21:00']
    }));
  };

  const deselectAllGios = () => {
    setBatchData(prev => ({ ...prev, gio_chieus: [] }));
  };

  // === Submit ===
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!formData.phim_id || !formData.rapchieu_id || !formData.ngay_chieu || !formData.gio_chieu) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:8000/api/suat-chieu/${id}`, formData);
      if (response.data.success) {
        alert('Cập nhật suất chiếu thành công!');
        navigate('/admin/suat-chieu');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      alert('Có lỗi xảy ra: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    if (!batchData.phim_id) { alert('Vui lòng chọn phim!'); return; }
    if (batchData.rapchieu_ids.length === 0) { alert('Vui lòng chọn ít nhất 1 rạp!'); return; }
    if (!batchData.ngay_chieu) { alert('Vui lòng chọn ngày chiếu!'); return; }
    if (batchData.gio_chieus.length === 0) { alert('Vui lòng chọn ít nhất 1 khung giờ!'); return; }
    if (!batchData.phong_chieu || !batchData.gia_ve) { alert('Vui lòng điền phòng chiếu và giá vé!'); return; }

    const totalSuatChieu = batchData.rapchieu_ids.length * batchData.gio_chieus.length;
    if (!window.confirm(`Sẽ tạo ${totalSuatChieu} suất chiếu (${batchData.rapchieu_ids.length} rạp × ${batchData.gio_chieus.length} khung giờ). Tiếp tục?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/suat-chieu/batch', batchData);
      if (response.data.success) {
        alert(response.data.message);
        navigate('/admin/suat-chieu');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      const errorDetail = error.response?.data?.error;
      let fullError = 'Có lỗi xảy ra: ' + errorMsg;
      if (errorDetail) {
        fullError += '\n\n' + (typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
      }
      alert(fullError);
    } finally {
      setLoading(false);
    }
  };

  const totalPreview = batchData.rapchieu_ids.length * batchData.gio_chieus.length;

  // ============ RENDER ============

  // Form EDIT (đơn lẻ)
  if (id) {
    return (
      <div className="admin-content">
        <div className="page-header">
          <h2><i className="bi bi-calendar-event me-2"></i>Cập nhật Suất Chiếu</h2>
          <Link to="/admin/suat-chieu" className="btn-secondary"><i className="bi bi-arrow-left"></i> Quay lại</Link>
        </div>
        <div className="admin-card">
          <form onSubmit={handleSubmitEdit} className="admin-form">
            <div className="form-section">
              <h4 className="form-section-title">Thông tin suất chiếu</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Phim <span className="text-danger">*</span></label>
                    <select name="phim_id" className="form-control" value={formData.phim_id} onChange={handleChange} required>
                      <option value="">-- Chọn phim --</option>
                      {phims.map(phim => (<option key={phim.id} value={phim.id}>{phim.ten_phim}</option>))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Rạp <span className="text-danger">*</span></label>
                    <select name="rapchieu_id" className="form-control" value={formData.rapchieu_id} onChange={handleChange} required>
                      <option value="">-- Chọn rạp --</option>
                      {raps.map(rap => (<option key={rap.id} value={rap.id}>{rap.ten_rap}</option>))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Phòng chiếu <span className="text-danger">*</span></label>
                    <input type="text" name="phong_chieu" className="form-control" value={formData.phong_chieu} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Ngày chiếu <span className="text-danger">*</span></label>
                    <input type="date" name="ngay_chieu" className="form-control" value={formData.ngay_chieu} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Giờ chiếu <span className="text-danger">*</span></label>
                    <input type="time" name="gio_chieu" className="form-control" value={formData.gio_chieu} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Giá vé (VNĐ) <span className="text-danger">*</span></label>
                    <input type="number" name="gia_ve" className="form-control" value={formData.gia_ve} onChange={handleChange} min="0" step="1000" required />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <Link to="/admin/suat-chieu" className="btn-secondary"><i className="bi bi-x-circle"></i> Hủy</Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...</> : <><i className="bi bi-save"></i> Cập nhật</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Form THÊM MỚI (batch - nhiều rạp + nhiều giờ)
  return (
    <div className="admin-content">
      <div className="page-header">
        <h2><i className="bi bi-calendar-plus me-2"></i>Thêm Suất Chiếu Hàng Loạt</h2>
        <Link to="/admin/suat-chieu" className="btn-secondary"><i className="bi bi-arrow-left"></i> Quay lại</Link>
      </div>

      <form onSubmit={handleSubmitBatch}>
        {/* Thông tin cơ bản */}
        <div className="admin-card mb-4">
          <div className="form-section">
            <h4 className="form-section-title"><i className="bi bi-film me-2"></i>Thông tin cơ bản</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phim <span className="text-danger">*</span></label>
                  <select name="phim_id" className="form-control" value={batchData.phim_id} onChange={handleBatchChange} required>
                    <option value="">-- Chọn phim --</option>
                    {phims.map(phim => (<option key={phim.id} value={phim.id}>{phim.ten_phim}</option>))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Ngày chiếu <span className="text-danger">*</span></label>
                  <input type="date" name="ngay_chieu" className="form-control" value={batchData.ngay_chieu} onChange={handleBatchChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phòng chiếu <span className="text-danger">*</span></label>
                  <input type="text" name="phong_chieu" className="form-control" value={batchData.phong_chieu} onChange={handleBatchChange} placeholder="VD: Phòng 1" required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Giá vé (VNĐ) <span className="text-danger">*</span></label>
                  <input type="number" name="gia_ve" className="form-control" value={batchData.gia_ve} onChange={handleBatchChange} placeholder="80000" min="0" step="1000" required />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chọn nhiều rạp */}
        <div className="admin-card mb-4">
          <div className="form-section">
            <h4 className="form-section-title">
              <i className="bi bi-building me-2"></i>Chọn rạp chiếu
              <span className="badge bg-danger ms-2">{batchData.rapchieu_ids.length} đã chọn</span>
            </h4>
            <div className="mb-3">
              <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={selectAllRaps}>
                <i className="bi bi-check-all me-1"></i>Chọn tất cả
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={deselectAllRaps}>
                <i className="bi bi-x-lg me-1"></i>Bỏ chọn tất cả
              </button>
            </div>
            <div className="row g-2">
              {raps.map(rap => (
                <div className="col-md-4 col-sm-6" key={rap.id}>
                  <div
                    className={`p-3 border rounded ${batchData.rapchieu_ids.includes(rap.id) ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleRap(rap.id)}
                  >
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={batchData.rapchieu_ids.includes(rap.id)}
                        onChange={() => toggleRap(rap.id)}
                        style={{ pointerEvents: 'none' }}
                      />
                      <div>
                        <strong>{rap.ten_rap}</strong>
                        {rap.dia_chi && <small className="d-block text-muted">{rap.dia_chi}</small>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {raps.length === 0 && (
                <div className="col-12 text-center py-3 text-muted">
                  Chưa có rạp nào. <Link to="/admin/raps/add">Thêm rạp mới</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chọn nhiều khung giờ */}
        <div className="admin-card mb-4">
          <div className="form-section">
            <h4 className="form-section-title">
              <i className="bi bi-clock me-2"></i>Chọn khung giờ chiếu
              <span className="badge bg-danger ms-2">{batchData.gio_chieus.length} đã chọn</span>
            </h4>
            <div className="mb-3">
              <button type="button" className="btn btn-sm btn-outline-success me-2" onClick={selectCommonGios}>
                <i className="bi bi-star me-1"></i>Giờ phổ biến (9h, 12h, 15h, 18h, 21h)
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={deselectAllGios}>
                <i className="bi bi-x-lg me-1"></i>Bỏ chọn tất cả
              </button>
            </div>
            <div className="row g-2 mb-3">
              {GIO_CHIEU_MAC_DINH.map(gio => (
                <div className="col-auto" key={gio}>
                  <button
                    type="button"
                    className={`btn ${batchData.gio_chieus.includes(gio) ? 'btn-danger' : 'btn-outline-secondary'}`}
                    onClick={() => toggleGio(gio)}
                    style={{ minWidth: '80px' }}
                  >
                    {gio}
                  </button>
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center gap-2">
              <input
                type="time"
                className="form-control"
                style={{ width: '150px' }}
                value={customGio}
                onChange={(e) => setCustomGio(e.target.value)}
              />
              <button type="button" className="btn btn-outline-primary" onClick={addCustomGio}>
                <i className="bi bi-plus-lg me-1"></i>Thêm giờ tùy chỉnh
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        {totalPreview > 0 && (
          <div className="admin-card mb-4">
            <div className="form-section">
              <h4 className="form-section-title"><i className="bi bi-eye me-2"></i>Tổng kết</h4>
              <div className="alert alert-info mb-3">
                <i className="bi bi-info-circle me-2"></i>
                Sẽ tạo <strong>{totalPreview}</strong> suất chiếu
                ({batchData.rapchieu_ids.length} rạp × {batchData.gio_chieus.length} khung giờ)
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-sm">
                  <thead className="table-dark">
                    <tr>
                      <th>Rạp</th>
                      {batchData.gio_chieus.map(gio => (<th key={gio} className="text-center">{gio}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {batchData.rapchieu_ids.map(rapId => {
                      const rap = raps.find(r => r.id === rapId);
                      return (
                        <tr key={rapId}>
                          <td><strong>{rap?.ten_rap}</strong></td>
                          {batchData.gio_chieus.map(gio => (
                            <td key={gio} className="text-center">
                              <i className="bi bi-check-circle-fill text-success"></i>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="admin-card">
          <div className="form-actions">
            <Link to="/admin/suat-chieu" className="btn-secondary"><i className="bi bi-x-circle"></i> Hủy</Link>
            <button type="submit" className="btn-primary" disabled={loading || totalPreview === 0}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Đang tạo {totalPreview} suất chiếu...</>
              ) : (
                <><i className="bi bi-save me-1"></i>Tạo {totalPreview} suất chiếu</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminSuatChieuForm;
