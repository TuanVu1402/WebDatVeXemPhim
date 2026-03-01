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
        Schema::create('suatchieu', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('phim_id');
            $table->unsignedBigInteger('rapchieu_id');
            $table->date('ngay_chieu');
            $table->time('gio_chieu');
            $table->string('phong_chieu', 50)->default('Phòng 1');
            $table->decimal('gia_ve', 10, 2)->default(80000);
            
            // Index để tăng tốc query
            $table->index('phim_id');
            $table->index('rapchieu_id');
            $table->index('ngay_chieu');
            $table->index(['phim_id', 'rapchieu_id', 'ngay_chieu']); // Composite index

            // Khóa ngoại
            $table->foreign('phim_id')
                  ->references('id')
                  ->on('phim')
                  ->onDelete('cascade');

            $table->foreign('rapchieu_id')
                  ->references('id')
                  ->on('rapchieu')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suatchieu');
    }
};