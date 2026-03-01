<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGheVexemphimTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ghe_vexemphim', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ghe_id');
            $table->unsignedBigInteger('vexemphim_id');
            $table->timestamps();

            $table->foreign('ghe_id')->references('id')->on('ghe')->onDelete('cascade');
            $table->foreign('vexemphim_id')->references('id')->on('vexemphim')->onDelete('cascade');
            
            $table->unique(['ghe_id', 'vexemphim_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ghe_vexemphim');
    }
}
