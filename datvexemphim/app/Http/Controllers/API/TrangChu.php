<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use App\Models\Phim;

class TrangChu extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
  public function index()
    {
        try {
            // Lấy banners
            $banners = Banner::where('trang_thai', 1)
                            ->orderBy('thu_tu','asc')
                            ->get();

         // Lấy phim đang chiếu
            $phimDangChieu = Phim::where('trang_thai', 'dang_chieu')
                ->orderBy('ngay_khoi_chieu', 'desc')
                ->limit(8)
                ->get();

         
            // Lấy phim sắp chiếu
            $phimSapChieu = Phim::where('trang_thai', 'sap_chieu')
                ->orderBy('ngay_khoi_chieu', 'asc')
                ->limit(8)
                ->get();
            // Lấy phim hot (rating cao)
            $phimHot = Phim::where('is_hot', true)
                ->orderBy('luot_xem', 'desc')
                ->limit(6)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy dữ liệu trang chủ thành công',
                'data' => [
                    'banners' => $banners,
                    'phim_dang_chieu' => $phimDangChieu,
                    'phim_sap_chieu' => $phimSapChieu,
                    'phim_hot' => $phimHot
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy dữ liệu trang chủ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
