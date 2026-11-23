<?php

use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\ResearcherRegistrationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [
    ResearcherRegistrationController::class,
    'store',
])->middleware('throttle:5,1');

Route::post('/email/verification-notification', [
    ResearcherRegistrationController::class,
    'resendVerification',
])->middleware('throttle:3,1');

Route::get('/email/verify/{id}/{hash}', [
    EmailVerificationController::class,
    'verify',
])->middleware([
    'signed',
    'throttle:6,1',
])->name('verification.verify');
