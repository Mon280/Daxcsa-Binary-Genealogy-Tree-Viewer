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
        Schema::create('distributor_relationships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('distributors')->onDelete('cascade');
            $table->foreignId('child_id')->constrained('distributors')->onDelete('cascade');
            $table->enum('binary_placement', ['Left', 'Right']);
            $table->timestamps();
            $table->unique(['parent_id', 'binary_placement']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distributor_relationships');
    }
};
