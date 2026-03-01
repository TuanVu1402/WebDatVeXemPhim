<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('tieu_de');
            $table->string('hinh_anh');
            $table->text('mo_ta')->nullable(); // Thêm cột này
            $table->string('lien_ket')->nullable(); // Đổi 'link' thành 'lien_ket'
            $table->integer('thu_tu')->default(0);
            $table->boolean('trang_thai')->default(true); // Đổi 'hien_thi' thành 'trang_thai'
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};