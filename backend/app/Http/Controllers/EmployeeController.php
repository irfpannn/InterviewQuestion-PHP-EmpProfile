<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\EmployeeRepositoryInterface;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Http\Resources\EmployeeCollection;
use App\Http\Resources\EmployeeResource;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    private EmployeeRepositoryInterface $employeeRepository;
    private EmployeeService $employeeService;

    public function __construct(
        EmployeeRepositoryInterface $employeeRepository,
        EmployeeService $employeeService
    ) {
        $this->employeeRepository = $employeeRepository;
        $this->employeeService = $employeeService;
    }

    /**
     * Display a listing of the employees.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 10);
        $search = $request->input('search');
        $department = $request->input('department');
        $sortBy = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');

        $employees = $this->employeeRepository->paginate($perPage, $search, $department, $sortBy, $sortDirection);

        return response()->json([
            'data' => new EmployeeCollection($employees),
        ]);
    }

    /**
     * Store a newly created employee in storage.
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $employee = $this->employeeService->createEmployee($request->validated());

        return response()->json([
            'data' => new EmployeeResource($employee),
            'message' => 'Employee created successfully',
        ], 201);
    }

    /**
     * Display the specified employee.
     */
    public function show(string $id): JsonResponse
    {
        $employee = $this->employeeRepository->findById($id);

        if (!$employee || $employee->isDeleted()) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
                'title' => 'Employee Not Found',
                'status' => 404,
                'detail' => 'The requested employee could not be found',
            ], 404);
        }

        return response()->json([
            'data' => new EmployeeResource($employee),
        ]);
    }

    /**
     * Update the specified employee in storage.
     */
    public function update(UpdateEmployeeRequest $request, string $id): JsonResponse
    {
        $employee = $this->employeeRepository->findById($id);

        if (!$employee || $employee->isDeleted()) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
                'title' => 'Employee Not Found',
                'status' => 404,
                'detail' => 'The requested employee could not be found',
            ], 404);
        }

        try {
            $employee = $this->employeeService->updateEmployee($id, $request->validated());

            return response()->json([
                'data' => new EmployeeResource($employee),
                'message' => 'Employee updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
                'title' => 'Update Failed',
                'status' => 500,
                'detail' => 'Failed to update employee: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified employee from storage (soft delete).
     */
    public function destroy(string $id): JsonResponse
    {
        $employee = $this->employeeRepository->findById($id);

        if (!$employee || $employee->isDeleted()) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
                'title' => 'Employee Not Found',
                'status' => 404,
                'detail' => 'The requested employee could not be found',
            ], 404);
        }

        $this->employeeRepository->delete($id);

        return response()->json([
            'message' => 'Employee deleted successfully',
        ]);
    }

    /**
     * Upload profile photo for the specified employee.
     */
    public function uploadPhoto(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'profile_photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $employee = $this->employeeRepository->findById($id);

        if (!$employee || $employee->isDeleted()) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
                'title' => 'Employee Not Found',
                'status' => 404,
                'detail' => 'The requested employee could not be found',
            ], 404);
        }

        $employee = $this->employeeService->updateEmployee($id, $request->all());

        return response()->json([
            'data' => new EmployeeResource($employee),
            'message' => 'Profile photo uploaded successfully',
        ]);
    }

    /**
     * Delete profile photo for the specified employee.
     */
    public function deletePhoto(string $id): JsonResponse
    {
        $employee = $this->employeeRepository->findById($id);

        if (!$employee || $employee->isDeleted()) {
            return response()->json([
                'type' => 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
                'title' => 'Employee Not Found',
                'status' => 404,
                'detail' => 'The requested employee could not be found',
            ], 404);
        }

        $employee = $this->employeeService->updateEmployee($id, ['profile_photo' => null]);

        return response()->json([
            'data' => new EmployeeResource($employee),
            'message' => 'Profile photo deleted successfully',
        ]);
    }
}
