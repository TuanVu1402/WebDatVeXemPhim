<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ghe extends Model
{
    use HasFactory;
    
    protected $table = 'ghe';
    protected $fillable = ['suatchieu_id', 'hang_ghe', 'so_ghe', 'loai_ghe', 'trang_thai', 'vexemphim_id'];
    public $timestamps = true;

    public function suatChieu()
    {
        return $this->belongsTo(SuatChieu::class, 'suatchieu_id');
    }

    public function veXemPhim()
    {
        return $this->belongsTo(VeXemPhim::class, 'vexemphim_id');
    }
    
    public function vexemphims()
    {
        return $this->belongsToMany(VeXemPhim::class, 'ghe_vexemphim', 'ghe_id', 'vexemphim_id');
    }
}
