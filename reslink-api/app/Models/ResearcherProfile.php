<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearcherProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'academic_title',
        'first_name',
        'last_name',
        'country',
        'researcher_category',
        'research_discipline',
        'research_interests',
        'affiliation_type',
        'institution_name',
        'department',
        'professional_position',
        'institutional_email',
        'institutional_profile_url',
        'orcid',
        'research_profile_url',
        'independent_research_description',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
