import axios from "axios";
import type { EmployeeFilters } from "../types/employee";
import type { EmployeeFormData } from "../schemas/employee";

const API_BASE_URL = "http://localhost:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Employee API endpoints
export const employeeService = {
  // Get all employees with filters
  getEmployees: async (
    filters: EmployeeFilters & { page?: number; per_page?: number }
  ) => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.department) params.append("department", filters.department);
    if (filters.position) params.append("position", filters.position);
    if (filters.sortBy) params.append("sort_by", filters.sortBy);
    if (filters.sortOrder) params.append("sort_direction", filters.sortOrder);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page)
      params.append("per_page", filters.per_page.toString());

    const response = await api.get(`/employees?${params}`);
    return response.data;
  },

  // Get single employee
  getEmployee: async (id: string) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create new employee
  createEmployee: async (data: EmployeeFormData) => {
    const formData = new FormData();

    // Append all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === "profile_photo" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post("/employees", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update employee
  updateEmployee: async (id: string, data: EmployeeFormData) => {
    const formData = new FormData();

    // Add method override for PUT request
    formData.append("_method", "PUT");

    // Append all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === "profile_photo" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post(`/employees/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  // Upload profile photo
  uploadProfilePhoto: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("profile_photo", file);

    const response = await api.post(`/employees/${id}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete profile photo
  deleteProfilePhoto: async (id: string) => {
    const response = await api.delete(`/employees/${id}/photo`);
    return response.data;
  },
};

export default api;
