import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  TrendingUp,
  DollarSign,
  Calendar,
  Building,
  Award,
  Clock,
  BarChart3,
  Activity,
  Target,
  ArrowUp,
  ArrowDown,
  Search,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Briefcase,
  MapPin,
  User,
  Heart,
  Globe,
  CreditCard,
} from "lucide-react";
import { useEmployee } from "../contexts/EmployeeContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Chart } from "./ui/chart";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { DEPARTMENTS } from "../constants";
import type { Employee } from "../types/employee";

const Dashboard: React.FC = () => {
  const { employees, loading } = useEmployee();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter employees based on search and department for the employees tab
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        !selectedDepartment || emp.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, selectedDepartment]);

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Use all employees (the API should already filter out deleted ones)
    const activeEmployees = employees;

    const totalEmployees = activeEmployees.length;
    const newEmployeesThisMonth = activeEmployees.filter(
      (emp) => new Date(emp.hireDate) >= thisMonth
    ).length;
    const newEmployeesLastMonth = activeEmployees.filter((emp) => {
      const hireDate = new Date(emp.hireDate);
      return hireDate >= lastMonth && hireDate < thisMonth;
    }).length;

    const averageSalary =
      activeEmployees.reduce((sum, emp) => sum + emp.salary, 0) /
        totalEmployees || 0;
    const totalPayroll = activeEmployees.reduce(
      (sum, emp) => sum + emp.salary,
      0
    );

    const departmentCounts = DEPARTMENTS.map((dept) => ({
      label: dept.label,
      value: activeEmployees.filter((emp) => emp.department === dept.value)
        .length,
    })).filter((dept) => dept.value > 0); // Only show departments with employees

    const salaryRanges = [
      { range: "< MYR 5K", min: 0, max: 5000 },
      { range: "MYR 5K - MYR 10K", min: 5000, max: 10000 },
      { range: "MYR 10K - MYR 25K", min: 10000, max: 25000 },
      { range: "MYR 25K - MYR 50K", min: 25000, max: 50000 },
      { range: "MYR 50K - MYR 75K", min: 50000, max: 75000 },
      { range: "> MYR 75K", min: 75000, max: Infinity },
    ];

    const salaryDistribution = salaryRanges
      .map((range) => ({
        label: range.range,
        value: activeEmployees.filter(
          (emp) => emp.salary >= range.min && emp.salary < range.max
        ).length,
      }))
      .filter((range) => range.value > 0); // Only show ranges with employees

    const recentHires = activeEmployees
      .filter(
        (emp) =>
          new Date(emp.hireDate) >=
          new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      )
      .sort(
        (a, b) =>
          new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime()
      )
      .slice(0, 5);

    const topEarners = activeEmployees
      .sort((a, b) => b.salary - a.salary)
      .slice(0, 5);

    const employeeGrowth = newEmployeesThisMonth - newEmployeesLastMonth;
    const growthPercentage =
      newEmployeesLastMonth > 0
        ? (employeeGrowth / newEmployeesLastMonth) * 100
        : newEmployeesThisMonth > 0
        ? 100
        : 0;

    // Calculate average tenure
    const totalTenure = activeEmployees.reduce((sum, emp) => {
      const hireDate = new Date(emp.hireDate);
      const tenureInDays = Math.floor(
        (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + tenureInDays;
    }, 0);
    const averageTenureInDays = totalTenure / totalEmployees || 0;
    const averageTenureInYears = (averageTenureInDays / 365).toFixed(1);

    // Calculate hiring goals progress based on actual department counts
    const hiringGoals = DEPARTMENTS.map((dept) => {
      const currentCount = activeEmployees.filter(
        (emp) => emp.department === dept.value
      ).length;
      const targetCount = Math.max(currentCount + 2, 5); // Set target as current + 2 or minimum 5
      return {
        department: dept.label,
        current: currentCount,
        target: targetCount,
        progress: targetCount > 0 ? (currentCount / targetCount) * 100 : 0,
      };
    }).filter((goal) => goal.current > 0); // Only show departments with employees

    return {
      totalEmployees,
      newEmployeesThisMonth,
      newEmployeesLastMonth,
      averageSalary,
      totalPayroll,
      departmentCounts,
      salaryDistribution,
      recentHires,
      topEarners,
      employeeGrowth,
      growthPercentage,
      averageTenureInYears,
      hiringGoals,
    };
  }, [employees]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProfilePhotoUrl = (employee: any) => {
    if (!employee.profilePhoto) return null;
    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    const baseUrl = API_BASE_URL.replace("/api", "");
    return `${baseUrl}/storage/${employee.profilePhoto}`;
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your team.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics.totalEmployees}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {dashboardMetrics.employeeGrowth > 0 ? "+" : ""}
              {dashboardMetrics.employeeGrowth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Hires</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics.newEmployeesThisMonth}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              {dashboardMetrics.growthPercentage > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(dashboardMetrics.growthPercentage).toFixed(1)}% from
              last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Salary
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardMetrics.averageSalary)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardMetrics.totalPayroll)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Monthly cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Department Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={dashboardMetrics.departmentCounts}
                  type="doughnut"
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Salary Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Salary Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={dashboardMetrics.salaryDistribution}
                  type="bar"
                  height={250}
                />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Hires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Hires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardMetrics.recentHires.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        {getProfilePhotoUrl(employee) ? (
                          <img
                            src={getProfilePhotoUrl(employee)!}
                            alt={employee.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.jobTitle}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(employee.hireDate)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {
                            DEPARTMENTS.find(
                              (d) => d.value === employee.department
                            )?.label
                          }
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Earners */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Earners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardMetrics.topEarners.map((employee, index) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
                          {index + 1}
                        </div>
                        {getProfilePhotoUrl(employee) ? (
                          <img
                            src={getProfilePhotoUrl(employee)!}
                            alt={employee.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.jobTitle}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(employee.salary)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {
                            DEPARTMENTS.find(
                              (d) => d.value === employee.department
                            )?.label
                          }
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Department Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardMetrics.hiringGoals.slice(0, 3).map((goal) => (
                    <div key={goal.department}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{goal.department}</span>
                        <span>
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  ))}
                  {dashboardMetrics.hiringGoals.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No departments with employees yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Team Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {dashboardMetrics.growthPercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Monthly growth rate
                  </div>
                  <Progress
                    value={Math.min(
                      Math.abs(dashboardMetrics.growthPercentage),
                      100
                    )}
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    {dashboardMetrics.newEmployeesThisMonth} new hires this
                    month
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Team Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Employees</span>
                    <Badge variant="secondary">
                      {dashboardMetrics.totalEmployees}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New This Month</span>
                    <Badge variant="secondary">
                      {dashboardMetrics.newEmployeesThisMonth}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Tenure</span>
                    <Badge variant="secondary">
                      {dashboardMetrics.averageTenureInYears} years
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Departments</span>
                    <Badge variant="secondary">
                      {dashboardMetrics.departmentCounts.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
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
            <Link to="/employees/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.slice(0, 9).map((employee) => (
              <Card
                key={employee.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {getProfilePhotoUrl(employee) ? (
                      <img
                        src={getProfilePhotoUrl(employee)!}
                        alt={employee.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.jobTitle}
                      </div>
                    </div>
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
                      <Briefcase className="h-4 w-4 mr-2" />
                      {
                        DEPARTMENTS.find((d) => d.value === employee.department)
                          ?.label
                      }
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-green-600">
                      {formatCurrency(employee.salary)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEmployee(employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Link to={`/employees/${employee.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No employees found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedDepartment
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first employee."}
              </p>
              <Link to="/employees/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </Link>
            </div>
          )}

          {filteredEmployees.length > 0 && (
            <div className="text-center">
              <Link to="/employees">
                <Button variant="outline">
                  View All Employees ({employees.length})
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Employees</span>
                    <span className="font-semibold">
                      {dashboardMetrics.totalEmployees}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Tenure</span>
                    <span className="font-semibold">
                      {dashboardMetrics.averageTenureInYears} years
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Departments</span>
                    <span className="font-semibold">
                      {dashboardMetrics.departmentCounts.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Hires (Month)</span>
                    <span className="font-semibold">
                      {dashboardMetrics.newEmployeesThisMonth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Payroll</span>
                    <span className="font-semibold">
                      {formatCurrency(dashboardMetrics.totalPayroll)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Employee Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogClose onClick={handleCloseModal} />
          </DialogHeader>

          {selectedEmployee && (
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                {getProfilePhotoUrl(selectedEmployee) ? (
                  <img
                    src={getProfilePhotoUrl(selectedEmployee)!}
                    alt={selectedEmployee.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-gray-600">{selectedEmployee.jobTitle}</p>
                  <Badge variant="secondary" className="mt-1">
                    {
                      DEPARTMENTS.find(
                        (d) => d.value === selectedEmployee.department
                      )?.label
                    }
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">
                          {selectedEmployee.phoneNo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">
                          {selectedEmployee.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-medium capitalize">
                          {selectedEmployee.gender}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Marital Status</p>
                        <p className="font-medium capitalize">
                          {selectedEmployee.maritalStatus}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Nationality</p>
                        <p className="font-medium capitalize">
                          {selectedEmployee.nationality}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium">
                          {formatDate(selectedEmployee.dateOfBirth)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Employment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">
                        {
                          DEPARTMENTS.find(
                            (d) => d.value === selectedEmployee.department
                          )?.label
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(selectedEmployee.salary)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Hire Date</p>
                      <p className="font-medium">
                        {formatDate(selectedEmployee.hireDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {(selectedEmployee.emergencyContactName ||
                selectedEmployee.emergencyContactPhone) && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedEmployee.emergencyContactName && (
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">
                          {selectedEmployee.emergencyContactName}
                        </p>
                      </div>
                    )}
                    {selectedEmployee.emergencyContactPhone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">
                          {selectedEmployee.emergencyContactPhone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
