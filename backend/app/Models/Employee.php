<?php

declare(strict_types=1);

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Support\Str;

class Employee
{
    public string $id;
    public string $name;
    public string $gender;
    public string $maritalStatus;
    public string $phoneNo;
    public string $email;
    public string $address;
    public string $dateOfBirth;
    public string $nationality;
    public string $hireDate;
    public string $department;
    public string $emergencyContactName;
    public string $emergencyContactPhone;
    public string $jobTitle;
    public float $salary;
    public ?string $profilePhoto;
    public string $createdAt;
    public string $updatedAt;
    public ?string $deletedAt;

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? Str::uuid()->toString();
        
        // Handle name field - combine first_name and last_name if provided
        if (isset($data['first_name']) && isset($data['last_name'])) {
            $this->name = trim($data['first_name'] . ' ' . $data['last_name']);
        } else {
            $this->name = $data['name'] ?? '';
        }
        
        $this->gender = $data['gender'] ?? 'other';
        $this->maritalStatus = $data['maritalStatus'] ?? 'single';
        
        // Handle phone field - support both phone and phoneNo
        $this->phoneNo = $data['phone'] ?? $data['phoneNo'] ?? '';
        
        $this->email = $data['email'] ?? '';
        $this->address = $data['address'] ?? '';
        
        // Handle date fields - support both formats
        $this->dateOfBirth = $data['date_of_birth'] ?? $data['dateOfBirth'] ?? '';
        $this->hireDate = $data['hire_date'] ?? $data['hireDate'] ?? '';
        
        $this->nationality = $data['nationality'] ?? 'American';
        $this->department = $data['department'] ?? '';
        $this->emergencyContactName = $data['emergencyContactName'] ?? '';
        $this->emergencyContactPhone = $data['emergencyContactPhone'] ?? '';
        
        // Handle job title field - support both position and jobTitle
        $this->jobTitle = $data['position'] ?? $data['jobTitle'] ?? '';
        
        // Handle salary field - convert string to float
        $this->salary = isset($data['salary']) ? (float) $data['salary'] : 0.0;
        
        $this->profilePhoto = $data['profile_photo'] ?? $data['profilePhoto'] ?? null;
        $this->createdAt = $data['createdAt'] ?? Carbon::now()->toISOString();
        $this->updatedAt = $data['updatedAt'] ?? Carbon::now()->toISOString();
        $this->deletedAt = $data['deletedAt'] ?? null;
    }

    /**
     * Convert to array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'gender' => $this->gender,
            'maritalStatus' => $this->maritalStatus,
            'phoneNo' => $this->phoneNo,
            'email' => $this->email,
            'address' => $this->address,
            'dateOfBirth' => $this->dateOfBirth,
            'nationality' => $this->nationality,
            'hireDate' => $this->hireDate,
            'department' => $this->department,
            'emergencyContactName' => $this->emergencyContactName,
            'emergencyContactPhone' => $this->emergencyContactPhone,
            'jobTitle' => $this->jobTitle,
            'salary' => $this->salary,
            'profilePhoto' => $this->profilePhoto,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'deletedAt' => $this->deletedAt,
        ];
    }

    /**
     * Create from array
     */
    public static function fromArray(array $data): self
    {
        return new self($data);
    }

    /**
     * Check if employee is deleted
     */
    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }

    /**
     * Soft delete employee
     */
    public function delete(): void
    {
        $this->deletedAt = Carbon::now()->toISOString();
        $this->updatedAt = Carbon::now()->toISOString();
    }

    /**
     * Get profile photo URL
     */
    public function getProfilePhotoUrl(): ?string
    {
        if (!$this->profilePhoto) {
            return null;
        }

        return asset('storage/' . $this->profilePhoto);
    }
}
