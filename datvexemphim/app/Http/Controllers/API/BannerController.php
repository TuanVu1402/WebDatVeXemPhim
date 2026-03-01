<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BannerController extends Controller
{
    /**
     * Lấy danh sách tất cả banner (Admin)
     */
    public function index()
    {
        try {
            $banners = Banner::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách banner thành công',
                'data' => $banners
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách banner',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy chi tiết banner
     */
    public function show($id)
    {
        try {
            $banner = Banner::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Lấy thông tin banner thành công',
                'data' => $banner
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy banner',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Tạo banner mới
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'tieu_de' => 'required|string|max:255',
                'hinh_anh' => 'required|string',
                'lien_ket' => 'nullable|string',
                'mo_ta' => 'nullable|string',
                'trang_thai' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $banner = Banner::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Tạo banner thành công',
                'data' => $banner
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo banner',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật banner
     */
    public function update(Request $request, $id)
    {
        try {
            $banner = Banner::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'tieu_de' => 'string|max:255',
                'hinh_anh' => 'string',
                'lien_ket' => 'nullable|string',
                'mo_ta' => 'nullable|string',
                'trang_thai' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $banner->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật banner thành công',
                'data' => $banner
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật banner',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa banner
     */
    public function destroy($id)
    {
        try {
            $banner = Banner::findOrFail($id);
            $banner->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa banner thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa banner',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}