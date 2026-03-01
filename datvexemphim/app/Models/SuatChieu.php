<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class SuatChieu extends Model
{
    use HasFactory;

    protected $table = 'suatchieu';
    
    protected $fillable = [
        'phim_id',
        'rapchieu_id',  // ✅ THÊM
        'ngay_chieu',
        'gio_chieu',
        'phong_chieu',
        'gia_ve'        // ✅ THÊM
    ];
    
    public $timestamps = false;

    protected $casts = [
        'ngay_chieu' => 'date',
        'gia_ve' => 'decimal:2'
    ];

    /**
     * Suất chiếu thuộc về 1 Phim
     */
    public function phim()
    {
        return $this->belongsTo(Phim::class, 'phim_id');
    }

    /**
     * Suất chiếu thuộc về 1 Rạp
     */
    public function rapChieu()
    {
        return $this->belongsTo(RapChieu::class, 'rapchieu_id');
    }

    /**
     * Suất chiếu có nhiều ghế
     */
    public function ghe()
    {
        return $this->hasMany(Ghe::class, 'suatchieu_id');
    }

    /**
     * Suất chiếu có nhiều vé
     */
    public function veXemPhim()
    {
        return $this->hasMany(VeXemPhim::class, 'suatchieu_id');
    }

    /**
     * Scope: Lấy suất chiếu sắp tới (từ hôm nay trở đi)
     */
    public function scopeUpcoming($query)
    {
        return $query->where('ngay_chieu', '>=', Carbon::today())
                     ->orderBy('ngay_chieu', 'asc')
                     ->orderBy('gio_chieu', 'asc');
    }

    /**
     * Scope: Lấy suất chiếu theo ngày cụ thể
     */
    public function scopeByDate($query, $date)
    {
        return $query->whereDate('ngay_chieu', $date);
    }

    /**
     * Scope: Lấy suất chiếu theo phim
     */
    public function scopeByPhim($query, $phimId)
    {
        return $query->where('phim_id', $phimId);
    }

    /**
     * Scope: Lấy suất chiếu theo rạp
     */
    public function scopeByRap($query, $rapId)
    {
        return $query->where('rapchieu_id', $rapId);
    }

    /**
     * Accessor: Kết hợp ngày và giờ chiếu
     */
    public function getGioChieuDayAttribute()
    {
        return Carbon::parse($this->ngay_chieu->format('Y-m-d') . ' ' . $this->gio_chieu);
    }

    /**
     * Accessor: Format giá vé
     */
    public function getGiaVeFormatAttribute()
    {
        return number_format($this->gia_ve, 0, ',', '.') . ' VNĐ';
    }
}