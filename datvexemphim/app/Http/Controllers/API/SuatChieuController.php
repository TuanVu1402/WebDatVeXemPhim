<?php


namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SuatChieu;
use App\Models\Phim;
use App\Models\RapChieu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class SuatChieuController extends Controller
{
    /**
     * 1. Lấy tất cả suất chiếu (cho admin - không phân trang)
     * GET /api/suat-chieu
     */
    public function index(Request $request)
    {
        try {
            $suatChieus = SuatChieu::with(['phim', 'rapChieu'])
                ->orderBy('ngay_chieu', 'desc')
                ->orderBy('gio_chieu', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách suất chiếu thành công',
                'data' => $suatChieus
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách suất chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 2. Lấy chi tiết một suất chiếu
     * GET /api/suat-chieu/{id}
     */
    public function show($id)
    {
        try {
            $suatChieu = SuatChieu::with(['phim', 'rapChieu'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết suất chiếu thành công',
                'data' => $suatChieu
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy suất chiếu',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * 3. Lấy suất chiếu theo phim
     * GET /api/phims/{phimId}/suat-chieu
     * Có thể lọc theo ngày bằng query param: ?ngay=2025-12-23
     */
    public function getByPhim(Request $request, $phimId)
    {
        try {
            $phim = Phim::findOrFail($phimId);

            $query = SuatChieu::with('rapChieu')
                ->byPhim($phimId)
                ->upcoming();

            // Nếu có tham số ngày, lọc theo ngày
            if ($request->has('ngay')) {
                $ngay = Carbon::parse($request->ngay)->format('Y-m-d');
                $query->whereDate('ngay_chieu', $ngay);
            }

            $lichChieu = $query->orderBy('ngay_chieu')
                ->orderBy('gio_chieu')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy lịch chiếu theo phim thành công',
                'data' => $lichChieu
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
     * 4. Lấy suất chiếu theo rạp
     * GET /api/raps/{rapId}/suat-chieu
     */
    public function getByRap($rapId)
    {
        try {
            $rap = RapChieu::findOrFail($rapId);

            $lichChieu = SuatChieu::with('phim')
                ->byRap($rapId)
                ->upcoming()
                ->get()
                ->groupBy(function($suat) {
                    return $suat->ngay_chieu->format('Y-m-d');
                })
                ->map(function($suatsByDate, $date) {
                    return [
                        'ngay' => Carbon::parse($date)->format('d/m/Y'),
                        'thu' => Carbon::parse($date)->locale('vi')->dayName,
                        'phims' => $suatsByDate->groupBy('phim_id')->map(function($suats) {
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
                        })->values()
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Lấy lịch chiếu theo rạp thành công',
                'data' => [
                    'rap' => $rap,
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
     * 5. Tìm suất chiếu theo phim, rạp và ngày
     * GET /api/suat-chieu/tim-kiem?phim_id=1&rap_id=2&ngay=2025-12-22
     */
    public function timKiem(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'phim_id' => 'nullable|exists:phims,id',
                'rap_id' => 'nullable|exists:rapchieu,id',
                'ngay' => 'nullable|date|after_or_equal:today'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = SuatChieu::with(['phim', 'rapChieu'])->upcoming();

            if ($request->has('phim_id')) {
                $query->byPhim($request->phim_id);
            }

            if ($request->has('rap_id')) {
                $query->byRap($request->rap_id);
            }

            if ($request->has('ngay')) {
                $query->byDate($request->ngay);
            }

            $suatChieus = $query->get();

            return response()->json([
                'success' => true,
                'message' => 'Tìm kiếm suất chiếu thành công',
                'data' => $suatChieus
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tìm kiếm suất chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 6. Tạo suất chiếu mới (Admin)
     * POST /api/suat-chieu
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'phim_id' => 'required|exists:phims,id',
                'rapchieu_id' => 'required|exists:rapchieu,id',
                'ngay_chieu' => 'required|date|after_or_equal:today',
                'gio_chieu' => 'required|date_format:H:i',
                'phong_chieu' => 'required|string|max:50',
                'gia_ve' => 'required|numeric|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Kiểm tra trùng lịch
            $exists = SuatChieu::where('rapchieu_id', $request->rapchieu_id)
                ->where('phong_chieu', $request->phong_chieu)
                ->where('ngay_chieu', $request->ngay_chieu)
                ->where('gio_chieu', $request->gio_chieu)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Suất chiếu bị trùng lịch'
                ], 422);
            }

            $suatChieu = SuatChieu::create($request->all());
            $suatChieu->load(['phim', 'rapChieu']);

            return response()->json([
                'success' => true,
                'message' => 'Tạo suất chiếu thành công',
                'data' => $suatChieu
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo suất chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 6b. Tạo nhiều suất chiếu cùng lúc (Admin)
     * POST /api/suat-chieu/batch
     * Body: {
     *   "phim_id": 1,
     *   "rapchieu_ids": [1, 2, 3],
     *   "phong_chieu": "Phòng 1",
     *   "ngay_chieu": "2026-03-01",
     *   "gio_chieus": ["09:00", "12:00", "15:00"],
     *   "gia_ve": 80000
     * }
     */
    public function storeBatch(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'phim_id' => 'required|exists:phims,id',
                'rapchieu_ids' => 'required|array|min:1',
                'rapchieu_ids.*' => 'integer|exists:rapchieu,id',
                'ngay_chieu' => 'required|date',
                'gio_chieus' => 'required|array|min:1',
                'gio_chieus.*' => 'date_format:H:i',
                'phong_chieu' => 'required|string|max:50',
                'gia_ve' => 'required|numeric|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $created = [];
            $skipped = [];

            foreach ($request->rapchieu_ids as $rapId) {
                foreach ($request->gio_chieus as $gio) {
                    // Kiểm tra trùng lịch
                    $exists = SuatChieu::where('rapchieu_id', $rapId)
                        ->where('phong_chieu', $request->phong_chieu)
                        ->where('ngay_chieu', $request->ngay_chieu)
                        ->where('gio_chieu', $gio)
                        ->exists();

                    if ($exists) {
                        $rap = RapChieu::find($rapId);
                        $skipped[] = ($rap->ten_rap ?? "Rạp $rapId") . " - $gio";
                        continue;
                    }

                    $suatChieu = SuatChieu::create([
                        'phim_id' => $request->phim_id,
                        'rapchieu_id' => $rapId,
                        'phong_chieu' => $request->phong_chieu,
                        'ngay_chieu' => $request->ngay_chieu,
                        'gio_chieu' => $gio,
                        'gia_ve' => $request->gia_ve
                    ]);
                    $created[] = $suatChieu;
                }
            }

            $message = 'Đã tạo ' . count($created) . ' suất chiếu thành công!';
            if (count($skipped) > 0) {
                $message .= ' Bỏ qua ' . count($skipped) . ' suất bị trùng: ' . implode(', ', $skipped);
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'created' => count($created),
                    'skipped' => count($skipped),
                    'suat_chieus' => $created
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo suất chiếu hàng loạt',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 7. Cập nhật suất chiếu (Admin)
     * PUT /api/suat-chieu/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $suatChieu = SuatChieu::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'phim_id' => 'exists:phims,id',
                'rapchieu_id' => 'exists:rapchieu,id',
                'ngay_chieu' => 'date|after_or_equal:today',
                'gio_chieu' => 'date_format:H:i',
                'phong_chieu' => 'string|max:50',
                'gia_ve' => 'numeric|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $suatChieu->update($request->all());
            $suatChieu->load(['phim', 'rapChieu']);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật suất chiếu thành công',
                'data' => $suatChieu
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật suất chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 8. Xóa suất chiếu (Admin)
     * DELETE /api/suat-chieu/{id}
     */
    public function destroy($id)
    {
        try {
            $suatChieu = SuatChieu::findOrFail($id);
            
            // Kiểm tra xem đã có vé đặt chưa
            if ($suatChieu->veXemPhim()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa suất chiếu đã có người đặt vé'
                ], 422);
            }

            $suatChieu->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa suất chiếu thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa suất chiếu',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}