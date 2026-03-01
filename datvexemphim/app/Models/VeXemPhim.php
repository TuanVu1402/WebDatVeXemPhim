<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VeXemPhim extends Model
{
    use HasFactory;
    
    protected $table = 'vexemphim';
    protected $fillable = [
        'ma_ve',
        'nguoidung_id',
        'suatchieu_id',
        'tong_tien',
        'ho_ten',
        'email',
        'so_dien_thoai',
        'trang_thai'
    ];

    protected $casts = [
        'tong_tien' => 'decimal:2'
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(NguoiDung::class, 'nguoidung_id');
    }

    public function suatChieu()
    {
        return $this->belongsTo(SuatChieu::class, 'suatchieu_id');
    }

    public function ghes()
    {
        return $this->hasMany(Ghe::class, 'vexemphim_id');
    }
}
