<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NguoiDung extends Model
{
    protected $table = 'nguoidung';
    protected $fillable = ['hoten','email','mat_khau','vai_tro'];
    public $timestamps = false;

    public function veXemPhim()
    {
        return $this->hasMany(VeXemPhim::class, 'nguoidung_id');
    }
}
