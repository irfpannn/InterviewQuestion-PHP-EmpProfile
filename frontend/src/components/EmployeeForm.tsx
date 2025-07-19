import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, User, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { cn } from "../lib/utils";
import { employeeFormSchema } from "../lib/schemas";
import {
  DEPARTMENTS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  NATIONALITY_OPTIONS,
} from "../constants/index";
import type { EmployeeFormData } from "../lib/schemas";
import type { Employee } from "../types/employee";

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

// Date Picker Component
interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Update selected date when value changes
  useEffect(() => {
    setSelectedDate(value ? new Date(value) : undefined);
  }, [value]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onChange(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !selectedDate && "text-muted-foreground",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {selectedDate ? (
          selectedDate.toLocaleDateString()
        ) : (
          <span>{placeholder}</span>
        )}
      </Button>
      {isOpen && (
        <div className="absolute z-50 mt-1 rounded-md border bg-popover p-0 shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            captionLayout="dropdown"
            initialFocus
            className="rounded-lg border shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Save Employee",
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.profilePhotoUrl || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData
      ? {
          first_name: initialData.name.split(" ")[0] || "",
          last_name: initialData.name.split(" ").slice(1).join(" ") || "",
          email: initialData.email,
          phone: initialData.phoneNo,
          gender: initialData.gender.toLowerCase() as
            | "male"
            | "female"
            | "other",
          marital_status: initialData.maritalStatus.toLowerCase() as
            | "single"
            | "married"
            | "divorced"
            | "widowed",
          nationality: initialData.nationality.toLowerCase(),
          department: initialData.department,
          position: initialData.jobTitle,
          salary: initialData.salary,
          hire_date: initialData.hireDate.split("T")[0], // Convert to YYYY-MM-DD format
          date_of_birth: initialData.dateOfBirth.split("T")[0], // Convert to YYYY-MM-DD format
          address: initialData.address,
          emergency_contact_name: initialData.emergencyContactName || "",
          emergency_contact_phone: initialData.emergencyContactPhone || "",
        }
      : {
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          gender: "male" as const,
          marital_status: "single" as const,
          nationality: "",
          department: "",
          position: "",
          salary: 0,
          hire_date: "",
          date_of_birth: "",
          address: "",
          emergency_contact_name: "",
          emergency_contact_phone: "",
        },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profile_photo", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoRemove = () => {
    setPhotoPreview(null);
    setValue("profile_photo", undefined);
  };

  const onFormSubmit = async (data: EmployeeFormData) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        reset();
        setPhotoPreview(null);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Profile Photo */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              {photoPreview && (
                <button
                  type="button"
                  onClick={handlePhotoRemove}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="profile_photo">Profile Photo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="profile_photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("profile_photo")?.click()
                  }
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Photo</span>
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 2MB
              </p>
              {errors.profile_photo && (
                <p className="text-sm text-red-500">
                  {errors.profile_photo.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register("first_name")}
                className={cn(errors.first_name && "border-red-500")}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register("last_name")}
                className={cn(errors.last_name && "border-red-500")}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={cn(errors.email && "border-red-500")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className={cn(errors.phone && "border-red-500")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={watch("gender")}
                onValueChange={(value) =>
                  setValue("gender", value as "male" | "female" | "other")
                }
              >
                <SelectTrigger
                  className={cn(errors.gender && "border-red-500")}
                >
                  <span className="flex-1 text-left">
                    {watch("gender")
                      ? GENDER_OPTIONS.find(
                          (option) => option.value === watch("gender")
                        )?.label
                      : "Select Gender"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="marital_status">Marital Status *</Label>
              <Select
                value={watch("marital_status")}
                onValueChange={(value) =>
                  setValue(
                    "marital_status",
                    value as "single" | "married" | "divorced" | "widowed"
                  )
                }
              >
                <SelectTrigger
                  className={cn(errors.marital_status && "border-red-500")}
                >
                  <span className="flex-1 text-left">
                    {watch("marital_status")
                      ? MARITAL_STATUS_OPTIONS.find(
                          (option) => option.value === watch("marital_status")
                        )?.label
                      : "Select Marital Status"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {MARITAL_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.marital_status && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.marital_status.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="nationality">Nationality *</Label>
              <Select
                value={watch("nationality")}
                onValueChange={(value) => setValue("nationality", value)}
              >
                <SelectTrigger
                  className={cn(errors.nationality && "border-red-500")}
                >
                  <span className="flex-1 text-left">
                    {watch("nationality")
                      ? NATIONALITY_OPTIONS.find(
                          (option) => option.value === watch("nationality")
                        )?.label
                      : "Select Nationality"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {NATIONALITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nationality && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.nationality.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <DatePicker
                value={watch("date_of_birth")}
                onChange={(date) => setValue("date_of_birth", date)}
                placeholder="Select date of birth"
                className={cn(errors.date_of_birth && "border-red-500")}
              />
              {errors.date_of_birth && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.date_of_birth.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                {...register("address")}
                className={cn(errors.address && "border-red-500")}
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employment Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select
                value={watch("department")}
                onValueChange={(value) => setValue("department", value)}
              >
                <SelectTrigger
                  className={cn(errors.department && "border-red-500")}
                >
                  <span className="flex-1 text-left">
                    {watch("department")
                      ? DEPARTMENTS.find(
                          (dept) => dept.value === watch("department")
                        )?.label
                      : "Select Department"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                {...register("position")}
                className={cn(errors.position && "border-red-500")}
              />
              {errors.position && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.position.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="salary">Salary *</Label>
              <Input
                id="salary"
                type="number"
                min="0"
                step="0.01"
                {...register("salary", { valueAsNumber: true })}
                className={cn(errors.salary && "border-red-500")}
              />
              {errors.salary && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.salary.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="hire_date">Hire Date *</Label>
              <DatePicker
                value={watch("hire_date")}
                onChange={(date) => setValue("hire_date", date)}
                placeholder="Select hire date"
                className={cn(errors.hire_date && "border-red-500")}
              />
              {errors.hire_date && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.hire_date.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Emergency Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emergency_contact_name">
                Emergency Contact Name
              </Label>
              <Input
                id="emergency_contact_name"
                {...register("emergency_contact_name")}
                className={cn(
                  errors.emergency_contact_name && "border-red-500"
                )}
                placeholder="Enter emergency contact name"
              />
              {errors.emergency_contact_name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.emergency_contact_name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="emergency_contact_phone">
                Emergency Contact Phone
              </Label>
              <Input
                id="emergency_contact_phone"
                type="tel"
                {...register("emergency_contact_phone")}
                className={cn(
                  errors.emergency_contact_phone && "border-red-500"
                )}
                placeholder="Enter emergency contact phone"
              />
              {errors.emergency_contact_phone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.emergency_contact_phone.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
