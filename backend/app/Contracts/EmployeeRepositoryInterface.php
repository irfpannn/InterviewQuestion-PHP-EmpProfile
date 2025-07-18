<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

interface EmployeeRepositoryInterface
{
    /**
     * Get paginated employees with optional filters
     */
    public function paginate(
        int $perPage = 10,
        ?string $search = null,
        ?string $department = null,
        ?string $sortBy = null,
        string $sortDirection = 'asc'
    ): LengthAwarePaginator;

    /**
     * Find employee by ID
     */
    public function findById(string $id): ?Employee;

    /**
     * Create new employee
     */
    public function create(array $data): Employee;

    /**
     * Update employee
     */
    public function update(string $id, array $data): ?Employee;

    /**
     * Soft delete employee
     */
    public function delete(string $id): bool;

    /**
     * Store uploaded file and return file path
     */
    public function storeFile(UploadedFile $file, string $directory = 'avatars'): string;

    /**
     * Get all employees (without pagination)
     */
    public function all(): array;
}
