
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('researcher_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('academic_title', 50)->nullable();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('country', 100);

            $table->string('researcher_category', 100);
            $table->string('research_discipline', 150);
            $table->text('research_interests');

            $table->string('affiliation_type', 50);
            $table->string('institution_name', 255)->nullable();
            $table->string('department', 150)->nullable();
            $table->string('professional_position', 150)->nullable();
            $table->string('institutional_email')->nullable();
            $table->string('institutional_profile_url', 2048)->nullable();

            $table->string('orcid', 19)->nullable()->unique();
            $table->string('research_profile_url', 2048)->nullable();
            $table->text('independent_research_description')->nullable();

            $table->string('verification_status', 30)
                ->default('pending');

            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('profile_verified_at')->nullable();

            $table->timestamps();

            $table->index('verification_status');
            $table->index('country');
            $table->index('research_discipline');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('researcher_profiles');
    }
};
