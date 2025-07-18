<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class DateBeforeRule implements ValidationRule
{
    private string $compareField;
    private bool $strict;

    public function __construct(string $compareField, bool $strict = true)
    {
        $this->compareField = $compareField;
        $this->strict = $strict;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $request = request();
        $compareValue = $request->input($this->compareField);

        if (!$compareValue) {
            return; // Skip validation if compare field is not present
        }

        try {
            $date = new \DateTime($value);
            $compareDate = new \DateTime($compareValue);

            if ($this->strict) {
                if ($date <= $compareDate) {
                    $fail("The :attribute must be after {$this->compareField}.");
                }
            } else {
                if ($date < $compareDate) {
                    $fail("The :attribute must be after or equal to {$this->compareField}.");
                }
            }
        } catch (\Exception $e) {
            $fail('The :attribute must be a valid date.');
        }
    }
}
