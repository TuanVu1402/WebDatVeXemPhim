<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RapChieu;

class RapChieuSeeder extends Seeder
{
    public function run(): void
    {
        $raps = [
            [
                'ten_rap' => 'CGV Vincom Center Metropolis',
                'dia_chi' => 'Tầng 4, Vincom Center Metropolis, 29 Liễu Giai, Ba Đình, Hà Nội',
                'so_dien_thoai' => '1900 6017',
                'mo_ta' => 'Rạp chiếu phim hiện đại với công nghệ âm thanh Dolby Atmos',
                'trang_thai' => 1
            ],
            [
                'ten_rap' => 'CGV Royal City',
                'dia_chi' => 'Tầng 7, TTTM Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội',
                'so_dien_thoai' => '1900 6017',
                'mo_ta' => '8 phòng chiếu, bao gồm phòng IMAX và 4DX',
                'trang_thai' => 1
            ],
            [
                'ten_rap' => 'Lotte Cinema Tây Sơn',
                'dia_chi' => 'Tầng 5, TTTM Lotte Mart, 333 Tây Sơn, Đống Đa, Hà Nội',
                'so_dien_thoai' => '1900 6017',
                'mo_ta' => 'Rạp chiếu phim cao cấp với ghế massage',
                'trang_thai' => 1
            ],
            [
                'ten_rap' => 'Galaxy Cinema Nguyễn Du',
                'dia_chi' => '116 Nguyễn Du, Hai Bà Trưng, Hà Nội',
                'so_dien_thoai' => '1900 2224',
                'mo_ta' => 'Rạp phim hiện đại với giá vé hợp lý',
                'trang_thai' => 1
            ],
            [
                'ten_rap' => 'BHD Star Cineplex Vincom Times City',
                'dia_chi' => 'Tầng B3, Vincom Mega Mall Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội',
                'so_dien_thoai' => '1900 2099',
                'mo_ta' => 'Cụm rạp lớn nhất Hà Nội với 12 phòng chiếu',
                'trang_thai' => 1
            ],
            [
                'ten_rap' => 'CGV Aeon Long Biên',
                'dia_chi' => 'Tầng 4, AEON Mall Long Biên, 27 Cổ Linh, Long Biên, Hà Nội',
                'so_dien_thoai' => '1900 6017',
                'mo_ta' => 'Rạp chiếu phim tại trung tâm thương mại AEON',
                'trang_thai' => 1
            ],
            [
                'ten_rap' => 'Lotte Cinema Landmark 72',
                'dia_chi' => 'Tầng 5, Landmark 72, Đường Phạm Hùng, Nam Từ Liêm, Hà Nội',
                'so_dien_thoai' => '1900 6017',
                'mo_ta' => 'Rạp cao cấp tại tòa nhà cao nhất Việt Nam',
                'trang_thai' => 1
            ],
            [
                'ten_rap' => 'Galaxy Cinema Trung Hòa',
                'dia_chi' => 'Tầng B1, Mipec Tower, 229 Tây Sơn, Đống Đa, Hà Nội',
                'so_dien_thoai' => '1900 2224',
                'mo_ta' => 'Rạp phim với không gian sang trọng',
                'trang_thai' => 1
            ],
            [
                'ten_rap' => 'CGV Mipec Long Biên',
                'dia_chi' => 'Tầng 5, TTTM Mipec Long Biên, 2 Long Biên 1, Long Biên, Hà Nội',
                'so_dien_thoai' => '1900 6017',
                'mo_ta' => 'Rạp chiếu phim chất lượng cao',
                'trang_thai' => 1
            ],
            [
                'ten_rap' => 'Platinum Cineplex Vincom Bà Triệu',
                'dia_chi' => 'Tầng 6, TTTM Vincom Center, 191 Bà Triệu, Hai Bà Trưng, Hà Nội',
                'so_dien_thoai' => '024 3974 3333',
                'mo_ta' => 'Rạp phim cao cấp tại trung tâm Hà Nội',
                'trang_thai' => 1
            ],
        ];

        foreach ($raps as $rap) {
            RapChieu::create($rap);
        }

        $this->command->info('✅ Đã tạo ' . count($raps) . ' rạp chiếu!');
    }
}