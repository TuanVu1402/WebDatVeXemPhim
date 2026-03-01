import { useState, useEffect } from 'react';
import { rapApi } from '../services/api';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function DanhSachRap() {
    const [raps, setRaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        fetchRaps();
    }, []);

    const fetchRaps = async () => {
        try {
            setLoading(true);
            const data = await rapApi.getAllRaps();
            setRaps(data);
        } catch (err) {
            setError('Không thể tải danh sách rạp chiếu');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchKeyword.trim()) {
            fetchRaps();
            return;
        }

        try {
            setLoading(true);
            const data = await rapApi.searchRaps(searchKeyword);
            setRaps(data);
        } catch (err) {
            setError('Lỗi khi tìm kiếm rạp');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="container py-5">
                    <div className="text-center">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="container py-5">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 className="fw-bold mb-4">
                <i className="bi bi-building text-danger me-2"></i>
                Hệ Thống Rạp Chiếu
            </h2>

            {/* Tìm kiếm */}
            <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm rạp theo tên hoặc địa chỉ..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button className="btn btn-danger" type="submit">
                        <i className="bi bi-search me-1"></i>
                        Tìm kiếm
                    </button>
                </div>
            </form>

            {/* Danh sách rạp */}
            <div className="row g-4">
                {raps.length > 0 ? (
                    raps.map((rap) => (
                        <div className="col-lg-4 col-md-6" key={rap.id}>
                            <div className="card h-100 shadow-sm border-0 hover-shadow">
                                <div className="card-body">
                                    <div className="d-flex align-items-start mb-3">
                                        <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            }}
                                        >
                                            <i className="bi bi-camera-reels text-white fs-3"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-1">{rap.ten_rap}</h5>
                                            {rap.trang_thai === 1 ? (
                                                <span className="badge bg-success">Đang hoạt động</span>
                                            ) : (
                                                <span className="badge bg-secondary">Tạm đóng</span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="card-text text-muted small mb-2">
                                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                        {rap.dia_chi}
                                    </p>

                                    <p className="card-text text-muted small mb-2">
                                        <i className="bi bi-telephone-fill text-success me-1"></i>
                                        {rap.so_dien_thoai}
                                    </p>

                                    {rap.mo_ta && (
                                        <p className="card-text small text-muted">
                                            <i className="bi bi-info-circle me-1"></i>
                                            {rap.mo_ta}
                                        </p>
                                    )}

                                    <div className="d-flex gap-2 mt-3">
                                        <Link 
                                            to={`/rap/${rap.id}`} 
                                            className="btn btn-danger btn-sm flex-grow-1"
                                        >
                                            <i className="bi bi-film me-1"></i>
                                            Xem lịch chiếu
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center">
                            <i className="bi bi-info-circle me-2"></i>
                            Không tìm thấy rạp chiếu nào
                        </div>
                    </div>
                )}
            </div>
            </div>
        </>
    );
}

export default DanhSachRap;
