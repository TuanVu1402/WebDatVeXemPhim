<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SuatChieu;
use App\Models\Phim;
use App\Models\RapChieu;
use Carbon\Carbon;

class SuatChieuSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy danh sách phim đang chiếu
        $phimsDangChieu = Phim::where('trang_thai', 'dang_chieu')->get();
        
        // Lấy danh sách rạp
        $raps = RapChieu::where('trang_thai', 1)->get();

        if ($phimsDangChieu->isEmpty()) {
            $this->command->warn('⚠️ Không có phim đang chiếu! Chạy PhimSeeder trước.');
            return;
        }

        if ($raps->isEmpty()) {
            $this->command->warn('⚠️ Không có rạp chiếu! Chạy RapChieuSeeder trước.');
            return;
        }

        $phongChieus = ['Phòng 1', 'Phòng 2', 'Phòng 3', 'Phòng IMAX', 'Phòng VIP', 'Phòng 4DX'];
        $gioBatDau = ['09:00', '11:30', '14:00', '16:30', '19:00', '21:30'];
        $giaVe = [70000, 80000, 90000, 100000, 120000, 150000];
        
        $count = 0;

        // Tạo suất chiếu cho 7 ngày tới
        for ($day = 0; $day < 7; $day++) {
            $ngay = Carbon::today()->addDays($day);

            foreach ($phimsDangChieu as $phim) {
                // Mỗi phim chiếu ở 3-5 rạp ngẫu nhiên
                $soRap = rand(3, 5);
                $selectedRaps = $raps->random(min($soRap, $raps->count()));

                foreach ($selectedRaps as $rap) {
                    // Mỗi rạp có 3-5 suất chiếu cho 1 phim
                    $soSuat = rand(3, 5);
                    $selectedGios = collect($gioBatDau)->random(min($soSuat, count($gioBatDau)));

                    foreach ($selectedGios as $gio) {
                        SuatChieu::create([
                            'phim_id' => $phim->id,
                            'rapchieu_id' => $rap->id,
                            'ngay_chieu' => $ngay->format('Y-m-d'),
                            'gio_chieu' => $gio,
                            'phong_chieu' => $phongChieus[array_rand($phongChieus)],
                            'gia_ve' => $giaVe[array_rand($giaVe)]
                        ]);
                        $count++;
                    }
                }
            }
        }

        $this->command->info("✅ Đã tạo {$count} suất chiếu cho 7 ngày tới!");
    }
}