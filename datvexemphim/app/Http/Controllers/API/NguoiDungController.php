<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\NguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class NguoiDungController extends Controller
{
    // Lấy danh sách người dùng
    public function index()
    {
        $nguoidung = NguoiDung::all();
        return response()->json([
            'success' => true,
            'data' => $nguoidung
        ]);
    }

    // Tạo người dùng mới
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'hoten' => 'required|string|max:255',
            'email' => 'required|email|unique:nguoidung,email',
            'mat_khau' => 'required|min:6',
            'vai_tro' => 'nullable|in:admin,user'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $nguoidung = NguoiDung::create([
            'hoten' => $request->hoten,
            'email' => $request->email,
            'mat_khau' => Hash::make($request->mat_khau),
            'vai_tro' => $request->vai_tro ?? 'user'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo người dùng thành công',
            'data' => $nguoidung
        ], 201);
    }

    // Xem chi tiết người dùng
    public function show($id)
    {
        $nguoidung = NguoiDung::with('veXemPhim')->find($id);
        
        if (!$nguoidung) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $nguoidung
        ]);
    }

    // Cập nhật người dùng
    public function update(Request $request, $id)
    {
        $nguoidung = NguoiDung::find($id);
        
        if (!$nguoidung) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'hoten' => 'string|max:255',
            'email' => 'email|unique:nguoidung,email,' . $id,
            'mat_khau' => 'min:6',
            'vai_tro' => 'in:admin,user'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('hoten')) {
            $nguoidung->hoten = $request->hoten;
        }
        if ($request->has('email')) {
            $nguoidung->email = $request->email;
        }
        if ($request->has('mat_khau')) {
            $nguoidung->mat_khau = Hash::make($request->mat_khau);
        }
        if ($request->has('vai_tro')) {
            $nguoidung->vai_tro = $request->vai_tro;
        }
        
        $nguoidung->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật người dùng thành công',
            'data' => $nguoidung
        ]);
    }

    // Xóa người dùng
    public function destroy($id)
    {
        $nguoidung = NguoiDung::find($id);
        
        if (!$nguoidung) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        $nguoidung->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Xóa người dùng thành công'
        ]);
    }

    // Đăng nhập người dùng
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'mat_khau' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Tìm người dùng theo email
        $nguoidung = NguoiDung::where('email', $request->email)->first();

        // Kiểm tra người dùng có tồn tại không
        if (!$nguoidung) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        // Kiểm tra mật khẩu
        if (!Hash::check($request->mat_khau, $nguoidung->mat_khau)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        // Đăng nhập thành công
        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'data' => [
                'id' => $nguoidung->id,
                'hoten' => $nguoidung->hoten,
                'email' => $nguoidung->email,
                'vai_tro' => $nguoidung->vai_tro
            ]
        ]);
    }
}
