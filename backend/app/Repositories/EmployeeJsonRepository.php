<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\EmployeeRepositoryInterface;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator as PaginationLengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EmployeeJsonRepository implements EmployeeRepositoryInterface
{
    protected string $filePath;

    public function __construct()
    {
        $this->filePath = storage_path('app/employees.json');
    }

    /**
     * Get paginated employees with optional filters
     */
    public function paginate(
        int $perPage = 10,
        ?string $search = null,
        ?string $department = null,
        ?string $sortBy = null,
        string $sortDirection = 'asc'
    ): LengthAwarePaginator {
        $employees = $this->getEmployees();

        // Filter out deleted employees
        $employees = $employees->filter(fn (Employee $employee) => !$employee->isDeleted());

        // Apply search filter
        if ($search) {
            $employees = $employees->filter(function (Employee $employee) use ($search) {
                return str_contains(strtolower($employee->name), strtolower($search)) ||
                       str_contains(strtolower($employee->department), strtolower($search)) ||
                       str_contains(strtolower($employee->email), strtolower($search));
            });
        }

        // Apply department filter
        if ($department) {
            $employees = $employees->filter(function (Employee $employee) use ($department) {
                return strtolower($employee->department) === strtolower($department);
            });
        }

        // Apply sorting
        if ($sortBy) {
            $employees = $employees->sortBy($sortBy, SORT_REGULAR, $sortDirection === 'desc');
        }

        // Paginate
        $currentPage = request()->input('page', 1);
        $offset = ($currentPage - 1) * $perPage;
        $items = $employees->slice($offset, $perPage);

        return new PaginationLengthAwarePaginator(
            $items->values(),
            $employees->count(),
            $perPage,
            $currentPage,
            [
                'path' => request()->url(),
                'pageName' => 'page',
            ]
        );
    }

    /**
     * Find employee by ID
     */
    public function findById(string $id): ?Employee
    {
        $employees = $this->getEmployees();

        return $employees->firstWhere('id', $id);
    }

    /**
     * Create new employee
     */
    public function create(array $data): Employee
    {
        $employee = new Employee($data);
        $employees = $this->getEmployees();
        $employees->push($employee);

        $this->saveEmployees($employees);

        return $employee;
    }

    /**
     * Update employee
     */
    public function update(string $id, array $data): ?Employee
    {
        $employees = $this->getEmployees();
        $employee = $employees->firstWhere('id', $id);

        if (!$employee) {
            return null;
        }

        // Merge the existing data with the new data
        $existingData = $employee->toArray();
        $updatedData = array_merge($existingData, $data);
        $updatedData['updatedAt'] = Carbon::now()->toISOString();

        // Create a new Employee instance with proper type conversion
        $updatedEmployee = new Employee($updatedData);

        // Update the collection
        $employees = $employees->map(function ($emp) use ($id, $updatedEmployee) {
            return $emp->id === $id ? $updatedEmployee : $emp;
        });

        $this->saveEmployees($employees);

        return $updatedEmployee;
    }

    /**
     * Soft delete employee
     */
    public function delete(string $id): bool
    {
        $employees = $this->getEmployees();
        $employee = $employees->firstWhere('id', $id);

        if (!$employee) {
            return false;
        }

        $employee->delete();
        $this->saveEmployees($employees);

        return true;
    }

    /**
     * Store uploaded file and return file path
     */
    public function storeFile(UploadedFile $file, string $directory = 'avatars'): string
    {
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $directory . '/' . $filename;

        Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

        return $path;
    }

    /**
     * Get all employees (without pagination)
     */
    public function all(): array
    {
        return $this->getEmployees()->toArray();
    }

    /**
     * Get employees collection from JSON file
     */
    private function getEmployees(): Collection
    {
        if (!file_exists($this->filePath)) {
            return collect();
        }

        $content = file_get_contents($this->filePath);
        $data = json_decode($content, true) ?? [];

        return collect($data)->map(fn (array $item) => Employee::fromArray($item));
    }

    /**
     * Save employees collection to JSON file
     */
    private function saveEmployees(Collection $employees): void
    {
        $directory = dirname($this->filePath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $data = $employees->map(fn (Employee $employee) => $employee->toArray())->toArray();
        file_put_contents($this->filePath, json_encode($data, JSON_PRETTY_PRINT));
    }
}
