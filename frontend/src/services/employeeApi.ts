import axios from "axios";
import type {
  EmployeeListResponse,
  EmployeeResponse,
  EmployeeFilters,
} from "../types/employee";
import type { EmployeeFormData } from "../lib/schemas";

// Helper function to transform form data to API format
const transformFormData = (formData: EmployeeFormData) => ({
  // Send first_name and last_name separately as expected by backend validation
  first_name: formData.first_name,
  last_name: formData.last_name,
  gender: formData.gender,
  marital_status: formData.marital_status,
  phone: formData.phone,
  email: formData.email,
  address: formData.address,
  date_of_birth: formData.date_of_birth,
  nationality: formData.nationality,
  hire_date: formData.hire_date,
  department: formData.department,
  emergency_contact_name: formData.emergency_contact_name || "",
  emergency_contact_phone: formData.emergency_contact_phone || "",
  position: formData.position,
  salary: formData.salary,
  profile_photo: formData.profile_photo,
});

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add any authentication tokens here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      throw new Error("Too many requests. Please try again later.");
    }

    if (error.response?.status === 500) {
      throw new Error("Internal server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export const employeeApi = {
  // Get all employees with optional filters
  getEmployees: async (
    filters?: EmployeeFilters
  ): Promise<EmployeeListResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.department) params.append("department", filters.department);
    if (filters?.position) params.append("position", filters.position);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.per_page)
      params.append("per_page", filters.per_page.toString());
    if (filters?.sort_by) params.append("sort_by", filters.sort_by);
    if (filters?.sort_direction)
      params.append("sort_direction", filters.sort_direction);

    const url = `/employees?${params.toString()}`;
    const response = await apiClient.get<EmployeeListResponse>(url);
    return response.data;
  },

  // Get single employee by ID
  getEmployee: async (id: string): Promise<EmployeeResponse> => {
    const response = await apiClient.get<EmployeeResponse>(`/employees/${id}`);
    return response.data;
  },

  // Create new employee
  createEmployee: async (data: EmployeeFormData): Promise<EmployeeResponse> => {
    const transformedData = transformFormData(data);
    const formData = new FormData();

    // Append all fields to FormData
    Object.entries(transformedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "profile_photo" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.post<EmployeeResponse>(
      "/employees",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Update employee
  updateEmployee: async (
    id: string,
    data: EmployeeFormData
  ): Promise<EmployeeResponse> => {
    const transformedData = transformFormData(data);
    const formData = new FormData();

    // Append all fields to FormData
    Object.entries(transformedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "profile_photo" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Add method override for PATCH request
    formData.append("_method", "PATCH");

    const response = await apiClient.post<EmployeeResponse>(
      `/employees/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/employees/${id}`
    );
    return response.data;
  },
};

export default employeeApi;
