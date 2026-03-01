<?php


namespace Database\Factories;

use App\Models\Phim;
use Illuminate\Database\Eloquent\Factories\Factory;

class PhimFactory extends Factory
{
    protected $model = Phim::class;

    public function definition()
    {
        return [
            'ten_phim' => $this->faker->sentence(3),
            'the_loai' => $this->faker->randomElement(['Hành động', 'Kinh dị', 'Hài', 'Tình cảm', 'Khoa học viễn tưởng', 'Phiêu lưu']),
            'dao_dien' => $this->faker->name(),
            'dien_vien' => $this->faker->name() . ', ' . $this->faker->name() . ', ' . $this->faker->name(),
            'quoc_gia' => $this->faker->randomElement(['Việt Nam', 'Mỹ', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc']),
            'nam_san_xuat' => $this->faker->numberBetween(2020, 2025),
            'thoi_luong' => $this->faker->numberBetween(90, 180),
            'mo_ta' => $this->faker->paragraph(5),
            'hinh_anh' => 'https://via.placeholder.com/300x450/FF5733/FFFFFF?text=Phim',
            'trailer' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'trang_thai' => $this->faker->randomElement(['dang_chieu', 'sap_chieu']),
            'ngay_khoi_chieu' => $this->faker->dateTimeBetween('-30 days', '+60 days')->format('Y-m-d'),
            'luot_xem' => $this->faker->numberBetween(100, 50000),
            'is_hot' => $this->faker->boolean(40), // 40% là phim hot
        ];
    }
}