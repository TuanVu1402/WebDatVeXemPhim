<?php


namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run()
    {
        // Tạo 5 banner để test
        Banner::factory()->count(5)->create();
        
        echo "✅ Đã tạo 5 banner test thành công!\n";
    }
}