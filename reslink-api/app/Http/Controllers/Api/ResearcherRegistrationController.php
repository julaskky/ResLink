<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistrationConsent;
use App\Models\ResearcherProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ResearcherRegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $email = $request->input('email');
        $institutionalEmail = $request->input('institutional_email');
        $orcid = $request->input('orcid');

        $request->merge([
            'email' => is_string($email)
                ? strtolower(trim($email))
                : $email,

            'institutional_email' => is_string($institutionalEmail)
                ? strtolower(trim($institutionalEmail))
                : $institutionalEmail,

            'orcid' => is_string($orcid)
                ? strtoupper(trim($orcid))
                : $orcid,
        ]);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'academic_title' => ['nullable', 'string', 'max:50'],
            'country' => ['required', 'string', 'max:100'],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'researcher_category' => [
                'required',
                'string',
                'max:100',
            ],

            'research_discipline' => [
                'required',
                'string',
                'max:150',
            ],

            'research_interests' => [
                'required',
                'string',
                'min:20',
                'max:1000',
            ],

            'affiliation_type' => [
                'required',
                Rule::in([
                    'institutional',
                    'research',
                    'government',
                    'industry',
                    'independent',
                ]),
            ],

            'institution_name' => [
                'nullable',
                'required_unless:affiliation_type,independent',
                'string',
                'max:255',
            ],

            'department' => [
                'nullable',
                'required_unless:affiliation_type,independent',
                'string',
                'max:150',
            ],

            'professional_position' => [
                'nullable',
                'required_unless:affiliation_type,independent',
                'string',
                'max:150',
            ],

            'institutional_email' => [
                'nullable',
                'required_unless:affiliation_type,independent',
                'email',
                'max:255',
            ],

            'institutional_profile_url' => [
                'nullable',
                'url',
                'max:2048',
            ],

            'orcid' => [
                'nullable',
                'string',
                'regex:/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/',
                Rule::unique('researcher_profiles', 'orcid'),
                function ($attribute, $value, $fail) {
                    if ($value !== null && $value !== ''
                        && !$this->isValidOrcid($value)) {
                        $fail('Enter a valid ORCID iD, including its checksum.');
                    }
                },
            ],

            'research_profile_url' => [
                'nullable',
                'url',
                'max:2048',
                'required_if:affiliation_type,independent',
            ],

            'independent_research_description' => [
                'nullable',
                'required_if:affiliation_type,independent',
                'string',
                'min:30',
                'max:5000',
            ],

            'password' => [
                'required',
                'confirmed',
                Password::min(12)->mixedCase()->numbers()->symbols(),
            ],

            'terms_accepted' => [
                'required',
                'accepted',
            ],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => trim(
                    $validated['first_name'] . ' ' .
                    $validated['last_name']
                ),
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            ResearcherProfile::create([
                'user_id' => $user->id,
                'academic_title' => $validated['academic_title'] ?? null,
                'first_name' => trim($validated['first_name']),
                'last_name' => trim($validated['last_name']),
                'country' => trim($validated['country']),
                'researcher_category' => $validated['researcher_category'],
                'research_discipline' => $validated['research_discipline'],
                'research_interests' => trim($validated['research_interests']),
                'affiliation_type' => $validated['affiliation_type'],
                'institution_name' => $validated['institution_name'] ?? null,
                'department' => $validated['department'] ?? null,
                'professional_position' =>
                    $validated['professional_position'] ?? null,
                'institutional_email' =>
                    $validated['institutional_email'] ?? null,
                'institutional_profile_url' =>
                    $validated['institutional_profile_url'] ?? null,
                'orcid' => $validated['orcid'] ?: null,
                'research_profile_url' =>
                    $validated['research_profile_url'] ?? null,
                'independent_research_description' =>
                    $validated['independent_research_description'] ?? null,
            ]);

            RegistrationConsent::create([
                'user_id' => $user->id,
                'terms_version' => config('reslink.terms_version'),
                'privacy_version' => config('reslink.privacy_version'),
                'accepted_at' => now(),
            ]);

            return $user;
        });

        $verificationEmailSent = false;

        try {
            $user->sendEmailVerificationNotification();
            $verificationEmailSent = true;
        } catch (\Throwable $exception) {
            // Avoid putting email addresses or mail-provider details in this log.
            Log::error('ResLink verification email delivery failed.', [
                'exception_class' => get_class($exception),
            ]);
        }

        return response()->json([
            'message' => $verificationEmailSent
                ? 'Registration received. Check your email for the verification link.'
                : 'Your account was created, but the verification email could not be sent. Please try resending it.',
            'data' => [
                'user_id' => $user->id,
                'email' => $user->email,
                'email_verified' => $user->hasVerifiedEmail(),
                'verification_status' => 'pending',
                'verification_email_sent' => $verificationEmailSent,
            ],
        ], 201);
    }

    public function resendVerification(Request $request): JsonResponse
    {
        $email = $request->input('email');

        $request->merge([
            'email' => is_string($email)
                ? strtolower(trim($email))
                : $email,
        ]);

        $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $user = User::where('email', $request->input('email'))->first();

        if ($user && !$user->hasVerifiedEmail()) {
            try {
                $user->sendEmailVerificationNotification();
            } catch (\Throwable $exception) {
                Log::error('ResLink verification email resend failed.', [
                    'exception_class' => get_class($exception),
                ]);
            }
        }

        // Return the same message whether or not the account exists.
        return response()->json([
            'message' => 'If an unverified account exists for that address, a verification email will be sent.',
        ]);
    }

    private function isValidOrcid(string $orcid): bool
    {
        $digits = str_replace('-', '', $orcid);

        if (!preg_match('/^\d{15}[\dX]$/', $digits)) {
            return false;
        }

        $total = 0;

        for ($i = 0; $i < 15; $i++) {
            $total = ($total + (int) $digits[$i]) * 2;
        }

        $remainder = $total % 11;
        $result = (12 - $remainder) % 11;
        $checksum = $result === 10 ? 'X' : (string) $result;

        return $digits[15] === $checksum;
    }
}
