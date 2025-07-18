<?php

use App\Http\Controllers\EmployeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Employee routes with throttling but no authentication for now
Route::middleware('throttle:60,1')->group(function () {
    Route::apiResource('employees', EmployeeController::class);
    Route::post('employees/{employee}/photo', [EmployeeController::class, 'uploadPhoto']);
    Route::delete('employees/{employee}/photo', [EmployeeController::class, 'deletePhoto']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
