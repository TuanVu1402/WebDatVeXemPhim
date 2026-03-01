import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPhims: 0,
    totalRaps: 0,
    totalSuatChieu: 0,
    totalUsers: 0,
    totalVes: 0,
    doanhThu: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [phims, raps, users, ves] = await Promise.all([
        axios.get('http://localhost:8000/api/phims'),
        axios.get('http://localhost:8000/api/raps'),
        axios.get('http://localhost:8000/api/danhsachnguoidung'),
        axios.get('http://localhost:8000/api/ve')
      ]);

      const vesData = ves.data.data || [];
      const doanhThu = vesData
        .filter(v => v.trang_thai === 'da_thanh_toan')
        .reduce((sum, v) => sum + parseFloat(v.tong_tien || 0), 0);

      setStats({
        totalPhims: phims.data.data?.length || 0,
        totalRaps: raps.data.data?.length || 0,
        totalSuatChieu: 0,
        totalUsers: users.data.data?.length || 0,
        totalVes: vesData.length,
        doanhThu: doanhThu
      });
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h2><i className="bi bi-speedometer2 me-2"></i>Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-info">
            <h4>Tổng phim</h4>
            <p>{loading ? '...' : stats.totalPhims}</p>
          </div>
          <div className="stat-icon">
            <i className="bi bi-film"></i>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-info">
            <h4>Rạp chiếu</h4>
            <p>{loading ? '...' : stats.totalRaps}</p>
          </div>
          <div className="stat-icon">
            <i className="bi bi-building"></i>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-info">
            <h4>Suất chiếu</h4>
            <p>{loading ? '...' : stats.totalSuatChieu}</p>
          </div>
          <div className="stat-icon">
            <i className="bi bi-calendar3"></i>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-info">
            <h4>Người dùng</h4>
            <p>{loading ? '...' : stats.totalUsers}</p>
          </div>
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-info">
            <h4>Vé đã bán</h4>
            <p>{loading ? '...' : stats.totalVes}</p>
          </div>
          <div className="stat-icon">
            <i className="bi bi-ticket-perforated"></i>
          </div>
        </div>

        <div className="stat-card gold">
          <div className="stat-info">
            <h4>Doanh thu</h4>
            <p>{loading ? '...' : stats.doanhThu.toLocaleString('vi-VN')} đ</p>
          </div>
          <div className="stat-icon">
            <i className="bi bi-cash-coin"></i>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3><i className="bi bi-lightning-charge me-2"></i>Thao tác nhanh</h3>
        </div>
        <div className="quick-actions">
          <Link to="/admin/phims/add" className="quick-action-btn">
            <i className="bi bi-plus-circle"></i>
            <span>Thêm phim mới</span>
          </Link>
          <Link to="/admin/raps/add" className="quick-action-btn">
            <i className="bi bi-plus-circle"></i>
            <span>Thêm rạp mới</span>
          </Link>
          <Link to="/admin/suat-chieu/add" className="quick-action-btn">
            <i className="bi bi-plus-circle"></i>
            <span>Thêm suất chiếu</span>
          </Link>
          <Link to="/admin/ve" className="quick-action-btn">
            <i className="bi bi-ticket-perforated"></i>
            <span>Quản lý vé</span>
          </Link>
        </div>
      </div>

      <style>{`
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .quick-action-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .quick-action-btn i {
          font-size: 32px;
        }

        .quick-action-btn span {
          font-weight: 600;
        }

        .quick-action-btn:nth-child(2) {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .quick-action-btn:nth-child(3) {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .quick-action-btn:nth-child(4) {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
