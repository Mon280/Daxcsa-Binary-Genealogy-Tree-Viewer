<?php

use App\Http\Controllers\DistributorController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DistributorController::class, 'index']);
Route::post('/generateTree', [DistributorController::class, 'generateTree']);
Route::get('/tree-data', [DistributorController::class, 'fetchTreeData']);
