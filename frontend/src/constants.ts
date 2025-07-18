export const ITEMS_PER_PAGE = 10;

export const TOAST_DURATION = {
  SUCCESS: 5000,
  ERROR: 7000,
  WARNING: 6000,
  INFO: 4000,
} as const;

export const DEPARTMENTS = [
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "HR" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "design", label: "Design" },
  { value: "legal", label: "Legal" },
] as const;

export const EMPLOYEE_POSITIONS = [
  "Manager",
  "Senior Developer",
  "Developer",
  "Junior Developer",
  "Intern",
  "Team Lead",
  "Director",
  "VP",
  "CEO",
  "Designer",
  "Analyst",
  "Coordinator",
] as const;
