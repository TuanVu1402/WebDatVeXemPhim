# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG ADMIN

## 🎯 Đã hoàn thành:

### ✅ Layout & Dashboard
- AdminLayout với sidebar responsive
- Dashboard với thống kê tổng quan
- Menu navigation đầy đủ

### ✅ Module Quản lý Phim
- **Danh sách phim** (`/admin/phims`):
  - Hiển thị tất cả phim với ảnh, trạng thái
  - Tìm kiếm phim theo tên
  - Xóa phim
  
- **Thêm/Sửa phim** (`/admin/phims/add`, `/admin/phims/edit/:id`):
  - Form đầy đủ: tên, thể loại, đạo diễn, diễn viên...
  - Upload link hình ảnh & trailer
  - Chọn trạng thái: đang chiếu, sắp chiếu, ngừng chiếu
  - Đánh dấu phim HOT

## 🚀 Cách sử dụng:

### 1. Truy cập Admin Panel:
```
http://localhost:5173/admin
```

### 2. Các route đã có:

| Route | Chức năng |
|-------|-----------|
| `/admin` | Dashboard tổng quan |
| `/admin/phims` | Danh sách phim |
| `/admin/phims/add` | Thêm phim mới |
| `/admin/phims/edit/:id` | Sửa phim |

### 3. Tính năng chính:

**Dashboard:**
- Thống kê số lượng: Phim, Rạp, Suất chiếu, Users
- Quick actions: Thêm nhanh phim, rạp, suất chiếu

**Quản lý Phim:**
- ✅ Xem danh sách với ảnh thumbnail
- ✅ Tìm kiếm phim
- ✅ Thêm phim mới (đầy đủ thông tin)
- ✅ Sửa thông tin phim
- ✅ Xóa phim
- ✅ Preview hình ảnh khi nhập link
- ✅ Quản lý trạng thái chiếu
- ✅ Đánh dấu phim HOT

## 📝 Cần bổ sung tiếp:

### Module Quản lý Rạp (TODO)
Tương tự như Phim:
- RapList.jsx - Danh sách rạp
- RapForm.jsx - Form thêm/sửa rạp
- Routes: `/admin/raps`, `/admin/raps/add`, `/admin/raps/edit/:id`

### Module Quản lý Suất Chiếu (TODO)
- SuatChieuList.jsx - Danh sách suất chiếu
- SuatChieuForm.jsx - Form thêm/sửa với:
  - Select phim (dropdown)
  - Select rạp (dropdown)
  - Chọn ngày chiếu
  - Chọn giờ chiếu
  - Nhập phòng chiếu
  - Nhập giá vé

### Module Quản lý Users (TODO)
- UserList.jsx - Danh sách người dùng
- Khóa/Mở tài khoản
- Xem lịch sử đặt vé

### Module Quản lý Banner (TODO)
- BannerList.jsx
- BannerForm.jsx với upload ảnh

## 🎨 Design đã có:
- Sidebar responsive (có thể thu gọn)
- Theme màu đỏ (brand color)
- Icons từ Bootstrap Icons
- Animations & hover effects
- Mobile responsive

## 🔒 Bảo mật (cần bổ sung):
- Login admin (chưa có)
- JWT authentication
- Protected routes
- Role-based access control

## 📦 Dependencies cần:
- react-router-dom ✅
- axios ✅
- bootstrap-icons (CDN) ✅

## 💡 Gợi ý mở rộng:
1. Thêm upload ảnh lên server thay vì dùng link
2. Thêm rich text editor cho mô tả phim
3. Thêm charts/graphs trong Dashboard
4. Export Excel danh sách
5. In vé, báo cáo doanh thu
6. Quản lý ghế ngồi theo phòng chiếu
7. Notifications realtime
8. Activity logs

Bạn có thể test ngay phần Admin Phim đã xong! 🎉
