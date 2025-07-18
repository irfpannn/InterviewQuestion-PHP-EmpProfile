import { z } from "zod";

// Phone number validation regex
const phoneRegex = /^\d{10,15}$/;

// Employee schema for form validation
export const employeeSchema = z
  .object({
    name: z
      .string()
      .min(1, "Employee name is required")
      .max(255, "Name must not exceed 255 characters"),
    gender: z.enum(["male", "female", "other"], {
      message: "Gender must be one of: male, female, other",
    }),
    maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {
      message:
        "Marital status must be one of: single, married, divorced, widowed",
    }),
    phoneNo: z
      .string()
      .min(1, "Phone number is required")
      .regex(phoneRegex, "Phone number must be 10-15 digits"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please provide a valid email address")
      .max(255, "Email must not exceed 255 characters"),
    address: z
      .string()
      .min(1, "Address is required")
      .max(500, "Address must not exceed 500 characters"),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        return birthDate < today;
      }, "Date of birth must be before today"),
    nationality: z
      .string()
      .min(1, "Nationality is required")
      .max(100, "Nationality must not exceed 100 characters"),
    hireDate: z.string().min(1, "Hire date is required"),
    department: z.enum(
      ["hr", "engineering", "marketing", "sales", "finance", "operations"],
      {
        message:
          "Department must be one of: hr, engineering, marketing, sales, finance, operations",
      }
    ),
    emergencyContactName: z
      .string()
      .min(1, "Emergency contact name is required")
      .max(255, "Emergency contact name must not exceed 255 characters"),
    emergencyContactPhone: z
      .string()
      .min(1, "Emergency contact phone is required")
      .regex(phoneRegex, "Emergency contact phone must be 10-15 digits"),
    jobTitle: z
      .string()
      .min(1, "Job title is required")
      .max(255, "Job title must not exceed 255 characters"),
    salary: z.number().min(0, "Salary must be greater than or equal to 0"),
    profilePhoto: z
      .instanceof(File)
      .optional()
      .refine((file) => {
        if (!file) return true;
        return file.size <= 2 * 1024 * 1024; // 2MB
      }, "Profile photo must not exceed 2MB")
      .refine((file) => {
        if (!file) return true;
        return ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          file.type
        );
      }, "Profile photo must be a JPEG, PNG, JPG, or GIF file"),
  })
  .refine(
    (data) => {
      const birthDate = new Date(data.dateOfBirth);
      const hireDate = new Date(data.hireDate);
      return hireDate >= birthDate;
    },
    {
      message: "Hire date must be on or after date of birth",
      path: ["hireDate"],
    }
  );

// Update schema (partial fields)
export const updateEmployeeSchema = employeeSchema.partial();

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;
