export interface Employee {
  id: string;
  name: string;
  gender: "male" | "female" | "other";
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  phoneNo: string;
  email: string;
  address: string;
  dateOfBirth: string;
  nationality: string;
  hireDate: string;
  department:
    | "hr"
    | "engineering"
    | "marketing"
    | "sales"
    | "finance"
    | "operations";
  emergencyContactName: string;
  emergencyContactPhone: string;
  jobTitle: string;
  salary: number;
  profilePhoto?: string;
  profilePhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeListResponse {
  data: {
    data: Employee[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
  };
}

export interface EmployeeResponse {
  data: Employee;
  message?: string;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: Record<string, string[]>;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  position?: string;
  sortBy?: "name" | "email" | "hireDate" | "salary";
  sortOrder?: "asc" | "desc";
  page?: number;
  per_page?: number;
  sort_by?: "name" | "email" | "hireDate" | "salary";
  sort_direction?: "asc" | "desc";
}

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hire_date: string;
  date_of_birth: string;
  address: string;
  profile_photo?: File;
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownOptions {
  genders: DropdownOption[];
  maritalStatuses: DropdownOption[];
  departments: DropdownOption[];
  nationalities: DropdownOption[];
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}
