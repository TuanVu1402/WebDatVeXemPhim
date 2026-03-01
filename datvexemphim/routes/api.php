<?php

use App\Http\Controllers\API\RapChieuController;
use App\Http\Controllers\API\SuatChieuController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::apiResource('phims', App\Http\Controllers\API\PhimController::class);

// Route tạo tài khoản
Route::post('/taonguoidung', [App\Http\Controllers\API\NguoiDungController::class, 'store']);

// Route đăng nhập
Route::post('/dangnhap', [App\Http\Controllers\API\NguoiDungController::class, 'login']);

// CRUD Người dùng (Admin)
Route::get('/nguoidung', [App\Http\Controllers\API\NguoiDungController::class, 'index']);
Route::get('/nguoidung/{id}', [App\Http\Controllers\API\NguoiDungController::class, 'show']);
Route::put('/nguoidung/{id}', [App\Http\Controllers\API\NguoiDungController::class, 'update']);
Route::delete('/nguoidung/{id}', [App\Http\Controllers\API\NguoiDungController::class, 'destroy']);

// Route cũ (backward compatibility)
Route::get('/danhsachnguoidung', [App\Http\Controllers\API\NguoiDungController::class, 'index']);
// Trang chủ
Route::get('/trangchu', [App\Http\Controllers\API\TrangChu::class, 'index']);

// Banners
Route::get('/banners', [App\Http\Controllers\API\BannerController::class, 'index']);
Route::post('/banners', [App\Http\Controllers\API\BannerController::class, 'store']);
Route::get('/banners/{id}', [App\Http\Controllers\API\BannerController::class, 'show']);
Route::put('/banners/{id}', [App\Http\Controllers\API\BannerController::class, 'update']);
Route::delete('/banners/{id}', [App\Http\Controllers\API\BannerController::class, 'destroy']);


// 1. Lấy tất cả rạp
Route::get('/raps', [RapChieuController::class, 'index']);

// 2. Chi tiết rạp
Route::get('/raps/{id}', [RapChieuController::class, 'show']);

// 3. Lấy phim đang chiếu tại rạp
Route::get('/raps/{id}/phims', [RapChieuController::class, 'getPhimsByRap']);

// 4. Lấy lịch chiếu theo rạp và ngày
Route::get('/raps/{id}/lich-chieu', [RapChieuController::class, 'getLichChieuByRapAndDate']);

// 5. Tìm kiếm rạp
Route::get('/raps/search', [RapChieuController::class, 'search']);

// 6-8. CRUD Rạp (Admin only)
Route::post('/raps', [RapChieuController::class, 'store']);
Route::put('/raps/{id}', [RapChieuController::class, 'update']);
Route::delete('/raps/{id}', [RapChieuController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| API Routes - Suất Chiếu
|--------------------------------------------------------------------------
*/

// QUAN TRỌNG: Đặt route cụ thể TRƯỚC route động {id}

// 1. Tìm kiếm suất chiếu (phải đặt trước /suat-chieu/{id})
Route::get('/suat-chieu/tim-kiem', [SuatChieuController::class, 'timKiem']);

// 2. Lấy tất cả suất chiếu
Route::get('/suat-chieu', [SuatChieuController::class, 'index']);

// 3. Chi tiết suất chiếu
Route::get('/suat-chieu/{id}', [SuatChieuController::class, 'show']);

// 4. Lấy suất chiếu theo phim
Route::get('/phims/{phimId}/suat-chieu', [SuatChieuController::class, 'getByPhim']);

// 5. Lấy suất chiếu theo rạp
Route::get('/raps/{rapId}/suat-chieu', [SuatChieuController::class, 'getByRap']);

// 6-8. CRUD Suất chiếu (Admin only)
Route::post('/suat-chieu/batch', [SuatChieuController::class, 'storeBatch']);
Route::post('/suat-chieu', [SuatChieuController::class, 'store']);
Route::put('/suat-chieu/{id}', [SuatChieuController::class, 'update']);
Route::delete('/suat-chieu/{id}', [SuatChieuController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| API Routes - Ghế và Đặt vé
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\API\GheController;
use App\Http\Controllers\API\VeXemPhimController;

// Ghế
Route::get('/suat-chieu/{id}/ghe', [GheController::class, 'getSoDoGhe']);
Route::post('/ghe/dat', [GheController::class, 'datGhe']);
Route::post('/ghe/huy', [GheController::class, 'huyDatGhe']);

// Vé
Route::post('/dat-ve', [VeXemPhimController::class, 'datVe']);
Route::get('/ve', [VeXemPhimController::class, 'index']); // Admin
Route::get('/ve/{id}', [VeXemPhimController::class, 'show']);
Route::get('/nguoidung/{id}/ve', [VeXemPhimController::class, 'getVeByNguoiDung']);
Route::delete('/ve/{id}', [VeXemPhimController::class, 'huyVe']);