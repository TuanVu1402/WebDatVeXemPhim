<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        'tieu_de',
        'hinh_anh',
        'lien_ket',
        'mo_ta',
        'thu_tu',
        'trang_thai'
    ];

    protected $casts = [
        'trang_thai' => 'boolean'
    ];
}