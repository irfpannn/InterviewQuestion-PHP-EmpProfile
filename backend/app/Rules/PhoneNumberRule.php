<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PhoneNumberRule implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail('The :attribute must be a valid phone number.');
            return;
        }

        // Remove all non-digit characters
        $cleaned = preg_replace('/\D/', '', $value);

        // Check if it's a valid phone number (10-15 digits)
        if (!preg_match('/^\d{10,15}$/', $cleaned)) {
            $fail('The :attribute must be a valid phone number with 10-15 digits.');
        }
    }
}
