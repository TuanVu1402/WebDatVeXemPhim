import { useState, useEffect } from 'react'; // Thêm useEffect vào import
import { Link, useNavigate } from 'react-router-dom';
import { bannerApi, phimApi, rapApi, suatChieuApi } from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dang-chieu');
  const [banners, setBanners] = useState([]); // Thêm state cho banners
  const [loading, setLoading] = useState(true);

  //Thêm mới state cho phim
  const [phimDangChieu, setPhimDangChieu] = useState([]);
  const [phimSapChieu, setPhimSapChieu] = useState([]);
  const [phimHot, setPhimHot] = useState([]);
  const [loadingPhim, setLoadingPhim] = useState(true);
  const [raps, setRaps] = useState([]);

  // State cho Đặt Vé Nhanh
  const [selectedPhim, setSelectedPhim] = useState('');
  const [selectedRap, setSelectedRap] = useState('');
  const [selectedNgay, setSelectedNgay] = useState('');
  const [selectedSuatChieu, setSelectedSuatChieu] = useState('');
  const [suatChieuOptions, setSuatChieuOptions] = useState([]);
  const [loadingSuatChieu, setLoadingSuatChieu] = useState(false);


  useEffect(() => {
    fetchBanners();
    fetchPhims();
    fetchRaps();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const data = await bannerApi.getAllBanners(); // Sửa tên từ getALLBanner thành getAllBanners
      const activeBanners = data.filter(banner => banner.trang_thai == true);
      const sortedBanners = activeBanners.sort((a, b) => a.thu_tu - b.thu_tu);
      setBanners(sortedBanners);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách banner ở Home.jsx:', error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };


  const fetchPhims = async () => {
    try {
      setLoadingPhim(true);
      const[dangChieu, sapChieu, hotPhim] = await Promise.all([
        phimApi.getPhimDangChieu(),
        phimApi.getPhimSapChieu(),
        phimApi.getPhimHot()
      ]);
      console.log('Phim đang chiếu:', dangChieu);
      console.log('Phim sắp chiếu:', sapChieu);
      console.log('Phim hot:', hotPhim);
      setPhimDangChieu(dangChieu.slice(0, 8));
      setPhimSapChieu(sapChieu.slice(0, 8));
      setPhimHot(hotPhim.slice(0, 4));


    }
    catch (error) {
      console.error('Lỗi khi lấy danh sách phim ở Home.jsx:', error);
    }
    finally {
      setLoadingPhim(false);
    }

  };

  const fetchRaps = async () => {
    try {
      const data = await rapApi.getAllRaps();
      setRaps(data.slice(0, 10)); // Lấy 10 rạp đầu tiên
    } catch (error) {
      console.error('Lỗi khi lấy danh sách rạp:', error);
    }
  };

  // Tự động tìm suất chiếu khi chọn phim + rạp + ngày
  useEffect(() => {
    const fetchSuatChieu = async () => {
      // Cần ít nhất chọn phim hoặc rạp
      if (!selectedPhim && !selectedRap) {
        setSuatChieuOptions([]);
        setSelectedSuatChieu('');
        return;
      }
      try {
        setLoadingSuatChieu(true);
        const filters = {};
        if (selectedPhim) filters.phim_id = selectedPhim;
        if (selectedRap) filters.rap_id = selectedRap;
        if (selectedNgay) filters.ngay = selectedNgay;
        const data = await suatChieuApi.timKiem(filters);
        setSuatChieuOptions(data || []);
        setSelectedSuatChieu('');
      } catch (error) {
        console.error('Lỗi khi tìm suất chiếu:', error);
        setSuatChieuOptions([]);
      } finally {
        setLoadingSuatChieu(false);
      }
    };
    fetchSuatChieu();
  }, [selectedPhim, selectedRap, selectedNgay]);

  // Xử lý đặt vé nhanh
  const handleQuickBooking = () => {
    if (selectedSuatChieu) {
      navigate(`/booking/${selectedSuatChieu}`);
    } else if (selectedPhim) {
      navigate(`/phim/${selectedPhim}`);
    } else {
      alert('Vui lòng chọn phim hoặc suất chiếu!');
    }
  };

  //hàm hiển thị phim theo tab
  const getPhimByTab = () => {
    return activeTab === 'dang-chieu' ? phimDangChieu : phimSapChieu;
  };

  return (
    <div className="home-page">
      {/* Banner Slider */}
      <section className="banner-section mb-4">
        <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel">
          {/* Indicators */}
          <div className="carousel-indicators">
            {banners.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#bannerCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : undefined}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {loading ? (
              // Loading state
              <div className="carousel-item active">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '600px', background: '#f0f0f0' }}>
                  <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              </div>
            ) : banners.length > 0 ? (
              // Hiển thị banners từ API
              banners.map((banner, index) => (
                <div key={banner.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <img
                    src={banner.hinh_anh}
                    className="d-block w-100"
                    alt={banner.tieu_de}
                    style={{ height: '600px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/1920x600/FF6B6B/FFFFFF?text=Banner';
                    }}
                  />
                  <div className="carousel-caption">
                    <h2 className="display-4 fw-bold">{banner.tieu_de}</h2>
                    {banner.mo_ta && (
                      <p className="lead">{banner.mo_ta}</p>
                    )}
                    {banner.lien_ket && (
                      <a
                        href={banner.lien_ket}
                        className="btn btn-danger btn-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem thêm
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Không có banner
              <div className="carousel-item active">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '600px', background: '#f0f0f0' }}>
                  <p className="text-muted">Không có banner nào</p>
                </div>
              </div>
            )}
          </div>

          {/* Chỉ hiển thị nút prev/next khi có nhiều hơn 1 banner */}
          {banners.length > 1 && (
            <>
              <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
              </button>
            </>
          )}
        </div>
      </section>

      <div className="container">
        {/* Quick Booking Section */}
        <section className="quick-booking mb-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title mb-4">
                <i className="bi bi-ticket-perforated-fill text-danger me-2"></i>
                Đặt Vé Nhanh
              </h4>
              <div className="row g-3">
                <div className="col-md-3">
                  <select 
                    className="form-select" 
                    value={selectedPhim} 
                    onChange={(e) => setSelectedPhim(e.target.value)}
                  >
                    <option value="">Chọn phim</option>
                    {phimDangChieu.map(phim => (
                      <option key={phim.id} value={phim.id}>{phim.ten_phim}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-select" 
                    value={selectedRap} 
                    onChange={(e) => setSelectedRap(e.target.value)}
                  >
                    <option value="">Chọn rạp</option>
                    {raps.map(rap => (
                      <option key={rap.id} value={rap.id}>{rap.ten_rap}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <input 
                    type="date" 
                    className="form-control" 
                    value={selectedNgay}
                    onChange={(e) => setSelectedNgay(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-select" 
                    value={selectedSuatChieu} 
                    onChange={(e) => setSelectedSuatChieu(e.target.value)}
                    disabled={loadingSuatChieu || suatChieuOptions.length === 0}
                  >
                    <option value="">
                      {loadingSuatChieu ? 'Đang tải...' : 
                       suatChieuOptions.length === 0 ? 'Chọn suất chiếu' : 
                       `${suatChieuOptions.length} suất chiếu`}
                    </option>
                    {suatChieuOptions.map(sc => (
                      <option key={sc.id} value={sc.id}>
                        {sc.gio_chieu} - {sc.phim?.ten_phim || ''} - {sc.rap_chieu?.ten_rap || ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <button 
                    className="btn btn-danger btn-lg w-100" 
                    onClick={handleQuickBooking}
                    disabled={!selectedPhim && !selectedSuatChieu}
                  >
                    <i className="bi bi-search me-2"></i>
                    {selectedSuatChieu ? 'Đặt vé ngay' : 'Tìm suất chiếu'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Movies Section */}
        <section className="movies-section mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">
              <i className="bi bi-film text-danger me-2"></i>
              Phim
            </h3>
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${activeTab === 'dang-chieu' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setActiveTab('dang-chieu')}
              >
                Đang chiếu({phimDangChieu.length})
              </button>
              <button
                type="button"
                className={`btn ${activeTab === 'sap-chieu' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setActiveTab('sap-chieu')}
              >
                Sắp chiếu{(phimSapChieu.length)}
              </button>
            </div>
          </div>

          {/* Movie Grid */}
          <div className="row g-4">
            {loadingPhim ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Đang tải phim...</span>
                </div>
              </div>
            ) : getPhimByTab().length > 0 ? (
              getPhimByTab().map((phim) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={phim.id}>
                  <div className="card movie-card h-100 shadow-sm">
                    <div className="position-relative">
                      <img
                        src={phim.hinh_anh}
                        className="card-img-top"
                        alt={phim.ten_phim}
                        style={{ height: '400px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop';
                        }}
                      />
                      <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                        <i className="bi bi-star-fill me-1"></i>
                        {(Math.random() * 2 + 7).toFixed(1)}
                      </span>
                      {phim.is_hot && (
                        <span className="badge bg-warning position-absolute top-0 end-0 m-2">
                          <i className="bi bi-fire me-1"></i>HOT
                        </span>
                      )}
                      <div className="movie-overlay">
                        <a 
                          href={phim.trailer} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-light rounded-circle"
                        >
                          <i className="bi bi-play-fill"></i>
                        </a>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-truncate" title={phim.ten_phim}>
                        {phim.ten_phim}
                      </h5>
                      <p className="card-text text-muted small mb-2">
                        <i className="bi bi-calendar3 me-1"></i>
                        Thể loại: {phim.the_loai}
                      </p>
                      <p className="card-text text-muted small mb-3">
                        <i className="bi bi-clock me-1"></i>
                        Thời lượng: {phim.thoi_luong} phút
                      </p>
                      <div className="d-flex gap-2">
                        <Link to={`/phim/${phim.id}`} className="btn btn-danger flex-grow-1">
                          <i className="bi bi-ticket-perforated me-2"></i>
                          Đặt vé
                        </Link>
                        <button className="btn btn-outline-danger">
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                      <small className="text-muted d-block mt-2">
                        <i className="bi bi-eye-fill me-1"></i>
                        {phim.luot_xem.toLocaleString()} lượt xem
                      </small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted">Không có phim nào</p>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-outline-danger btn-lg">
              Xem tất cả
              <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </section>

        {/* Hot Movies Section */}
        {/* Hot Movies Section - THAY ĐỔI */}
        <section className="hot-movies-section mb-5">
          <h3 className="fw-bold mb-4">
            <i className="bi bi-fire text-danger me-2"></i>
            Phim Hot
          </h3>
          <div className="row g-4">
            {loadingPhim ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
              </div>
            ) : phimHot.length > 0 ? (
              phimHot.map((phim) => (
                <div className="col-lg-3 col-md-6" key={phim.id}>
                  <div className="card hot-movie-card shadow-sm">
                    <img
                      src={phim.hinh_anh}
                      className="card-img-top"
                      alt={phim.ten_phim}
                      style={{ height: '400px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop';
                      }}
                    />
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title mb-0 text-truncate" title={phim.ten_phim}>
                          {phim.ten_phim}
                        </h5>
                        <span className="badge bg-danger">
                          <i className="bi bi-eye-fill me-1"></i>
                          {(phim.luot_xem / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <p className="card-text text-muted small">
                        Đang hot trên moveok
                      </p>
                      <Link to={`/phim/${phim.id}`} className="btn btn-danger btn-sm w-100">
                        <i className="bi bi-ticket-perforated me-2"></i>
                        Đặt vé ngay
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">Không có phim hot</p>
              </div>
            )}
          </div>
        </section>

        {/* News Section */}
        <section className="news-section mb-5">
          <h3 className="fw-bold mb-4">
            <i className="bi bi-newspaper text-danger me-2"></i>
            Tin Tức & Khuyến Mãi
          </h3>
          <div className="row g-4">
            {[1, 2, 3].map((item) => (
              <div className="col-md-4" key={item}>
                <div className="card news-card h-100 shadow-sm">
                  <img
                    src={`https://via.placeholder.com/400x250/4facfe/FFFFFF?text=News+${item}`}
                    className="card-img-top"
                    alt={`News ${item}`}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <span className="badge bg-danger mb-2">Tin điện ảnh</span>
                    <h5 className="card-title">Tiêu đề tin tức số {item}</h5>
                    <p className="card-text text-muted">
                      Nội dung tóm tắt tin tức về điện ảnh, các sự kiện, khuyến mãi đặc biệt...
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        2 giờ trước
                      </small>
                      <Link to={`/tin-tuc/${item}`} className="btn btn-sm btn-outline-danger">
                        Đọc thêm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cinema Section */}
        <section className="cinema-section mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">
              <i className="bi bi-building text-danger me-2"></i>
              Hệ Thống Rạp
            </h3>
            <Link to="/raps" className="btn btn-outline-danger">
              <i className="bi bi-arrow-right-circle me-2"></i>
              Xem tất cả rạp
            </Link>
          </div>
          <div className="row g-4">
            {raps.slice(0, 4).map((rap) => (
              <div className="col-lg-3 col-md-6" key={rap.id}>
                <div className="card cinema-card text-center shadow-sm h-100">
                  <div className="card-body">
                    <div className="cinema-logo mb-3" style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto',
                      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-camera-reels text-white fs-2"></i>
                    </div>
                    <h5 className="card-title">{rap.ten_rap}</h5>
                    <p className="card-text text-muted small">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {rap.dia_chi.substring(0, 30)}...
                    </p>
                    <Link to={`/rap/${rap.id}`} className="btn btn-outline-danger btn-sm">
                      <i className="bi bi-calendar-check me-1"></i>
                      Xem lịch chiếu
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Custom CSS */}
      <style>{`
        .movie-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          overflow: hidden;
        }

        .movie-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
        }

        .movie-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .movie-card:hover .movie-overlay {
          opacity: 1;
        }

        .hot-movie-card,
        .news-card,
        .cinema-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .hot-movie-card:hover,
        .news-card:hover,
        .cinema-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }

        .carousel-caption {
          background: rgba(0,0,0,0.5);
          border-radius: 10px;
          padding: 30px;
        }

        .quick-booking .card {
          border: none;
          border-radius: 15px;
        }

        .badge {
          font-size: 0.85rem;
          padding: 0.5rem 0.8rem;
        }
      `}</style>
    </div>
  );
}



export default Home;