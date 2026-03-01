import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rapApi, suatChieuApi } from '../services/api';
import Header from '../components/Header';

function LichChieuTheoRap() {
    const [raps, setRaps] = useState([]);
    const [selectedRap, setSelectedRap] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [lichChieu, setLichChieu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingLich, setLoadingLich] = useState(false);

    useEffect(() => {
        fetchRaps();
    }, []);

    const fetchRaps = async () => {
        try {
            setLoading(true);
            const data = await rapApi.getAllRaps();
            setRaps(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách rạp:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedRap) {
            setLichChieu([]);
            return;
        }
        const fetchLichChieu = async () => {
            try {
                setLoadingLich(true);
                const params = { rap_id: selectedRap };
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
    }, [selectedRap, selectedDate]);

    // Nhóm lịch chiếu theo phim
    const groupByPhim = () => {
        const grouped = {};
        lichChieu.forEach(sc => {
            const phimId = sc.phim?.id || sc.phim_id;
            if (!grouped[phimId]) {
                grouped[phimId] = {
                    phim: sc.phim || { id: phimId, ten_phim: 'N/A' },
                    suatChieus: []
                };
            }
            grouped[phimId].suatChieus.push(sc);
        });
        return Object.values(grouped);
    };

    const selectedRapInfo = raps.find(r => r.id == selectedRap);

    return (
        <>
            <Header />
            <div className="container py-4" style={{ minHeight: '100vh' }}>
                <h2 className="fw-bold mb-4">
                    <i className="bi bi-building text-danger me-2"></i>
                    Lịch Chiếu Theo Rạp
                </h2>

                {/* Bộ lọc */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-5">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-camera-reels me-2 text-danger"></i>
                                    Chọn rạp chiếu
                                </label>
                                <select
                                    className="form-select form-select-lg"
                                    value={selectedRap}
                                    onChange={(e) => setSelectedRap(e.target.value)}
                                >
                                    <option value="">-- Chọn rạp --</option>
                                    {raps.map(rap => (
                                        <option key={rap.id} value={rap.id}>
                                            {rap.ten_rap} - {rap.dia_chi}
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
                                    disabled={!selectedRap}
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

                {/* Thông tin rạp đã chọn */}
                {selectedRapInfo && (
                    <div className="alert alert-light border shadow-sm mb-4">
                        <div className="d-flex align-items-center">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}
                            >
                                <i className="bi bi-camera-reels text-white fs-4"></i>
                            </div>
                            <div>
                                <h5 className="mb-1">{selectedRapInfo.ten_rap}</h5>
                                <small className="text-muted">
                                    <i className="bi bi-geo-alt me-1"></i>{selectedRapInfo.dia_chi}
                                    {selectedRapInfo.so_dien_thoai && (
                                        <span className="ms-3"><i className="bi bi-telephone me-1"></i>{selectedRapInfo.so_dien_thoai}</span>
                                    )}
                                </small>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nội dung */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải danh sách rạp...</p>
                    </div>
                ) : !selectedRap ? (
                    /* Hiển thị danh sách rạp dạng card để chọn nhanh */
                    <div>
                        <h5 className="text-muted mb-3">
                            <i className="bi bi-hand-index me-2"></i>
                            Hoặc chọn nhanh một rạp:
                        </h5>
                        <div className="row g-3">
                            {raps.map(rap => (
                                <div className="col-lg-4 col-md-6" key={rap.id}>
                                    <div
                                        className="card h-100 shadow-sm border-0"
                                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                        onClick={() => setSelectedRap(String(rap.id))}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                                    style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                                                >
                                                    <i className="bi bi-camera-reels text-white fs-5"></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1">{rap.ten_rap}</h6>
                                                    <small className="text-muted">
                                                        <i className="bi bi-geo-alt me-1"></i>{rap.dia_chi}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                        Không có suất chiếu nào tại rạp này{selectedDate ? ` vào ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')}` : ''}.
                    </div>
                ) : (
                    /* Hiển thị lịch chiếu nhóm theo phim */
                    <div>
                        <div className="alert alert-success mb-3">
                            <i className="bi bi-check-circle me-2"></i>
                            Tìm thấy <strong>{lichChieu.length}</strong> suất chiếu
                            {selectedDate && <> vào ngày <strong>{new Date(selectedDate).toLocaleDateString('vi-VN')}</strong></>}
                        </div>

                        {groupByPhim().map(({ phim, suatChieus }) => (
                            <div className="card shadow-sm mb-4" key={phim.id}>
                                <div className="card-header bg-dark text-white d-flex align-items-center">
                                    {phim.hinh_anh && (
                                        <img
                                            src={phim.hinh_anh}
                                            alt={phim.ten_phim}
                                            className="rounded me-3"
                                            style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div>
                                        <h5 className="mb-0">
                                            <Link to={`/phim/${phim.id}`} className="text-white text-decoration-none">
                                                {phim.ten_phim}
                                            </Link>
                                        </h5>
                                        <small className="text-light opacity-75">
                                            {phim.the_loai && <span className="me-3"><i className="bi bi-tag me-1"></i>{phim.the_loai}</span>}
                                            {phim.thoi_luong && <span><i className="bi bi-clock me-1"></i>{phim.thoi_luong} phút</span>}
                                        </small>
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

export default LichChieuTheoRap;
