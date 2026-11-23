
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registration_consents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('terms_version', 50);
            $table->string('privacy_version', 50);
            $table->timestamp('accepted_at');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_consents');
    }
};
