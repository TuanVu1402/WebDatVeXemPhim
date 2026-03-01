import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { phimApi, suatChieuApi, rapApi } from '../services/api';
import Header from '../components/Header';

function ChiTietPhim() {
    const { id } = useParams();
    const [phim, setPhim] = useState(null);
    const [raps, setRaps] = useState([]);
    const [lichChieu, setLichChieu] = useState([]);
    const [selectedRap, setSelectedRap] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingRaps, setLoadingRaps] = useState(true);

    useEffect(() => {
        fetchPhimDetail();
        fetchRaps();
    }, [id]);

    const fetchPhimDetail = async () => {
        try {
            const data = await phimApi.getPhimById(id);
            setPhim(data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết phim:', error);
        }
    };

    const fetchRaps = async () => {
        try {
            setLoadingRaps(true);
            const data = await rapApi.getAllRaps();
            setRaps(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách rạp:', error);
        } finally {
            setLoadingRaps(false);
        }
    };

    const fetchLichChieu = async () => {
        if (!selectedRap) {
            setLichChieu([]);
            return;
        }

        try {
            setLoading(true);
            const params = {
                phim_id: id,
                rap_id: selectedRap
            };
            
            if (selectedDate) {
                params.ngay = selectedDate; // Backend expect 'ngay', not 'ngay_chieu'
            }
            
            console.log('🔍 Fetching với params:', params);
            
            const data = await suatChieuApi.timKiem(params);
            
            console.log('✅ Response từ API:', data);
            
            // suatChieuApi.timKiem đã return response.data.data rồi
            // nên data đã là array của suất chiếu
            setLichChieu(Array.isArray(data) ? data : []);
            
            console.log('📊 Số suất chiếu:', Array.isArray(data) ? data.length : 0);
        } catch (error) {
            console.error('❌ Lỗi khi lấy lịch chiếu:', error);
            console.error('Error response:', error.response?.data);
            setLichChieu([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLichChieu();
    }, [selectedRap, selectedDate]);

    const handleRapChange = (e) => {
        setSelectedRap(e.target.value);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleShowAllShowtimes = () => {
        if (selectedRap) {
            setSelectedDate(''); // Clear date filter
            // fetchLichChieu will be triggered by useEffect
        }
    };

    if (!phim) {
        return (
            <>
                <Header />
                <div className="container py-5 text-center">
                    <div className="spinner-border text-danger" role="status"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container py-4">
                {/* Thông tin phim */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                {phim.hinh_anh && (
                                    <img 
                                        src={phim.hinh_anh} 
                                        alt={phim.ten_phim}
                                        className="img-fluid rounded shadow"
                                    />
                                )}
                            </div>
                            <div className="col-md-9">
                                <h2 className="fw-bold text-danger mb-3">
                                    <i className="bi bi-film me-2"></i>
                                    {phim.ten_phim}
                                </h2>
                                {phim.mo_ta && (
                                    <p className="mb-3">
                                        <strong>Mô tả:</strong> {phim.mo_ta}
                                    </p>
                                )}
                                {phim.dao_dien && (
                                    <p className="mb-2">
                                        <i className="bi bi-person-fill text-primary me-2"></i>
                                        <strong>Đạo diễn:</strong> {phim.dao_dien}
                                    </p>
                                )}
                                {phim.dien_vien && (
                                    <p className="mb-2">
                                        <i className="bi bi-people-fill text-success me-2"></i>
                                        <strong>Diễn viên:</strong> {phim.dien_vien}
                                    </p>
                                )}
                                {phim.the_loai && (
                                    <p className="mb-2">
                                        <i className="bi bi-tag-fill text-warning me-2"></i>
                                        <strong>Thể loại:</strong> {phim.the_loai}
                                    </p>
                                )}
                                {phim.thoi_luong && (
                                    <p className="mb-2">
                                        <i className="bi bi-clock-fill text-info me-2"></i>
                                        <strong>Thời lượng:</strong> {phim.thoi_luong} phút
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lịch chiếu */}
                <div className="card shadow-sm">
                    <div className="card-header bg-danger text-white">
                        <h4 className="mb-0">
                            <i className="bi bi-calendar3 me-2"></i>
                            Lịch Chiếu
                        </h4>
                    </div>
                    <div className="card-body">
                        {/* Bộ lọc */}
                        <div className="row g-3 mb-4">
                            {/* Chọn rạp */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-building me-2"></i>
                                    Chọn rạp chiếu: <span className="text-danger">*</span>
                                </label>
                                {loadingRaps ? (
                                    <div className="text-center py-2">
                                        <div className="spinner-border spinner-border-sm text-danger" role="status"></div>
                                    </div>
                                ) : (
                                    <div className="d-flex gap-2">
                                        <select 
                                            className="form-select"
                                            value={selectedRap}
                                            onChange={handleRapChange}
                                        >
                                            <option value="">-- Chọn rạp chiếu --</option>
                                            {raps.map((rap) => (
                                                <option key={rap.id} value={rap.id}>
                                                    {rap.ten_rap} - {rap.dia_chi}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={handleShowAllShowtimes}
                                            disabled={!selectedRap}
                                            title="Xem tất cả suất chiếu của rạp"
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            <i className="bi bi-list-ul me-1"></i>
                                            Tất cả suất
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Chọn ngày */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    Chọn ngày chiếu: <span className="text-muted">(Tùy chọn)</span>
                                </label>
                                <input 
                                    type="date" 
                                    className="form-control"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    disabled={!selectedRap}
                                />
                            </div>
                        </div>

                        {/* Hiển thị kết quả */}
                        {!selectedRap ? (
                            <div className="alert alert-warning">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Vui lòng chọn rạp chiếu để xem lịch chiếu
                            </div>
                        ) : loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-danger" role="status"></div>
                                <p className="mt-2 text-muted">Đang tải lịch chiếu...</p>
                            </div>
                        ) : lichChieu.length === 0 ? (
                            <div className="alert alert-info">
                                <i className="bi bi-info-circle me-2"></i>
                                Không có suất chiếu nào cho rạp và ngày đã chọn.
                            </div>
                        ) : (
                            <div>
                                <div className="alert alert-success mb-3">
                                    <i className="bi bi-check-circle me-2"></i>
                                    Tìm thấy <strong>{lichChieu.length}</strong> suất chiếu
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover table-striped align-middle">
                                        <thead className="table-dark">
                                            <tr>
                                                <th><i className="bi bi-building me-1"></i>Rạp Chiếu</th>
                                                <th><i className="bi bi-calendar-date me-1"></i>Ngày Chiếu</th>
                                                <th><i className="bi bi-clock me-1"></i>Giờ Chiếu</th>
                                                <th><i className="bi bi-door-closed me-1"></i>Phòng</th>
                                                <th><i className="bi bi-currency-dollar me-1"></i>Giá Vé</th>
                                                <th className="text-center">Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lichChieu.map((suat) => (
                                                <tr key={suat.id}>
                                                    <td>
                                                        <Link 
                                                            to={`/rap/${suat.rap_chieu?.id || suat.rapChieu?.id || selectedRap}`}
                                                            className="text-decoration-none fw-bold text-primary"
                                                        >
                                                            <i className="bi bi-camera-reels me-1"></i>
                                                            {suat.rap_chieu?.ten_rap || suat.rapChieu?.ten_rap || raps.find(r => r.id == selectedRap)?.ten_rap || 'N/A'}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary px-3 py-2">
                                                            <i className="bi bi-calendar3 me-1"></i>
                                                            {suat.ngay_chieu ? new Date(suat.ngay_chieu).toLocaleDateString('vi-VN') : 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-success px-3 py-2 fs-6">
                                                            <i className="bi bi-clock-fill me-1"></i>
                                                            {suat.gio_chieu || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-secondary">
                                                            <i className="bi bi-tv me-1"></i>
                                                            {suat.phong_chieu || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="text-danger fw-bold fs-5">
                                                            {suat.gia_ve ? parseInt(suat.gia_ve).toLocaleString('vi-VN') : '0'} đ
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <Link 
                                                            to={`/booking/${suat.id}`}
                                                            className="btn btn-danger btn-sm px-3"
                                                        >
                                                            <i className="bi bi-ticket-perforated me-1"></i>
                                                            Đặt Vé
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style>{`
                .table-hover tbody tr:hover {
                    background-color: #fff3cd !important;
                    transform: scale(1.01);
                    transition: all 0.2s ease;
                }

                .form-select:focus,
                .form-control:focus {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
                }

                .badge {
                    font-weight: 500;
                }

                .alert {
                    border-left: 4px solid;
                }

                .table thead th {
                    vertical-align: middle;
                    white-space: nowrap;
                }
            `}</style>
        </>
    );
}

export default ChiTietPhim;
