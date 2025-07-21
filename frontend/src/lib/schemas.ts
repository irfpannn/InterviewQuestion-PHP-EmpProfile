import { z } from "zod";

export const employeeFormSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be less than 50 characters"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be less than 50 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits"),
    gender: z.enum(["male", "female", "other"], {
      message: "Gender is required",
    }),
    marital_status: z.enum(["single", "married", "divorced", "widowed"], {
      message: "Marital status is required",
    }),
    nationality: z.string().min(1, "Nationality is required"),
    department: z.string().min(1, "Department is required"),
    position: z
      .string()
      .min(1, "Position is required")
      .max(100, "Position must be less than 100 characters"),
    salary: z.number().min(0, "Salary must be greater than or equal to 0"),
    hire_date: z.string().min(1, "Hire date is required"),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    address: z
      .string()
      .min(1, "Address is required")
      .max(255, "Address must be less than 255 characters"),
    emergency_contact_name: z.string().optional(),
    emergency_contact_phone: z.string().optional(),
    profile_photo: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      if (data.hire_date && data.date_of_birth) {
        return new Date(data.hire_date) > new Date(data.date_of_birth);
      }
      return true;
    },
    {
      message: "Hire date must be after date of birth",
      path: ["hire_date"],
    }
  );

export const employeeFilterSchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  sortBy: z.enum(["first_name", "last_name", "email", "created_at"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export type EmployeeFilterData = z.infer<typeof employeeFilterSchema>;
