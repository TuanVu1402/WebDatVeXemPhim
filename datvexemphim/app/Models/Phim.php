<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Phim extends Model
{
    use HasFactory;
    
    protected $table = 'phims'; // Chỉ định tên bảng rõ ràng
    
    public $timestamps = false;

    protected $fillable = [
        'ten_phim',
        'the_loai',
        'dao_dien',
        'dien_vien',
        'quoc_gia',
        'nam_san_xuat',
        'thoi_luong',
        'mo_ta',
        'hinh_anh',
        'trailer',
        'trang_thai',
        'ngay_khoi_chieu',
        'luot_xem',
        'is_hot'
    ];

    protected $casts = [
        'ngay_khoi_chieu' => 'date',
        'is_hot' => 'boolean'
    ];

    // Relationships
    public function suatChieu()
    {
        return $this->hasMany(SuatChieu::class);
    }

    // Scopes
    public function scopeDangChieu($query)
    {
        return $query->where('trang_thai', 'dang_chieu');
    }

    public function scopeSapChieu($query)
    {
        return $query->where('trang_thai', 'sap_chieu');
    }

    public function scopeHot($query)
    {
        return $query->where('is_hot', true);
    }
}