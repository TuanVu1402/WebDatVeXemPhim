<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\VeXemPhim;
use App\Models\Ghe;
use App\Models\SuatChieu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class VeXemPhimController extends Controller
{
    /**
     * 1. Đặt vé (tạo vé mới)
     * POST /api/dat-ve
     * Body: {
     *   "nguoidung_id": 1,
     *   "suatchieu_id": 1,
     *   "ghe_ids": [1,2,3],
     *   "ho_ten": "Nguyen Van A",
     *   "email": "email@example.com",
     *   "so_dien_thoai": "0123456789"
     * }
     */
    public function datVe(Request $request)
    {
        DB::beginTransaction();
        
        try {
            $validator = Validator::make($request->all(), [
                'nguoidung_id' => 'nullable|exists:nguoidung,id',
                'suatchieu_id' => 'required|exists:suatchieu,id',
                'ghe_ids' => 'required|array|min:1',
                'ghe_ids.*' => 'integer|exists:ghe,id',
                'ho_ten' => 'required|string|max:255',
                'email' => 'required|email',
                'so_dien_thoai' => 'required|string|max:20'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Kiểm tra ghế có còn trống không
            $gheDaDat = Ghe::whereIn('id', $request->ghe_ids)
                ->where('trang_thai', 1)
                ->count();

            if ($gheDaDat > 0) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Một số ghế đã được đặt, vui lòng chọn ghế khác'
                ], 400);
            }

            // Lấy thông tin suất chiếu
            $suatChieu = SuatChieu::with(['phim', 'rapChieu'])->findOrFail($request->suatchieu_id);
            
            // Tính tổng tiền
            $soLuongVe = count($request->ghe_ids);
            $tongTien = $suatChieu->gia_ve * $soLuongVe;

            // Tạo mã vé duy nhất
            $latestVe = VeXemPhim::latest('id')->first();
            $nextId = $latestVe ? $latestVe->id + 1 : 1;
            $maVe = 'VE' . str_pad($nextId, 6, '0', STR_PAD_LEFT);

            // Tạo vé
            $ve = VeXemPhim::create([
                'ma_ve' => $maVe,
                'nguoidung_id' => $request->nguoidung_id,
                'suatchieu_id' => $request->suatchieu_id,
                'tong_tien' => $tongTien,
                'ho_ten' => $request->ho_ten,
                'email' => $request->email,
                'so_dien_thoai' => $request->so_dien_thoai,
                'trang_thai' => 'da_thanh_toan'
            ]);

            // Cập nhật trạng thái ghế
            Ghe::whereIn('id', $request->ghe_ids)->update([
                'trang_thai' => 1,
                'vexemphim_id' => $ve->id
            ]);

            // Lấy danh sách ghế đã đặt
            $gheDaDat = Ghe::whereIn('id', $request->ghe_ids)->get();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đặt vé thành công',
                'data' => [
                    've' => $ve,
                    'ghe_da_dat' => $gheDaDat,
                    'suat_chieu' => $suatChieu,
                    'ma_dat_ve' => $ve->ma_ve
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi đặt vé',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 2. Lấy danh sách vé của người dùng
     * GET /api/nguoidung/{id}/ve
     */
    public function getVeByNguoiDung($nguoiDungId)
    {
        try {
            $ves = VeXemPhim::with(['suatChieu.phim', 'suatChieu.rapChieu'])
                ->where('nguoidung_id', $nguoiDungId)
                ->orderBy('id', 'desc')
                ->get();

            // Thêm thông tin ghế cho mỗi vé
            $ves = $ves->map(function($ve) {
                $ve->ghe_da_dat = Ghe::where('vexemphim_id', $ve->id)->get();
                $ve->ma_dat_ve = 'VE' . str_pad($ve->id, 6, '0', STR_PAD_LEFT);
                return $ve;
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách vé thành công',
                'data' => $ves
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách vé',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 3. Lấy chi tiết vé
     * GET /api/ve/{id}
     */
    public function show($id)
    {
        try {
            $ve = VeXemPhim::with(['suatChieu.phim', 'suatChieu.rapChieu', 'nguoiDung'])
                ->findOrFail($id);

            $ve->ghe_da_dat = Ghe::where('vexemphim_id', $ve->id)->get();
            $ve->ma_dat_ve = 'VE' . str_pad($ve->id, 6, '0', STR_PAD_LEFT);

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết vé thành công',
                'data' => $ve
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy vé',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * 4. Lấy tất cả vé (Admin)
     * GET /api/ve
     */
    public function index()
    {
        try {
            $ves = VeXemPhim::with(['suatChieu.phim', 'suatChieu.rapChieu', 'nguoiDung'])
                ->orderBy('id', 'desc')
                ->get();

            $ves = $ves->map(function($ve) {
                $ve->ghe_da_dat = Ghe::where('vexemphim_id', $ve->id)->get();
                $ve->ma_dat_ve = 'VE' . str_pad($ve->id, 6, '0', STR_PAD_LEFT);
                return $ve;
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách vé thành công',
                'data' => $ves
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách vé',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 5. Hủy vé
     * DELETE /api/ve/{id}
     */
    public function huyVe($id)
    {
        DB::beginTransaction();
        
        try {
            $ve = VeXemPhim::findOrFail($id);

            // Cập nhật trạng thái ghế về trống
            Ghe::where('vexemphim_id', $ve->id)->update([
                'trang_thai' => 0,
                'vexemphim_id' => null
            ]);

            // Cập nhật trạng thái vé
            $ve->update(['trang_thai' => 'da_huy']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hủy vé thành công'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi hủy vé',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
