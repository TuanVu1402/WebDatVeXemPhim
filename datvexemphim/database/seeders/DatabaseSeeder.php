<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // 1. Tạo người dùng trước
            // NguoiDungSeeder::class,
            
            // 2. Tạo rạp chiếu
            RapChieuSeeder::class,
            
            // 3. Tạo phim
            // PhimSeeder::class,
            
            // 4. Tạo banner
            // BannerSeeder::class,
            
            // 5. Tạo suất chiếu (phải sau Phim và RapChieu)
            SuatChieuSeeder::class,
        ]);
    }
}