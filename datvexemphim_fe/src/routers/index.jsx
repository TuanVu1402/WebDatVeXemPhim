import { Routes, Route } from 'react-router-dom';
import DangNhap from '../components/DangNhapnguoidung';
import DangKy from '../components/Taonguoidung';
import TrangChu from '../pages/TrangChu';
import DanhSachRap from '../pages/DanhSachRap';
import ChiTietRap from '../pages/ChiTietRap';
import ChiTietPhim from '../pages/ChiTietPhim';
import BookingPage from '../pages/BookingPage';
import BookingSuccess from '../pages/BookingSuccess';
import MyBookings from '../pages/MyBookings';
import LichChieuTheoRap from '../pages/LichChieuTheoRap';
import LichChieuTheoPhim from '../pages/LichChieuTheoPhim';

// Admin imports
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminPhimList from '../pages/admin/PhimList';
import AdminPhimForm from '../pages/admin/PhimForm';
import AdminRapList from '../pages/admin/RapList';
import AdminRapForm from '../pages/admin/RapForm';
import AdminSuatChieuList from '../pages/admin/SuatChieuList';
import AdminSuatChieuForm from '../pages/admin/SuatChieuForm';
import AdminBannerList from '../pages/admin/BannerList';
import AdminBannerForm from '../pages/admin/BannerForm';
import AdminUserList from '../pages/admin/UserList';
import AdminUserForm from '../pages/admin/UserForm';
import AdminVeList from '../pages/admin/VeList';

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<TrangChu />} />
      <Route path="/dang-nhap" element={<DangNhap />} />
      <Route path="/dang-ky" element={<DangKy />} />
      <Route path="/raps" element={<DanhSachRap />} />
      <Route path="/rap/:id" element={<ChiTietRap />} />
      <Route path="/phim/:id" element={<ChiTietPhim />} />
      <Route path="/booking/:suatChieuId" element={<BookingPage />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/lich-chieu" element={<LichChieuTheoRap />} />
      <Route path="/lich-chieu-phim" element={<LichChieuTheoPhim />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        
        {/* Quản lý Phim */}
        <Route path="phims" element={<AdminPhimList />} />
        <Route path="phims/add" element={<AdminPhimForm />} />
        <Route path="phims/edit/:id" element={<AdminPhimForm />} />
        
        {/* Quản lý Rạp */}
        <Route path="raps" element={<AdminRapList />} />
        <Route path="raps/add" element={<AdminRapForm />} />
        <Route path="raps/edit/:id" element={<AdminRapForm />} />
        
        {/* Quản lý Suất Chiếu */}
        <Route path="suat-chieu" element={<AdminSuatChieuList />} />
        <Route path="suat-chieu/add" element={<AdminSuatChieuForm />} />
        <Route path="suat-chieu/edit/:id" element={<AdminSuatChieuForm />} />
        
        {/* Quản lý Banner */}
        <Route path="banners" element={<AdminBannerList />} />
        <Route path="banners/add" element={<AdminBannerForm />} />
        <Route path="banners/edit/:id" element={<AdminBannerForm />} />
        
        {/* Quản lý Người dùng */}
        <Route path="users" element={<AdminUserList />} />
        <Route path="users/add" element={<AdminUserForm />} />
        <Route path="users/edit/:id" element={<AdminUserForm />} />
        
        {/* Quản lý Vé */}
        <Route path="ve" element={<AdminVeList />} />
      </Route>
    </Routes>
  );
}
export default AppRouter;