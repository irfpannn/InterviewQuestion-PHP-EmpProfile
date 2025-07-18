// Test script to verify data transformation
const testFormData = {
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  phone: "1234567890",
  department: "engineering",
  position: "Software Engineer",
  salary: 75000,
  hire_date: "2024-01-15",
  date_of_birth: "1990-05-20",
  address: "123 Main St, City, State",
  profile_photo: null,
};

// Helper function to transform form data to API format
const transformFormData = (formData) => ({
  // Send first_name and last_name separately so the backend can handle them
  first_name: formData.first_name,
  last_name: formData.last_name,
  gender: "male",
  maritalStatus: "single",
  phone: formData.phone, // Send as 'phone' to match backend expectations
  email: formData.email,
  address: formData.address,
  date_of_birth: formData.date_of_birth, // Send as 'date_of_birth' to match backend expectations
  nationality: "american",
  hire_date: formData.hire_date, // Send as 'hire_date' to match backend expectations
  department: formData.department,
  emergencyContactName: "N/A",
  emergencyContactPhone: "N/A",
  jobTitle: formData.position,
  salary: formData.salary,
  profilePhoto: formData.profile_photo,
});

console.log("Original Form Data:");
console.log(JSON.stringify(testFormData, null, 2));
console.log("\nTransformed API Data:");
console.log(JSON.stringify(transformFormData(testFormData), null, 2));

// Test what the backend Employee model would do with this data
const mockBackendProcessing = (data) => {
  const result = {
    id: "test-id",
    // Handle name field - combine first_name and last_name if provided
    name:
      data.first_name && data.last_name
        ? `${data.first_name} ${data.last_name}`.trim()
        : data.name || "",
    gender: data.gender || "other",
    maritalStatus: data.maritalStatus || "single",
    // Handle phone field - support both phone and phoneNo
    phoneNo: data.phone || data.phoneNo || "",
    email: data.email || "",
    address: data.address || "",
    // Handle date fields - support both formats
    dateOfBirth: data.date_of_birth || data.dateOfBirth || "",
    hireDate: data.hire_date || data.hireDate || "",
    nationality: data.nationality || "American",
    department: data.department || "",
    emergencyContactName: data.emergencyContactName || "",
    emergencyContactPhone: data.emergencyContactPhone || "",
    // Handle job title field - support both position and jobTitle
    jobTitle: data.position || data.jobTitle || "",
    // Handle salary field - convert string to float
    salary: data.salary ? parseFloat(data.salary) : 0.0,
    profilePhoto: data.profile_photo || data.profilePhoto || null,
  };

  return result;
};

console.log("\nMocked Backend Processing Result:");
console.log(
  JSON.stringify(
    mockBackendProcessing(transformFormData(testFormData)),
    null,
    2
  )
);
