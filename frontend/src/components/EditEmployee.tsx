import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useEmployee } from "../contexts/EmployeeContext";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import EmployeeForm from "./EmployeeForm.tsx";
import { employeeApi } from "../services/employeeApi";
import type { Employee } from "../types/employee";
import type { EmployeeFormData } from "../lib/schemas";

const EditEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateEmployee, isUpdating } = useEmployee();
  const { success: showSuccess, error: showError } = toast;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) {
        setError("Employee ID is required");
        setLoading(false);
        return;
      }

      try {
        const response = await employeeApi.getEmployee(id);
        setEmployee(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleSubmit = async (data: EmployeeFormData) => {
    if (!id) return;

    try {
      await updateEmployee(id, data);
      showSuccess("Employee updated successfully");
      navigate("/employees");
    } catch (error: any) {
      showError("Failed to update employee", error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          Error: {error || "Employee not found"}
        </div>
        <Button onClick={() => navigate("/employees")}>Back to List</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/employees")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to List</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update {employee.name}'s information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <span>Employee Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeForm
            initialData={employee}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            submitLabel="Update Employee"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEmployee;
