import React, { createContext, useContext, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "../services/employeeApi";
import { toast } from "sonner";
import type { Employee, EmployeeFilters } from "../types/employee";
import type { EmployeeFormData } from "../lib/schemas";
import { ITEMS_PER_PAGE } from "../constants";

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  filters: EmployeeFilters;
  setFilters: (filters: EmployeeFilters) => void;
  setCurrentPage: (page: number) => void;
  addEmployee: (data: EmployeeFormData) => Promise<void>;
  updateEmployee: (id: string, data: EmployeeFormData) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  refreshEmployees: () => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
  isCreating: boolean;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployee must be used within an EmployeeProvider");
  }
  return context;
};

interface EmployeeProviderProps {
  children: React.ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    department: "",
    position: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  const { success: showSuccess, error: showError } = toast;
  const queryClient = useQueryClient();

  const {
    data: employeeData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["employees", currentPage, filters],
    queryFn: () =>
      employeeApi.getEmployees({
        page: currentPage,
        per_page: ITEMS_PER_PAGE,
        search: filters.search,
        department: filters.department,
        position: filters.position,
        sort_by: filters.sortBy,
        sort_direction: filters.sortOrder,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  const createMutation = useMutation({
    mutationFn: (data: EmployeeFormData) => employeeApi.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      showSuccess("Employee has been successfully created.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create employee";
      showError("Error", message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) =>
      employeeApi.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      showSuccess("Employee has been successfully updated.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update employee";
      showError("Error", message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      showSuccess("Employee has been successfully deleted.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete employee";
      showError("Error", message);
    },
  });

  const addEmployee = useCallback(
    async (data: EmployeeFormData) => {
      await createMutation.mutateAsync(data);
    },
    [createMutation]
  );

  const updateEmployee = useCallback(
    async (id: string, data: EmployeeFormData) => {
      await updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  const deleteEmployee = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const refreshEmployees = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["employees"] });
  }, [queryClient]);

  const handleSetFilters = useCallback((newFilters: EmployeeFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const contextValue: EmployeeContextType = {
    employees: employeeData?.data?.data || [],
    loading,
    error: error ? "Failed to load employees" : null,
    totalPages: employeeData?.data?.meta?.last_page || 1,
    currentPage,
    filters,
    setFilters: handleSetFilters,
    setCurrentPage,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCreating: createMutation.isPending,
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};
