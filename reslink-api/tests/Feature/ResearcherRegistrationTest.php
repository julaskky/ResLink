<?php

namespace Tests\Feature;

use App\Models\RegistrationConsent;
use App\Models\ResearcherProfile;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ResearcherRegistrationTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Alex',
            'last_name' => 'Researcher',
            'academic_title' => 'Dr',
            'country' => 'South Africa',
            'email' => 'alex.researcher@example.com',
            'researcher_category' => 'Academic Researcher',
            'research_discipline' => 'Computer Science',
            'research_interests' =>
                'Artificial intelligence and software engineering research',
            'affiliation_type' => 'institutional',
            'institution_name' => 'Example Research University',
            'department' => 'Computer Science',
            'professional_position' => 'Research Fellow',
            'institutional_email' => 'alex@example.edu',
            'institutional_profile_url' => null,
            'orcid' => null,
            'research_profile_url' => null,
            'independent_research_description' => null,
            'password' => 'ResLinkTest2026!',
            'password_confirmation' => 'ResLinkTest2026!',
            'terms_accepted' => true,
        ], $overrides);
    }

    public function test_researcher_can_register_and_receive_verification_notification(): void
    {
        Notification::fake();

        $response = $this->postJson(
            '/api/register',
            $this->validPayload()
        );

        $response->assertCreated()
            ->assertJsonPath(
                'data.email',
                'alex.researcher@example.com'
            )
            ->assertJsonPath('data.email_verified', false)
            ->assertJsonPath('data.verification_status', 'pending')
            ->assertJsonPath('data.verification_email_sent', true);

        $user = User::where(
            'email',
            'alex.researcher@example.com'
        )->firstOrFail();

        $this->assertDatabaseHas('researcher_profiles', [
            'user_id' => $user->id,
            'first_name' => 'Alex',
            'last_name' => 'Researcher',
            'verification_status' => 'pending',
        ]);

        $this->assertDatabaseHas('registration_consents', [
            'user_id' => $user->id,
            'terms_version' => config('reslink.terms_version'),
            'privacy_version' => config('reslink.privacy_version'),
        ]);

        $this->assertNotNull(
            RegistrationConsent::where('user_id', $user->id)
                ->value('accepted_at')
        );

        Notification::assertSentTo(
            $user,
            VerifyEmail::class
        );
    }

    public function test_duplicate_email_is_rejected(): void
    {
        Notification::fake();

        $payload = $this->validPayload();

        $this->postJson('/api/register', $payload)
            ->assertCreated();

        $this->postJson('/api/register', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('researcher_profiles', 1);
        $this->assertDatabaseCount('registration_consents', 1);
    }

    public function test_registration_requires_accepted_terms(): void
    {
        $response = $this->postJson(
            '/api/register',
            $this->validPayload([
                'terms_accepted' => false,
            ])
        );

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['terms_accepted']);

        $this->assertDatabaseCount('users', 0);
    }

    public function test_invalid_orcid_checksum_is_rejected(): void
    {
        $response = $this->postJson(
            '/api/register',
            $this->validPayload([
                'orcid' => '0000-0000-0000-0000',
            ])
        );

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['orcid']);

        $this->assertDatabaseCount('users', 0);
    }

    public function test_independent_researcher_must_supply_evidence(): void
    {
        $response = $this->postJson(
            '/api/register',
            $this->validPayload([
                'affiliation_type' => 'independent',
                'institution_name' => null,
                'department' => null,
                'professional_position' => null,
                'institutional_email' => null,
                'research_profile_url' => null,
                'independent_research_description' => null,
            ])
        );

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'research_profile_url',
                'independent_research_description',
            ]);

        $this->assertDatabaseCount('users', 0);
    }
}
