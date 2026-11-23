<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;
use Symfony\Component\HttpKernel\Exception\HttpException;

class EmailVerificationController extends Controller
{
    public function verify(
        Request $request,
        string $id,
        string $hash
    ): View {
        $user = User::findOrFail($id);

        $expectedHash = sha1($user->getEmailForVerification());

        if (!hash_equals($expectedHash, $hash)) {
            throw new HttpException(
                403,
                'This email verification link is invalid.'
            );
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return view('email-verified', [
            'loginUrl' => rtrim(
                config('reslink.frontend_url'),
                '/'
            ) . '/#login',
        ]);
    }
}
