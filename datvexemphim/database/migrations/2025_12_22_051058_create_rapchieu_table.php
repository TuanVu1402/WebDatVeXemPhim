<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rapchieu', function (Blueprint $table) {
            $table->id();
            $table->string('ten_rap', 255);
            $table->text('dia_chi');
            $table->string('so_dien_thoai', 20)->nullable();
            $table->string('logo')->nullable();
            $table->text('mo_ta')->nullable();
            $table->boolean('trang_thai')->default(1)->comment('1: Hoạt động, 0: Đóng cửa');
            // Không cần timestamps vì Model đã set false
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapchieu');
    }
};