<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('nguoidung', function (Blueprint $table) {
            $table->id();
            $table->string('hoten');
            $table->string('email')->unique();
            $table->string('mat_khau');
            $table->enum('vai_tro', ['admin', 'user'])->default('user');
        });
    }

    public function down()
    {
        Schema::dropIfExists('nguoidung');
    }
};