<?php

use App\Models\Employee;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    
    // Clean up test file
    $testFilePath = storage_path('app/employees.json');
    if (file_exists($testFilePath)) {
        unlink($testFilePath);
    }
});

describe('Employee API', function () {
    it('can create an employee', function () {
        $data = [
            'name' => 'John Doe',
            'gender' => 'male',
            'maritalStatus' => 'single',
            'phoneNo' => '1234567890',
            'email' => 'john.doe@example.com',
            'address' => '123 Main St',
            'dateOfBirth' => '1990-01-01',
            'nationality' => 'american',
            'hireDate' => '2023-01-01',
            'department' => 'engineering',
            'emergencyContactName' => 'Jane Doe',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Software Engineer',
            'salary' => 75000.00,
        ];

        $response = $this->postJson('/api/employees', $data);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'name' => 'John Doe',
                    'gender' => 'male',
                    'email' => 'john.doe@example.com',
                    'department' => 'engineering',
                    'salary' => 75000.00,
                ],
                'message' => 'Employee created successfully',
            ]);
    });

    it('can create an employee with profile photo', function () {
        $file = UploadedFile::fake()->image('avatar.jpg', 100, 100);
        
        $data = [
            'name' => 'John Doe',
            'gender' => 'male',
            'maritalStatus' => 'single',
            'phoneNo' => '1234567890',
            'email' => 'john.doe@example.com',
            'address' => '123 Main St',
            'dateOfBirth' => '1990-01-01',
            'nationality' => 'american',
            'hireDate' => '2023-01-01',
            'department' => 'engineering',
            'emergencyContactName' => 'Jane Doe',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Software Engineer',
            'salary' => 75000.00,
            'profilePhoto' => $file,
        ];

        $response = $this->postJson('/api/employees', $data);

        $response->assertStatus(201);
        
        $responseData = $response->json();
        expect($responseData['data']['profilePhoto'])->not->toBeNull();
        expect($responseData['data']['profilePhotoUrl'])->not->toBeNull();
    });

    it('validates required fields', function () {
        $response = $this->postJson('/api/employees', []);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'type',
                'title',
                'status',
                'detail',
                'errors',
            ]);
    });

    it('validates email format', function () {
        $data = [
            'name' => 'John Doe',
            'gender' => 'male',
            'maritalStatus' => 'single',
            'phoneNo' => '1234567890',
            'email' => 'invalid-email',
            'address' => '123 Main St',
            'dateOfBirth' => '1990-01-01',
            'nationality' => 'american',
            'hireDate' => '2023-01-01',
            'department' => 'engineering',
            'emergencyContactName' => 'Jane Doe',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Software Engineer',
            'salary' => 75000.00,
        ];

        $response = $this->postJson('/api/employees', $data);

        $response->assertStatus(422)
            ->assertJsonPath('errors.email', ['Please provide a valid email address']);
    });

    it('validates phone number format', function () {
        $data = [
            'name' => 'John Doe',
            'gender' => 'male',
            'maritalStatus' => 'single',
            'phoneNo' => 'invalid-phone',
            'email' => 'john.doe@example.com',
            'address' => '123 Main St',
            'dateOfBirth' => '1990-01-01',
            'nationality' => 'american',
            'hireDate' => '2023-01-01',
            'department' => 'engineering',
            'emergencyContactName' => 'Jane Doe',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Software Engineer',
            'salary' => 75000.00,
        ];

        $response = $this->postJson('/api/employees', $data);

        $response->assertStatus(422)
            ->assertJsonPath('errors.phoneNo.0', 'The phoneNo must be a valid phone number with 10-15 digits.');
    });

    it('validates date of birth is before hire date', function () {
        $data = [
            'name' => 'John Doe',
            'gender' => 'male',
            'maritalStatus' => 'single',
            'phoneNo' => '1234567890',
            'email' => 'john.doe@example.com',
            'address' => '123 Main St',
            'dateOfBirth' => '2023-01-01',
            'nationality' => 'american',
            'hireDate' => '1990-01-01',
            'department' => 'engineering',
            'emergencyContactName' => 'Jane Doe',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Software Engineer',
            'salary' => 75000.00,
        ];

        $response = $this->postJson('/api/employees', $data);

        $response->assertStatus(422)
            ->assertJsonPath('errors.hireDate.0', 'The hireDate must be after or equal to dateOfBirth.');
    });

    it('validates file upload constraints', function () {
        $file = UploadedFile::fake()->create('large-file.jpg', 3000); // 3MB file
        
        $data = [
            'name' => 'John Doe',
            'gender' => 'male',
            'maritalStatus' => 'single',
            'phoneNo' => '1234567890',
            'email' => 'john.doe@example.com',
            'address' => '123 Main St',
            'dateOfBirth' => '1990-01-01',
            'nationality' => 'american',
            'hireDate' => '2023-01-01',
            'department' => 'engineering',
            'emergencyContactName' => 'Jane Doe',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Software Engineer',
            'salary' => 75000.00,
            'profilePhoto' => $file,
        ];

        $response = $this->postJson('/api/employees', $data);

        $response->assertStatus(422)
            ->assertJsonPath('errors.profilePhoto.0', 'Profile photo must not exceed 2MB');
    });

    it('can list employees', function () {
        // Create some employees first
        $this->createTestEmployee('John Doe', 'john.doe@example.com');
        $this->createTestEmployee('Jane Smith', 'jane.smith@example.com');

        $response = $this->getJson('/api/employees');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'email',
                            'department',
                            'profilePhotoUrl',
                        ],
                    ],
                    'meta' => [
                        'current_page',
                        'total',
                        'per_page',
                    ],
                    'links' => [
                        'first',
                        'last',
                        'prev',
                        'next',
                    ],
                ],
            ]);
    });

    it('can search employees', function () {
        $this->createTestEmployee('John Doe', 'john.doe@example.com');
        $this->createTestEmployee('Jane Smith', 'jane.smith@example.com');

        $response = $this->getJson('/api/employees?search=John');

        $response->assertStatus(200);
        $data = $response->json();
        expect($data['data']['data'])->toHaveCount(1);
        expect($data['data']['data'][0]['name'])->toBe('John Doe');
    });

    it('can get specific employee', function () {
        $employee = $this->createTestEmployee('John Doe', 'john.doe@example.com');

        $response = $this->getJson("/api/employees/{$employee->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $employee->id,
                    'name' => 'John Doe',
                    'email' => 'john.doe@example.com',
                ],
            ]);
    });

    it('returns 404 for non-existent employee', function () {
        $response = $this->getJson('/api/employees/non-existent-id');

        $response->assertStatus(404)
            ->assertJson([
                'type' => 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
                'title' => 'Employee Not Found',
                'status' => 404,
                'detail' => 'The requested employee could not be found',
            ]);
    });

    it('can update employee', function () {
        $employee = $this->createTestEmployee('John Doe', 'john.doe@example.com');

        $updateData = [
            'name' => 'John Smith',
            'salary' => 80000.00,
        ];

        $response = $this->patchJson("/api/employees/{$employee->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $employee->id,
                    'name' => 'John Smith',
                    'salary' => 80000.00,
                ],
                'message' => 'Employee updated successfully',
            ]);
    });

    it('can delete employee', function () {
        $employee = $this->createTestEmployee('John Doe', 'john.doe@example.com');

        $response = $this->deleteJson("/api/employees/{$employee->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Employee deleted successfully',
            ]);

        // Verify employee is soft deleted
        $response = $this->getJson("/api/employees/{$employee->id}");
        $response->assertStatus(404);
    });

    it('respects rate limiting', function () {
        $data = [
            'name' => 'John Doe',
            'gender' => 'male',
            'maritalStatus' => 'single',
            'phoneNo' => '1234567890',
            'email' => 'john.doe@example.com',
            'address' => '123 Main St',
            'dateOfBirth' => '1990-01-01',
            'nationality' => 'american',
            'hireDate' => '2023-01-01',
            'department' => 'engineering',
            'emergencyContactName' => 'Jane Doe',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Software Engineer',
            'salary' => 75000.00,
        ];

        // Make 61 requests to trigger rate limiting
        for ($i = 0; $i < 61; $i++) {
            $response = $this->postJson('/api/employees', array_merge($data, ['email' => "test{$i}@example.com"]));
            if ($i < 60) {
                $response->assertStatus(201);
            } else {
                $response->assertStatus(429); // Too Many Requests
            }
        }
    });
});

function createTestEmployee(string $name, string $email): Employee
{
    $data = [
        'name' => $name,
        'gender' => 'male',
        'maritalStatus' => 'single',
        'phoneNo' => '1234567890',
        'email' => $email,
        'address' => '123 Main St',
        'dateOfBirth' => '1990-01-01',
        'nationality' => 'american',
        'hireDate' => '2023-01-01',
        'department' => 'engineering',
        'emergencyContactName' => 'Jane Doe',
        'emergencyContactPhone' => '0987654321',
        'jobTitle' => 'Software Engineer',
        'salary' => 75000.00,
    ];

    $response = test()->postJson('/api/employees', $data);
    $responseData = $response->json();
    
    return Employee::fromArray($responseData['data']);
}
