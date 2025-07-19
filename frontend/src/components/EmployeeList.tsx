import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  Grid3X3,
  List,
  Loader2,
} from "lucide-react";
import { useEmployee } from "../contexts/EmployeeContext";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { DEPARTMENTS } from "../constants";
import { useDebounce } from "use-debounce";

const EmployeeList: React.FC = () => {
  const {
    employees,
    loading,
    error,
    totalPages,
    currentPage,
    filters,
    setFilters,
    setCurrentPage,
    deleteEmployee,
    isDeleting,
  } = useEmployee();

  const { success: showSuccess, error: showError } = toast;
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [isGridView, setIsGridView] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    // Show searching state when search term changes
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  React.useEffect(() => {
    setFilters({ ...filters, search: debouncedSearchTerm });
    setIsSearching(false);
  }, [debouncedSearchTerm, setFilters]);

  const handleSortChange = (sortBy: string) => {
    const newOrder =
      filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters({ ...filters, sortBy: sortBy as any, sortOrder: newOrder });
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      showError("Cannot delete employee: Invalid ID");
      return;
    }

    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      await deleteEmployee(id);
      showSuccess("Employee deleted successfully");
      setDeleteConfirm(null);
    } catch (error) {
      showError("Failed to delete employee");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDepartmentLabel = (department: string) => {
    const dept = DEPARTMENTS.find((d) => d.value === department);
    return dept ? dept.label : department;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee List</h1>
          <p className="text-gray-600">Manage your organization's employees</p>
        </div>
        <Link to="/employees/add">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={filters.department}
                onValueChange={(value) => {
                  setFilters({ ...filters, department: value });
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
              >
                <SelectTrigger>
                  <span className="flex-1 text-left">
                    {filters.department
                      ? DEPARTMENTS.find(
                          (dept) => dept.value === filters.department
                        )?.label
                      : "All Departments"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isGridView ? "outline" : "default"}
                size="sm"
                onClick={() => setIsGridView(false)}
              >
                <List className="h-4 w-4 mr-2" />
                Table
              </Button>
              <Button
                variant={isGridView ? "default" : "outline"}
                size="sm"
                onClick={() => setIsGridView(true)}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="relative">
        {/* Grid View */}
        {isGridView ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton cards
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={`loading-${index}`} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : employees.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-12">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No employees found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {filters.search || filters.department
                        ? "Try adjusting your search filters."
                        : "Get started by adding your first employee."}
                    </p>
                    <Link to="/employees/add">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Employee
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ) : (
              employees.map((employee) => (
                <Card
                  key={employee.id}
                  className="hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {employee.profilePhotoUrl ? (
                          <img
                            src={employee.profilePhotoUrl}
                            alt={employee.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {employee.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {employee.jobTitle}
                          </p>
                        </div>
                      </div>
                      <Badge department={employee.department}>
                        {getDepartmentLabel(employee.department)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {employee.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {employee.phoneNo}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Joined {formatDate(employee.hireDate)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-green-600">
                        MYR {employee.salary.toLocaleString()}
                      </span>
                      <div className="flex space-x-2">
                        <Link to={`/employees/${employee.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                          disabled={isDeleting}
                          className={cn(
                            deleteConfirm === employee.id &&
                              "bg-red-50 border-red-200 text-red-700"
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          /* Table View */
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSortChange("name")}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>Employee</span>
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSortChange("salary")}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>Salary</span>
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hire Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      // Loading skeleton rows
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={`loading-${index}`} className="animate-pulse">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                              <div className="ml-4">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex space-x-2 justify-end">
                              <div className="h-8 w-8 bg-gray-200 rounded"></div>
                              <div className="h-8 w-8 bg-gray-200 rounded"></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No employees found
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {filters.search || filters.department
                              ? "Try adjusting your search filters."
                              : "Get started by adding your first employee."}
                          </p>
                          <Link to="/employees/add">
                            <Button>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Employee
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      employees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {employee.profilePhotoUrl ? (
                                <img
                                  src={employee.profilePhotoUrl}
                                  alt={employee.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {employee.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {employee.jobTitle}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {employee.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.phoneNo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge department={employee.department}>
                              {getDepartmentLabel(employee.department)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            MYR {employee.salary.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(employee.hireDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <Link to={`/employees/${employee.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(employee.id)}
                              disabled={isDeleting}
                              className={cn(
                                deleteConfirm === employee.id &&
                                  "bg-red-50 border-red-200 text-red-700"
                              )}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
