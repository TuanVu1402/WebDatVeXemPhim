<?php

namespace Database\Seeders;

use App\Models\Phim;
use Illuminate\Database\Seeder;

class PhimSeeder extends Seeder
{
    public function run()
    {
        // Tạo 30 phim để test
        Phim::factory()->count(30)->create();
        
        echo "✅ Đã tạo 30 phim test thành công!\n";
    }
}