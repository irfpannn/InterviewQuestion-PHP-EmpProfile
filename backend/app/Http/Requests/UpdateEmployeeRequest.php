<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Rules\DateBeforeRule;
use App\Rules\PhoneNumberRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'required', 'string', 'max:100'],
            'last_name' => ['sometimes', 'required', 'string', 'max:100'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'phone' => ['sometimes', 'required', 'string', new PhoneNumberRule()],
            'gender' => ['sometimes', 'required', 'string', 'in:male,female,other'],
            'marital_status' => ['sometimes', 'required', 'string', 'in:single,married,divorced,widowed'],
            'nationality' => ['sometimes', 'required', 'string', 'max:100'],
            'department' => ['sometimes', 'required', 'string', 'in:hr,engineering,marketing,sales,finance,operations'],
            'position' => ['sometimes', 'required', 'string', 'max:255'],
            'salary' => ['sometimes', 'required', 'numeric', 'min:0'],
            'hire_date' => ['sometimes', 'required', 'date', 'after_or_equal:date_of_birth'],
            'date_of_birth' => ['sometimes', 'required', 'date', 'before:today'],
            'address' => ['sometimes', 'required', 'string', 'max:500'],
            'emergency_contact_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'emergency_contact_phone' => ['sometimes', 'nullable', 'string', new PhoneNumberRule()],
            'profile_photo' => ['sometimes', 'nullable', 'image', 'max:2048', 'mimes:jpeg,png,jpg,gif'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required',
            'first_name.max' => 'First name must not exceed 100 characters',
            'last_name.required' => 'Last name is required',
            'last_name.max' => 'Last name must not exceed 100 characters',
            'email.required' => 'Email address is required',
            'email.email' => 'Please provide a valid email address',
            'email.max' => 'Email address must not exceed 255 characters',
            'phone.required' => 'Phone number is required',
            'gender.required' => 'Gender is required',
            'gender.in' => 'Gender must be one of: male, female, other',
            'marital_status.required' => 'Marital status is required',
            'marital_status.in' => 'Marital status must be one of: single, married, divorced, widowed',
            'nationality.required' => 'Nationality is required',
            'nationality.max' => 'Nationality must not exceed 100 characters',
            'department.required' => 'Department is required',
            'department.in' => 'Department must be one of: hr, engineering, marketing, sales, finance, operations',
            'position.required' => 'Position is required',
            'position.max' => 'Position must not exceed 255 characters',
            'salary.required' => 'Salary is required',
            'salary.numeric' => 'Salary must be a valid number',
            'salary.min' => 'Salary must be greater than or equal to 0',
            'hire_date.required' => 'Hire date is required',
            'hire_date.date' => 'Please provide a valid hire date',
            'hire_date.after_or_equal' => 'Hire date must be after or equal to date of birth',
            'date_of_birth.required' => 'Date of birth is required',
            'date_of_birth.date' => 'Please provide a valid date of birth',
            'date_of_birth.before' => 'Date of birth must be before today',
            'address.required' => 'Address is required',
            'address.max' => 'Address must not exceed 500 characters',
            'emergency_contact_name.max' => 'Emergency contact name must not exceed 100 characters',
            'emergency_contact_phone.string' => 'Emergency contact phone must be a valid phone number',
            'profile_photo.image' => 'Profile photo must be an image file',
            'profile_photo.max' => 'Profile photo must not exceed 2MB',
            'profile_photo.mimes' => 'Profile photo must be a file of type: jpeg, png, jpg, gif',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
                'title' => 'Validation Failed',
                'status' => 422,
                'detail' => 'The request data failed validation',
                'errors' => $validator->errors()->toArray(),
            ], 422)
        );
    }
}
