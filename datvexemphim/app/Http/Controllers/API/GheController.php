<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Ghe;
use App\Models\SuatChieu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GheController extends Controller
{
    /**
     * 1. Lấy sơ đồ ghế theo suất chiếu
     * GET /api/suat-chieu/{id}/ghe
     */
    public function getSoDoGhe($suatChieuId)
    {
        try {
            $suatChieu = SuatChieu::with(['phim', 'rapChieu'])->findOrFail($suatChieuId);
            
            // Lấy tất cả ghế của suất chiếu
            $ghes = Ghe::where('suatchieu_id', $suatChieuId)
                ->orderBy('hang_ghe')
                ->orderBy('so_ghe')
                ->get();

            // Nếu chưa có ghế, tự động tạo sơ đồ ghế mẫu
            if ($ghes->isEmpty()) {
                $ghes = $this->taoSoDoGheMau($suatChieuId);
            }

            // Nhóm ghế theo hàng (A, B, C, ...)
            $soDoGhe = $this->groupGheByHang($ghes);

            return response()->json([
                'success' => true,
                'message' => 'Lấy sơ đồ ghế thành công',
                'data' => [
                    'suat_chieu' => $suatChieu,
                    'so_do_ghe' => $soDoGhe,
                    'tong_ghe' => $ghes->count(),
                    'ghe_trong' => $ghes->where('trang_thai', 0)->count(),
                    'ghe_da_dat' => $ghes->where('trang_thai', 1)->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy sơ đồ ghế',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 2. Đặt ghế (cập nhật trạng thái ghế)
     * POST /api/ghe/dat
     * Body: { "ghe_ids": [1,2,3], "suatchieu_id": 1 }
     */
    public function datGhe(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ghe_ids' => 'required|array',
                'ghe_ids.*' => 'integer|exists:ghe,id',
                'suatchieu_id' => 'required|exists:suatchieu,id'
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
                return response()->json([
                    'success' => false,
                    'message' => 'Một số ghế đã được đặt, vui lòng chọn ghế khác'
                ], 400);
            }

            // Cập nhật trạng thái ghế thành đã đặt
            Ghe::whereIn('id', $request->ghe_ids)->update(['trang_thai' => 1]);

            return response()->json([
                'success' => true,
                'message' => 'Đặt ghế thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi đặt ghế',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 3. Hủy đặt ghế
     * POST /api/ghe/huy
     */
    public function huyDatGhe(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ghe_ids' => 'required|array',
                'ghe_ids.*' => 'integer|exists:ghe,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            Ghe::whereIn('id', $request->ghe_ids)->update(['trang_thai' => 0]);

            return response()->json([
                'success' => true,
                'message' => 'Hủy đặt ghế thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi hủy đặt ghế',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tạo sơ đồ ghế mẫu cho suất chiếu
     */
    private function taoSoDoGheMau($suatChieuId)
    {
        $ghes = [];
        
        // Tạo 10 hàng (A-J), mỗi hàng 12 ghế
        $hangs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        
        foreach ($hangs as $hang) {
            for ($i = 1; $i <= 12; $i++) {
                $loaiGhe = $this->getLoaiGhe($hang);
                
                Ghe::create([
                    'suatchieu_id' => $suatChieuId,
                    'hang_ghe' => $hang,
                    'so_ghe' => (string)$i,
                    'loai_ghe' => $loaiGhe,
                    'trang_thai' => 0 // 0 = trống, 1 = đã đặt
                ]);
            }
        }

        return Ghe::where('suatchieu_id', $suatChieuId)->get();
    }

    /**
     * Nhóm ghế theo hàng
     */
    private function groupGheByHang($ghes)
    {
        $grouped = [];
        
        foreach ($ghes as $ghe) {
            $hang = $ghe->hang_ghe;
            
            if (!isset($grouped[$hang])) {
                $grouped[$hang] = [];
            }
            
            $grouped[$hang][] = [
                'id' => $ghe->id,
                'hang_ghe' => $ghe->hang_ghe,
                'so_ghe' => $hang . $ghe->so_ghe,
                'loai_ghe' => $ghe->loai_ghe,
                'trang_thai' => $ghe->trang_thai ? 1 : 0,
                'so_thu_tu' => (int)$ghe->so_ghe // Để sort đúng
            ];
        }

        // Sort ghế trong mỗi hàng theo số thứ tự
        foreach ($grouped as $hang => $ghes) {
            usort($grouped[$hang], function($a, $b) {
                return $a['so_thu_tu'] - $b['so_thu_tu'];
            });
        }

        return $grouped;
    }

    /**
     * Xác định loại ghế dựa vào hàng
     */
    private function getLoaiGhe($hang)
    {
        // Hàng A, B: Thường
        // Hàng C-G: VIP
        // Hàng H-J: Đôi
        if (in_array($hang, ['A', 'B'])) {
            return 'thuong';
        } elseif (in_array($hang, ['H', 'I', 'J'])) {
            return 'doi';
        } else {
            return 'vip';
        }
    }
}




