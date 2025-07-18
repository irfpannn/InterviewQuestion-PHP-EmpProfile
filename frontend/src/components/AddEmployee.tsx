import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useEmployee } from "../contexts/EmployeeContext";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import EmployeeForm from "./EmployeeForm.tsx";
import type { EmployeeFormData } from "../lib/schemas";

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const { addEmployee, isCreating } = useEmployee();

  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      await addEmployee(data);
      toast.success("Employee created successfully");
      navigate("/employees");
    } catch (error: any) {
      toast.error("Failed to create employee: " + error.message);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Employee
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Fill in the details to create a new employee record
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
            onSubmit={handleSubmit}
            isLoading={isCreating}
            submitLabel="Create Employee"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEmployee;
