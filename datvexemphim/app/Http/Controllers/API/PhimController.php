<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Phim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PhimController extends Controller
{
    /**
     * Lấy danh sách tất cả phim
     */
    public function index()
    {
        try {
            $phims = Phim::orderBy('id', 'desc')->get();
            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách phim thành công',
                'data' => $phims
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách phim',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tạo phim mới
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ten_phim' => 'required|string|max:255',
            'the_loai' => 'required|string',
            'dao_dien' => 'nullable|string',
            'dien_vien' => 'nullable|string',
            'quoc_gia' => 'nullable|string',
            'nam_san_xuat' => 'nullable|integer',
            'thoi_luong' => 'nullable|integer',
            'mo_ta' => 'nullable|string',
            'hinh_anh' => 'nullable|string',
            'trailer' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();
            // Đảm bảo các trường không null khi user bỏ trống
            $data['dao_dien'] = $data['dao_dien'] ?? '';
            $data['dien_vien'] = $data['dien_vien'] ?? '';
            $data['quoc_gia'] = $data['quoc_gia'] ?? '';
            $data['nam_san_xuat'] = $data['nam_san_xuat'] ?? date('Y');
            $data['thoi_luong'] = $data['thoi_luong'] ?? 0;
            $data['mo_ta'] = $data['mo_ta'] ?? '';
            $data['hinh_anh'] = $data['hinh_anh'] ?? '';
            $data['trailer'] = $data['trailer'] ?? '';
            
            $phim = Phim::create($data);
            return response()->json([
                'success' => true,
                'message' => 'Tạo phim thành công',
                'data' => $phim
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo phim',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy thông tin chi tiết 1 phim
     */
    public function show($id)
    {
        try {
            $phim = Phim::with('suatChieu.rapChieu')->find($id);
            
            if (!$phim) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy phim'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy thông tin phim thành công',
                'data' => $phim
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin phim',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật thông tin phim
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'ten_phim' => 'string|max:255',
            'the_loai' => 'string',
            'dao_dien' => 'nullable|string',
            'dien_vien' => 'nullable|string',
            'quoc_gia' => 'nullable|string',
            'nam_san_xuat' => 'nullable|integer',
            'thoi_luong' => 'nullable|integer',
            'mo_ta' => 'nullable|string',
            'hinh_anh' => 'nullable|string',
            'trailer' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $phim = Phim::find($id);
            
            if (!$phim) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy phim'
                ], 404);
            }

            $phim->update($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật phim thành công',
                'data' => $phim
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật phim',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa phim
     */
    public function destroy($id)
    {
        try {
            $phim = Phim::find($id);
            
            if (!$phim) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy phim'
                ], 404);
            }

            $phim->delete();
            return response()->json([
                'success' => true,
                'message' => 'Xóa phim thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa phim',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}