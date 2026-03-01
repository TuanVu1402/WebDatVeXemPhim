import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { rapApi, suatChieuApi } from '../services/api';
import Header from '../components/Header';

function ChiTietRap() {
    const { id } = useParams();
    const [rap, setRap] = useState(null);
    const [lichChieu, setLichChieu] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRapDetail();
        fetchLichChieu();
    }, [id]);

    const fetchRapDetail = async () => {
        try {
            const data = await rapApi.getRapById(id);
            setRap(data);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết rạp:', error);
        }
    };

    const fetchLichChieu = async () => {
        try {
            setLoading(true);
            const data = await suatChieuApi.getByRap(id);
            setLichChieu(data.lich_chieu);
        } catch (error) {
            console.error('Lỗi khi lấy lịch chiếu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = async (e) => {
        const ngay = e.target.value;
        setSelectedDate(ngay);
        
        if (ngay) {
            try {
                setLoading(true);
                const data = await rapApi.getLichChieuByRapAndDate(id, ngay);
                // API này trả về mảng phim, không có group theo ngày
                // Nên cần format lại thành cấu trúc giống endpoint getByRap
                const formattedData = [{
                    ngay: new Date(ngay).toLocaleDateString('vi-VN'),
                    thu: new Date(ngay).toLocaleDateString('vi-VN', { weekday: 'long' }),
                    phims: data.lich_chieu
                }];
                setLichChieu(formattedData);
            } catch (error) {
                console.error('Lỗi:', error);
            } finally {
                setLoading(false);
            }
        } else {
            fetchLichChieu();
        }
    };

    if (!rap) {
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
            {/* Thông tin rạp */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <h2 className="fw-bold text-danger mb-3">
                                <i className="bi bi-camera-reels me-2"></i>
                                {rap.ten_rap}
                            </h2>
                            <p className="mb-2">
                                <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                                <strong>Địa chỉ:</strong> {rap.dia_chi}
                            </p>
                            <p className="mb-2">
                                <i className="bi bi-telephone-fill text-success me-2"></i>
                                <strong>Hotline:</strong> {rap.so_dien_thoai}
                            </p>
                            {rap.mo_ta && (
                                <p className="text-muted mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    {rap.mo_ta}
                                </p>
                            )}
                        </div>
                        <div className="col-md-4 text-end">
                            <div 
                                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                            >
                                <i className="bi bi-building text-white" style={{ fontSize: '3rem' }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chọn ngày */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <h5 className="mb-0">
                                <i className="bi bi-calendar-event me-2 text-danger"></i>
                                Chọn ngày xem
                            </h5>
                        </div>
                        <div className="col-md-9">
                            <input
                                type="date"
                                className="form-control"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Lịch chiếu */}
            <h4 className="fw-bold mb-3">
                <i className="bi bi-film text-danger me-2"></i>
                Lịch Chiếu Phim
            </h4>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status"></div>
                </div>
            ) : lichChieu && lichChieu.length > 0 ? (
                lichChieu.map((ngay, index) => (
                    <div key={index} className="card mb-3 shadow-sm">
                        <div className="card-header bg-danger text-white">
                            <h5 className="mb-0">
                                <i className="bi bi-calendar-check me-2"></i>
                                {ngay.ngay} - {ngay.thu}
                            </h5>
                        </div>
                        <div className="card-body">
                            {ngay.phims && ngay.phims.map((item, idx) => (
                                <div key={idx} className="mb-4 pb-4 border-bottom">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <img
                                                src={item.phim.hinh_anh}
                                                alt={item.phim.ten_phim}
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '200px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop';
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-9">
                                            <h5 className="fw-bold mb-2">
                                                <Link to={`/phim/${item.phim.id}`} className="text-decoration-none text-dark">
                                                    {item.phim.ten_phim}
                                                </Link>
                                            </h5>
                                            <p className="text-muted mb-3">
                                                <span className="badge bg-secondary me-2">{item.phim.the_loai}</span>
                                                <span className="badge bg-info">{item.phim.thoi_luong} phút</span>
                                            </p>

                                            <div className="d-flex flex-wrap gap-2">
                                                {item.suat_chieu.map((suat) => (
                                                    <Link
                                                        key={suat.id}
                                                        to={`/dat-ve/${suat.id}`}
                                                        className="btn btn-outline-danger"
                                                    >
                                                        <i className="bi bi-clock me-1"></i>
                                                        {suat.gio_chieu}
                                                        <br />
                                                        <small>{suat.phong_chieu}</small>
                                                        <br />
                                                        <small className="text-success fw-bold">{suat.gia_ve_format}</small>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Không có lịch chiếu nào cho ngày này
                </div>
            )}
            </div>
        </>
    );
}

export default ChiTietRap;
