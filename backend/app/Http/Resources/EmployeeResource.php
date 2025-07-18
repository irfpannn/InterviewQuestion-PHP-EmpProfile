<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        /** @var Employee $employee */
        $employee = $this->resource;

        return [
            'id' => $employee->id,
            'name' => $employee->name,
            'gender' => $employee->gender,
            'maritalStatus' => $employee->maritalStatus,
            'phoneNo' => $employee->phoneNo,
            'email' => $employee->email,
            'address' => $employee->address,
            'dateOfBirth' => $employee->dateOfBirth,
            'nationality' => $employee->nationality,
            'hireDate' => $employee->hireDate,
            'department' => $employee->department,
            'emergencyContactName' => $employee->emergencyContactName,
            'emergencyContactPhone' => $employee->emergencyContactPhone,
            'jobTitle' => $employee->jobTitle,
            'salary' => $employee->salary,
            'profilePhoto' => $employee->profilePhoto,
            'profilePhotoUrl' => $employee->getProfilePhotoUrl(),
            'createdAt' => $employee->createdAt,
            'updatedAt' => $employee->updatedAt,
        ];
    }
}
