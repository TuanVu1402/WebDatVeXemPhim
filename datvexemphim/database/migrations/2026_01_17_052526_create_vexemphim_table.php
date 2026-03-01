<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVexemphimTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vexemphim', function (Blueprint $table) {
            $table->id();
            $table->string('ma_ve')->unique();
            $table->unsignedBigInteger('nguoidung_id')->nullable();
            $table->unsignedBigInteger('suatchieu_id');
            $table->string('ho_ten');
            $table->string('email');
            $table->string('so_dien_thoai', 15);
            $table->decimal('tong_tien', 10, 2);
            $table->enum('trang_thai', ['cho_thanh_toan', 'da_thanh_toan', 'da_huy'])->default('da_thanh_toan');
            $table->timestamps();

            $table->foreign('nguoidung_id')->references('id')->on('nguoidung')->onDelete('set null');
            $table->foreign('suatchieu_id')->references('id')->on('suatchieu')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vexemphim');
    }
}
