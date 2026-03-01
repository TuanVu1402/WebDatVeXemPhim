<?php


namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RapChieu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RapChieuController extends Controller
{
    /**
     * 1. Lấy danh sách tất cả rạp chiếu
     * GET /api/raps
     */
    public function index()
    {
        try {
            $raps = RapChieu::where('trang_thai', 1)->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách rạp chiếu thành công',
                'data' => $raps
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách rạp chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 2. Lấy chi tiết một rạp chiếu
     * GET /api/raps/{id}
     */
    public function show($id)
    {
        try {
            $rap = RapChieu::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết rạp chiếu thành công',
                'data' => $rap
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy rạp chiếu',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * 3. Lấy danh sách phim đang chiếu tại rạp
     * GET /api/raps/{id}/phims
     */
    public function getPhimsByRap($id)
    {
        try {
            $rap = RapChieu::findOrFail($id);
            
            // Lấy phim kèm suất chiếu
            $phims = $rap->suatChieu()
                ->with('phim')
                ->upcoming()
                ->get()
                ->groupBy('phim_id')
                ->map(function($suats) {
                    return [
                        'phim' => $suats->first()->phim,
                        'so_suat_chieu' => $suats->count(),
                        'suat_chieu' => $suats->map(function($suat) {
                            return [
                                'id' => $suat->id,
                                'ngay_chieu' => $suat->ngay_chieu->format('d/m/Y'),
                                'gio_chieu' => $suat->gio_chieu,
                                'phong_chieu' => $suat->phong_chieu,
                                'gia_ve' => $suat->gia_ve,
                            ];
                        })
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách phim tại rạp thành công',
                'data' => [
                    'rap' => $rap,
                    'phims' => $phims
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách phim',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 4. Lấy lịch chiếu theo rạp và ngày
     * GET /api/raps/{id}/lich-chieu?ngay=2025-12-22
     */
    public function getLichChieuByRapAndDate($id, Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ngay' => 'required|date|after_or_equal:today'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $rap = RapChieu::findOrFail($id);
            $ngay = $request->input('ngay');

            $lichChieu = $rap->suatChieu()
                ->with('phim')
                ->byDate($ngay)
                ->orderBy('gio_chieu', 'asc')
                ->get()
                ->groupBy('phim_id')
                ->map(function($suats) {
                    return [
                        'phim' => $suats->first()->phim,
                        'suat_chieu' => $suats->map(function($suat) {
                            return [
                                'id' => $suat->id,
                                'gio_chieu' => $suat->gio_chieu,
                                'phong_chieu' => $suat->phong_chieu,
                                'gia_ve' => $suat->gia_ve,
                                'gia_ve_format' => number_format($suat->gia_ve, 0, ',', '.') . ' VNĐ'
                            ];
                        })
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'message' => 'Lấy lịch chiếu theo rạp và ngày thành công',
                'data' => [
                    'rap' => $rap,
                    'ngay' => $ngay,
                    'lich_chieu' => $lichChieu
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy lịch chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 5. Tìm kiếm rạp chiếu theo tên hoặc địa chỉ
     * GET /api/raps/search?keyword=CGV
     */
    public function search(Request $request)
    {
        try {
            $keyword = $request->input('keyword', '');

            $raps = RapChieu::where('trang_thai', 1)
                ->where(function($query) use ($keyword) {
                    $query->where('ten_rap', 'LIKE', "%{$keyword}%")
                          ->orWhere('dia_chi', 'LIKE', "%{$keyword}%");
                })
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Tìm kiếm rạp chiếu thành công',
                'data' => $raps
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tìm kiếm rạp chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 6. Tạo rạp chiếu mới (Admin)
     * POST /api/raps
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ten_rap' => 'required|string|max:255',
                'dia_chi' => 'required|string',
                'so_dien_thoai' => 'nullable|string|max:20',
                'mo_ta' => 'nullable|string',
                'logo' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $rap = RapChieu::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Tạo rạp chiếu thành công',
                'data' => $rap
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo rạp chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 7. Cập nhật rạp chiếu (Admin)
     * PUT /api/raps/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $rap = RapChieu::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'ten_rap' => 'string|max:255',
                'dia_chi' => 'string',
                'so_dien_thoai' => 'nullable|string|max:20',
                'mo_ta' => 'nullable|string',
                'logo' => 'nullable|string',
                'trang_thai' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $rap->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật rạp chiếu thành công',
                'data' => $rap
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật rạp chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 8. Xóa rạp chiếu (Admin)
     * DELETE /api/raps/{id}
     */
    public function destroy($id)
    {
        try {
            $rap = RapChieu::findOrFail($id);
            $rap->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa rạp chiếu thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa rạp chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}