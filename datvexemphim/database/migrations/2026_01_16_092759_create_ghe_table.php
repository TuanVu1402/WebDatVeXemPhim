<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGheTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ghe', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('suatchieu_id');
            $table->string('hang_ghe', 1); // A, B, C, D, E, F, G, H, I, J
            $table->string('so_ghe', 2); // 1-12
            $table->enum('loai_ghe', ['thuong', 'vip', 'doi'])->default('thuong');
            $table->boolean('trang_thai')->default(0); // 0 = trống, 1 = đã đặt
            $table->unsignedBigInteger('vexemphim_id')->nullable();
            $table->timestamps();

            $table->foreign('suatchieu_id')->references('id')->on('suatchieu')->onDelete('cascade');
            $table->foreign('vexemphim_id')->references('id')->on('vexemphim')->onDelete('set null');
            
            // Index để tìm kiếm nhanh
            $table->index(['suatchieu_id', 'trang_thai']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ghe');
    }
}
