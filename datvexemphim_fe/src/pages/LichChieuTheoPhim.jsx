import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { phimApi, suatChieuApi, rapApi } from '../services/api';
import Header from '../components/Header';

function LichChieuTheoPhim() {
    const [phims, setPhims] = useState([]);
    const [raps, setRaps] = useState([]);
    const [selectedPhim, setSelectedPhim] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [lichChieu, setLichChieu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingLich, setLoadingLich] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [phimData, rapData] = await Promise.all([
                phimApi.getPhimDangChieu(),
                rapApi.getAllRaps()
            ]);
            setPhims(phimData);
            setRaps(rapData);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedPhim) {
            setLichChieu([]);
            return;
        }
        const fetchLichChieu = async () => {
            try {
                setLoadingLich(true);
                const params = { phim_id: selectedPhim };
                if (selectedDate) params.ngay = selectedDate;
                const data = await suatChieuApi.timKiem(params);
                setLichChieu(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Lỗi khi lấy lịch chiếu:', error);
                setLichChieu([]);
            } finally {
                setLoadingLich(false);
            }
        };
        fetchLichChieu();
    }, [selectedPhim, selectedDate]);

    // Nhóm lịch chiếu theo rạp
    const groupByRap = () => {
        const grouped = {};
        lichChieu.forEach(sc => {
            const rapId = sc.rap_chieu?.id || sc.rapchieu_id;
            if (!grouped[rapId]) {
                grouped[rapId] = {
                    rap: sc.rap_chieu || raps.find(r => r.id == rapId) || { id: rapId, ten_rap: 'N/A' },
                    suatChieus: []
                };
            }
            grouped[rapId].suatChieus.push(sc);
        });
        return Object.values(grouped);
    };

    const selectedPhimInfo = phims.find(p => p.id == selectedPhim);

    return (
        <>
            <Header />
            <div className="container py-4" style={{ minHeight: '100vh' }}>
                <h2 className="fw-bold mb-4">
                    <i className="bi bi-film text-danger me-2"></i>
                    Lịch Chiếu Theo Phim
                </h2>

                {/* Bộ lọc */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-5">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-film me-2 text-danger"></i>
                                    Chọn phim
                                </label>
                                <select
                                    className="form-select form-select-lg"
                                    value={selectedPhim}
                                    onChange={(e) => setSelectedPhim(e.target.value)}
                                >
                                    <option value="">-- Chọn phim --</option>
                                    {phims.map(phim => (
                                        <option key={phim.id} value={phim.id}>
                                            {phim.ten_phim}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-calendar-event me-2 text-primary"></i>
                                    Chọn ngày
                                </label>
                                <input
                                    type="date"
                                    className="form-control form-control-lg"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    disabled={!selectedPhim}
                                />
                            </div>
                            <div className="col-md-3">
                                {selectedDate && (
                                    <button
                                        className="btn btn-outline-danger btn-lg w-100"
                                        onClick={() => setSelectedDate('')}
                                    >
                                        <i className="bi bi-x-circle me-1"></i>
                                        Xem tất cả ngày
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông tin phim đã chọn */}
                {selectedPhimInfo && (
                    <div className="card shadow-sm mb-4 border-0">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-2">
                                    {selectedPhimInfo.hinh_anh && (
                                        <img
                                            src={selectedPhimInfo.hinh_anh}
                                            alt={selectedPhimInfo.ten_phim}
                                            className="img-fluid rounded shadow"
                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                                <div className="col-md-10">
                                    <h4 className="fw-bold text-danger mb-2">
                                        {selectedPhimInfo.ten_phim}
                                    </h4>
                                    <div className="d-flex flex-wrap gap-3 text-muted mb-2">
                                        {selectedPhimInfo.the_loai && (
                                            <span><i className="bi bi-tag-fill text-warning me-1"></i>{selectedPhimInfo.the_loai}</span>
                                        )}
                                        {selectedPhimInfo.thoi_luong && (
                                            <span><i className="bi bi-clock-fill text-info me-1"></i>{selectedPhimInfo.thoi_luong} phút</span>
                                        )}
                                        {selectedPhimInfo.dao_dien && (
                                            <span><i className="bi bi-person-fill text-primary me-1"></i>{selectedPhimInfo.dao_dien}</span>
                                        )}
                                    </div>
                                    {selectedPhimInfo.mo_ta && (
                                        <p className="text-muted small mb-0">{selectedPhimInfo.mo_ta}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nội dung */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải danh sách phim...</p>
                    </div>
                ) : !selectedPhim ? (
                    /* Hiển thị grid phim để chọn nhanh */
                    <div>
                        <h5 className="text-muted mb-3">
                            <i className="bi bi-hand-index me-2"></i>
                            Hoặc chọn nhanh một phim đang chiếu:
                        </h5>
                        <div className="row g-3">
                            {phims.map(phim => (
                                <div className="col-lg-3 col-md-4 col-6" key={phim.id}>
                                    <div
                                        className="card h-100 shadow-sm border-0"
                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                        onClick={() => setSelectedPhim(String(phim.id))}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        {phim.hinh_anh ? (
                                            <img
                                                src={phim.hinh_anh}
                                                alt={phim.ten_phim}
                                                className="card-img-top"
                                                style={{ height: '250px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div
                                                className="card-img-top d-flex align-items-center justify-content-center bg-secondary"
                                                style={{ height: '250px' }}
                                            >
                                                <i className="bi bi-film text-white fs-1"></i>
                                            </div>
                                        )}
                                        <div className="card-body p-2 text-center">
                                            <h6 className="card-title mb-1 text-truncate">{phim.ten_phim}</h6>
                                            {phim.the_loai && (
                                                <small className="text-muted">{phim.the_loai}</small>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {phims.length === 0 && (
                                <div className="col-12">
                                    <div className="alert alert-info">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Hiện tại không có phim đang chiếu.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : loadingLich ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải lịch chiếu...</p>
                    </div>
                ) : lichChieu.length === 0 ? (
                    <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Không có suất chiếu nào cho phim này{selectedDate ? ` vào ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')}` : ''}.
                    </div>
                ) : (
                    /* Hiển thị lịch chiếu nhóm theo rạp */
                    <div>
                        <div className="alert alert-success mb-3">
                            <i className="bi bi-check-circle me-2"></i>
                            Tìm thấy <strong>{lichChieu.length}</strong> suất chiếu tại <strong>{groupByRap().length}</strong> rạp
                            {selectedDate && <> vào ngày <strong>{new Date(selectedDate).toLocaleDateString('vi-VN')}</strong></>}
                        </div>

                        {groupByRap().map(({ rap, suatChieus }) => (
                            <div className="card shadow-sm mb-4" key={rap.id}>
                                <div className="card-header bg-dark text-white d-flex align-items-center">
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #667eea, #764ba2)', flexShrink: 0 }}
                                    >
                                        <i className="bi bi-camera-reels text-white"></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-0">
                                            <Link to={`/rap/${rap.id}`} className="text-white text-decoration-none">
                                                {rap.ten_rap}
                                            </Link>
                                        </h5>
                                        {rap.dia_chi && (
                                            <small className="text-light opacity-75">
                                                <i className="bi bi-geo-alt me-1"></i>{rap.dia_chi}
                                            </small>
                                        )}
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        {suatChieus
                                            .sort((a, b) => {
                                                if (a.ngay_chieu !== b.ngay_chieu) return a.ngay_chieu > b.ngay_chieu ? 1 : -1;
                                                return (a.gio_chieu || '').localeCompare(b.gio_chieu || '');
                                            })
                                            .map(sc => (
                                                <Link
                                                    to={`/booking/${sc.id}`}
                                                    key={sc.id}
                                                    className="btn btn-outline-danger position-relative"
                                                    style={{ minWidth: '140px' }}
                                                >
                                                    <div className="fw-bold">{sc.gio_chieu}</div>
                                                    <small className="d-block text-muted">
                                                        {sc.ngay_chieu ? new Date(sc.ngay_chieu).toLocaleDateString('vi-VN') : ''}
                                                    </small>
                                                    <small className="d-block">
                                                        <i className="bi bi-tv me-1"></i>{sc.phong_chieu || 'N/A'}
                                                    </small>
                                                    <small className="text-danger fw-bold">
                                                        {sc.gia_ve ? parseInt(sc.gia_ve).toLocaleString('vi-VN') + 'đ' : ''}
                                                    </small>
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .form-select:focus, .form-control:focus {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
                }
            `}</style>
        </>
    );
}

export default LichChieuTheoPhim;
