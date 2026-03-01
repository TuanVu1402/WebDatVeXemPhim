<?php


namespace Database\Factories;

use App\Models\Banner;
use Illuminate\Database\Eloquent\Factories\Factory;

class BannerFactory extends Factory
{
    protected $model = Banner::class;

    public function definition()
    {
        return [
            'hinh_anh' => 'https://via.placeholder.com/1200x400/3498db/FFFFFF?text=Banner',
            'tieu_de' => $this->faker->sentence(6),
            'mo_ta' => $this->faker->paragraph(2),
            'lien_ket' => $this->faker->url(),
            'thu_tu' => $this->faker->numberBetween(1, 10),
            'trang_thai' => $this->faker->boolean(90), // 90% active
        ];
    }
}