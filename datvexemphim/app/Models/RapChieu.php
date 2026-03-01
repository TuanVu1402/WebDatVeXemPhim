<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapChieu extends Model
{
    protected $table = 'rapchieu';
    protected $fillable = ['ten_rap','dia_chi','so_dien_thoai'];
    public $timestamps = false;

    public function suatChieu()
    {
        return $this->hasMany(SuatChieu::class, 'rapchieu_id');
    }
}
