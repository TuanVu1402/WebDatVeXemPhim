<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePhimTable extends Migration
{
    public function up()
    {
        Schema::create('phims', function (Blueprint $table) {
            $table->id();
            $table->string('ten_phim');
            $table->string('the_loai');
            $table->string('dao_dien');
            $table->string('dien_vien');
            $table->string('quoc_gia');
            $table->integer('nam_san_xuat');
            $table->integer('thoi_luong');
            $table->text('mo_ta');
            $table->string('hinh_anh');
            $table->string('trailer');
            $table->enum('trang_thai', ['dang_chieu', 'sap_chieu', 'da_ngung_chieu'])->default('sap_chieu');
            $table->date('ngay_khoi_chieu')->nullable(); // Bỏ after()
            $table->integer('luot_xem')->default(0);
            $table->boolean('is_hot')->default(false);
        });
    }

    public function down()
    {
        Schema::dropIfExists('phims');
    }
}