# Test API Suất Chiếu

## 1. Test trong Browser Console

Mở trang chi tiết phim và chạy trong Console:

```javascript
// Test API lấy tất cả rạp
fetch('http://localhost:8000/api/raps')
  .then(r => r.json())
  .then(data => console.log('Rạp:', data));

// Test API tìm kiếm suất chiếu
fetch('http://localhost:8000/api/suat-chieu/tim-kiem?phim_id=7&rap_id=1')
  .then(r => r.json())
  .then(data => console.log('Suất chiếu:', data));
```

## 2. Test bằng Postman/Thunder Client

### Lấy danh sách rạp
```
GET http://localhost:8000/api/raps
```

### Tìm kiếm suất chiếu
```
GET http://localhost:8000/api/suat-chieu/tim-kiem?phim_id=7&rap_id=1
GET http://localhost:8000/api/suat-chieu/tim-kiem?phim_id=7&rap_id=1&ngay=2026-01-15
```

### Lấy suất chiếu theo phim
```
GET http://localhost:8000/api/phims/7/suat-chieu
```

## 3. Kiểm tra dữ liệu trong Database

```sql
-- Xem suất chiếu
SELECT * FROM suat_chieu LIMIT 10;

-- Xem rạp
SELECT * FROM rapchieu LIMIT 10;

-- Xem phim
SELECT * FROM phim LIMIT 10;

-- Join để kiểm tra quan hệ
SELECT 
    sc.id,
    p.ten_phim,
    r.ten_rap,
    sc.ngay_chieu,
    sc.gio_chieu,
    sc.phong_chieu,
    sc.gia_ve
FROM suat_chieu sc
JOIN phim p ON sc.phim_id = p.id
JOIN rapchieu r ON sc.rapchieu_id = r.id
WHERE sc.ngay_chieu >= CURDATE()
ORDER BY sc.ngay_chieu, sc.gio_chieu
LIMIT 20;
```

## 4. Các vấn đề thường gặp

### Không có dữ liệu
- Kiểm tra database có dữ liệu suất chiếu chưa
- Kiểm tra ngày chiếu phải >= hôm nay
- Kiểm tra foreign key đúng chưa

### CORS Error
- Thêm vào `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
```

### 404 Not Found
- Kiểm tra route trong `routes/api.php`
- Đảm bảo route `/suat-chieu/tim-kiem` đặt TRƯỚC `/suat-chieu/{id}`
- Chạy `php artisan route:list` để xem routes

## 5. Response mẫu

```json
{
  "success": true,
  "message": "Tìm kiếm suất chiếu thành công",
  "data": [
    {
      "id": 1,
      "phim_id": 7,
      "rapchieu_id": 1,
      "ngay_chieu": "2026-01-15",
      "gio_chieu": "09:00:00",
      "phong_chieu": "Phòng 1",
      "gia_ve": 75000,
      "phim": {
        "id": 7,
        "ten_phim": "Fugit qui.",
        "hinh_anh": "..."
      },
      "rap_chieu": {
        "id": 1,
        "ten_rap": "Lotte Cinema Tây Sơn",
        "dia_chi": "..."
      }
    }
  ]
}
```
