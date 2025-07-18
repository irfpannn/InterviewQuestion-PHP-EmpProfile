<?php

use App\Models\Employee;
use App\Repositories\EmployeeJsonRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->testFilePath = storage_path('app/test_employees.json');
    
    // Clean up test file
    if (file_exists($this->testFilePath)) {
        unlink($this->testFilePath);
    }
    
    // Create a custom repository for testing
    $this->repository = new class extends EmployeeJsonRepository {
        public function __construct()
        {
            $this->filePath = storage_path('app/test_employees.json');
        }
    };
});

afterEach(function () {
    if (file_exists($this->testFilePath)) {
        unlink($this->testFilePath);
    }
});

describe('EmployeeJsonRepository', function () {
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

        $employee = $this->repository->create($data);

        expect($employee)->toBeInstanceOf(Employee::class);
        expect($employee->name)->toBe('John Doe');
        expect($employee->email)->toBe('john.doe@example.com');
        expect($employee->department)->toBe('engineering');
        expect($employee->salary)->toBe(75000.00);
        expect($employee->id)->not->toBeNull();
    });

    it('can find an employee by id', function () {
        $data = [
            'name' => 'Jane Smith',
            'gender' => 'female',
            'maritalStatus' => 'married',
            'phoneNo' => '1234567890',
            'email' => 'jane.smith@example.com',
            'address' => '456 Oak Ave',
            'dateOfBirth' => '1985-05-15',
            'nationality' => 'canadian',
            'hireDate' => '2022-03-15',
            'department' => 'marketing',
            'emergencyContactName' => 'John Smith',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Marketing Manager',
            'salary' => 65000.00,
        ];

        $employee = $this->repository->create($data);
        $foundEmployee = $this->repository->findById($employee->id);

        expect($foundEmployee)->toBeInstanceOf(Employee::class);
        expect($foundEmployee->name)->toBe('Jane Smith');
        expect($foundEmployee->id)->toBe($employee->id);
    });

    it('can update an employee', function () {
        $data = [
            'name' => 'Bob Johnson',
            'gender' => 'male',
            'maritalStatus' => 'single',
            'phoneNo' => '1234567890',
            'email' => 'bob.johnson@example.com',
            'address' => '789 Pine St',
            'dateOfBirth' => '1988-12-10',
            'nationality' => 'british',
            'hireDate' => '2021-06-01',
            'department' => 'sales',
            'emergencyContactName' => 'Alice Johnson',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Sales Representative',
            'salary' => 50000.00,
        ];

        $employee = $this->repository->create($data);
        $updateData = [
            'name' => 'Bob Johnson Jr.',
            'salary' => 55000.00,
            'department' => 'finance',
        ];

        $updatedEmployee = $this->repository->update($employee->id, $updateData);

        expect($updatedEmployee)->toBeInstanceOf(Employee::class);
        expect($updatedEmployee->name)->toBe('Bob Johnson Jr.');
        expect($updatedEmployee->salary)->toBe(55000.00);
        expect($updatedEmployee->department)->toBe('finance');
        expect($updatedEmployee->email)->toBe('bob.johnson@example.com'); // Unchanged
    });

    it('can soft delete an employee', function () {
        $data = [
            'name' => 'Alice Williams',
            'gender' => 'female',
            'maritalStatus' => 'divorced',
            'phoneNo' => '1234567890',
            'email' => 'alice.williams@example.com',
            'address' => '321 Elm St',
            'dateOfBirth' => '1992-08-20',
            'nationality' => 'australian',
            'hireDate' => '2023-02-15',
            'department' => 'hr',
            'emergencyContactName' => 'Bob Williams',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'HR Specialist',
            'salary' => 60000.00,
        ];

        $employee = $this->repository->create($data);
        $deleted = $this->repository->delete($employee->id);

        expect($deleted)->toBeTrue();

        $foundEmployee = $this->repository->findById($employee->id);
        expect($foundEmployee->isDeleted())->toBeTrue();
        expect($foundEmployee->deletedAt)->not->toBeNull();
    });

    it('can paginate employees', function () {
        // Create multiple employees
        for ($i = 1; $i <= 15; $i++) {
            $this->repository->create([
                'name' => "Employee {$i}",
                'gender' => 'male',
                'maritalStatus' => 'single',
                'phoneNo' => '1234567890',
                'email' => "employee{$i}@example.com",
                'address' => "Address {$i}",
                'dateOfBirth' => '1990-01-01',
                'nationality' => 'american',
                'hireDate' => '2023-01-01',
                'department' => 'engineering',
                'emergencyContactName' => "Emergency {$i}",
                'emergencyContactPhone' => '0987654321',
                'jobTitle' => 'Software Engineer',
                'salary' => 75000.00,
            ]);
        }

        $paginated = $this->repository->paginate(10);

        expect($paginated->count())->toBe(10);
        expect($paginated->total())->toBe(15);
        expect($paginated->currentPage())->toBe(1);
        expect($paginated->lastPage())->toBe(2);
    });

    it('can search employees', function () {
        $this->repository->create([
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
        ]);

        $this->repository->create([
            'name' => 'Jane Smith',
            'gender' => 'female',
            'maritalStatus' => 'married',
            'phoneNo' => '1234567890',
            'email' => 'jane.smith@example.com',
            'address' => '456 Oak Ave',
            'dateOfBirth' => '1985-05-15',
            'nationality' => 'canadian',
            'hireDate' => '2022-03-15',
            'department' => 'marketing',
            'emergencyContactName' => 'John Smith',
            'emergencyContactPhone' => '0987654321',
            'jobTitle' => 'Marketing Manager',
            'salary' => 65000.00,
        ]);

        $result = $this->repository->paginate(10, 'John');
        expect($result->count())->toBe(1);
        expect($result->first()->name)->toBe('John Doe');

        $result = $this->repository->paginate(10, 'marketing');
        expect($result->count())->toBe(1);
        expect($result->first()->department)->toBe('marketing');
    });

    it('can store uploaded file', function () {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('avatar.jpg', 100, 100);
        $path = $this->repository->storeFile($file);

        expect($path)->toContain('avatars/');
        expect($path)->toContain('.jpg');
        Storage::disk('public')->assertExists($path);
    });

    it('returns null when employee not found', function () {
        $employee = $this->repository->findById('non-existent-id');
        expect($employee)->toBeNull();
    });

    it('returns false when trying to delete non-existent employee', function () {
        $deleted = $this->repository->delete('non-existent-id');
        expect($deleted)->toBeFalse();
    });

    it('returns null when trying to update non-existent employee', function () {
        $updated = $this->repository->update('non-existent-id', ['name' => 'New Name']);
        expect($updated)->toBeNull();
    });
});
