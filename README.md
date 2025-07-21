# Employee Management System - MYWave

![Tests](https://img.shields.io/badge/tests-30%20passed-brightgreen)

A feature-complete Employee Management mini-app built with React 18, TypeScript, Laravel 11, and modern development practices.

## 🚀 Quick Start

```bash
# One-line setup and run
make all && make dev
```

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript (strict mode)
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/UI** for component library
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **Axios** for API calls

### Backend

- **Laravel 12** with PHP 8.3
- **Sanctum** for SPA authentication
- **Pest** for testing
- **Pint** for code formatting
- **JSON file storage** for employee data (no database required)
- **PSR-12** compliant code

## 📋 Features

### ✅ Employee Management

- **Add Employee Form** with comprehensive validation
- **List Employees** with pagination and search
- **Edit Employee** information
- **Delete Employee** with soft delete
- **Profile Photo Upload** with validation
- **Responsive Design** (desktop + mobile)

### ✅ Form Fields

- Employee Name, Gender, Marital Status
- Phone Number, Email, Address
- Date of Birth, Nationality, Hire Date
- Department, Job Title, Salary
- Emergency Contact (Name + Phone)
- Profile Photo (image upload, ≤2MB)

### ✅ Technical Features

- **Client-side validation** with Zod schemas
- **Server-side validation** with Laravel FormRequests
- **Debounced search** functionality
- **Pagination** with customizable page sizes
- **Loading states** and skeleton placeholders
- **Toast notifications** for user feedback
- **Mobile-first** responsive design
- **Sticky navigation header** with scroll animations
- **Department-specific styling** for badges and UI elements
- **Data visualization** with optimized chart components
- **Rate limiting** (60 requests/minute)
- **CORS** properly configured
- **RESTful API** with proper HTTP status codes

## 🎯 API Endpoints

```
GET    /api/employees           → List employees (paginated)
POST   /api/employees           → Create employee
GET    /api/employees/{id}      → Get employee details
PATCH  /api/employees/{id}      → Update employee
DELETE /api/employees/{id}      → Delete employee (soft delete)
```

## 🔧 Installation

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 18+
- npm

### Manual Installation

1. **Clone the repository**

```bash
git clone <repository-url>
```

2. **Backend Setup**

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan storage:link
# No database setup required for core app functionality
```

3. **Frontend Setup**

```bash
cd frontend
npm install
```

4. **Environment Configuration**
   Update `backend/.env`:

```env
APP_NAME="Employee Management"
APP_URL=http://localhost:8000
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
FRONTEND_URL=http://localhost:5173
```

## 🏃 Running the Application

### Development Mode

```bash
# Start both servers
make dev

# Or start individually
make backend-dev    # http://localhost:8000
make frontend-dev   # http://localhost:5173
```

### Production Mode

```bash
# Build frontend
cd frontend && npm run build

# Serve with Laravel
cd backend && php artisan serve --env=production
```

## 🧪 Testing

All 30 backend tests are passing, covering API endpoints, repository logic, and validation rules.

### Backend Tests

```bash
cd backend
php artisan test

# Or using make
make backend-test
```

### Test Coverage

- **Repository Pattern** - 100% coverage
- **API Endpoints** - All CRUD operations
- **Validation** - Client and server-side
- **File Upload** - Image validation
- **Error Handling** - Proper HTTP status codes

## 📁 Project Structure

```
employee-management/
├── backend/                    # Laravel 11 API
│   ├── app/
│   │   ├── Contracts/         # Repository interfaces
│   │   ├── Http/
│   │   │   ├── Controllers/   # API controllers
│   │   │   ├── Requests/      # Form request validation
│   │   │   └── Resources/     # API resources
│   │   ├── Models/           # Employee model
│   │   ├── Repositories/     # JSON repository implementation
│   │   ├── Rules/            # Custom validation rules
│   │   └── Services/         # Business logic
│   ├── routes/api.php        # API routes
│   ├── tests/                # Pest tests
│   └── storage/app/          # JSON file storage
├── frontend/                  # React 18 + TypeScript
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── ui/          # Shadcn/UI components
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── lib/             # Utility functions
│   │   └── constants/       # App constants
│   └── public/              # Static assets
└── Makefile                 # Development commands
```

## 🎨 Design System

### Color Palette

- **Primary**: Modern blue gradient (#0f172a to #1e293b)
- **Secondary**: Light gray (#f1f5f9)
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#eab308)
- **Department Colors**: Unique color coding for each department

### Typography

- **Font**: Gabarito
- **Headings**: Semibold, tracking tight
- **Body**: Regular, line-height 1.5
- **Badges**: Department-specific styling with consistent text contrast

### Components

- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Forms**: Consistent styling with validation states
- **Cards**: Subtle shadows and borders with consistent bottom alignment
- **Tables**: Responsive with hover states
- **Badges**: Customized by department with appropriate color contrast
- **Charts**: Interactive data visualization with optimized spacing
- **Header**: Sticky navigation with smooth scroll animations

## 🔒 Security Features

- **Rate Limiting**: 60 requests/minute on write operations
- **File Upload Security**: Type and size validation
- **CORS Configuration**: Proper domain restrictions
- **Input Sanitization**: All user inputs validated
- **Soft Deletes**: Data preservation with logical deletion

## 📱 Mobile Responsiveness

- **Breakpoints**: Mobile-first approach
- **Navigation**: Responsive sticky header with animated mobile menu
- **Tables**: Transform to cards on mobile
- **Forms**: Stack vertically on small screens
- **Employee Cards**: Responsive grid with consistent alignment
- **Charts**: Responsive visualizations that adapt to screen size
- **Touch-friendly**: Proper touch targets (44px minimum)
- **Smooth Animations**: Optimized for both desktop and mobile performance

## 📊 Performance

- **Lazy Loading**: Components loaded on demand
- **Debounced Search**: Reduces API calls
- **Optimized Images**: Proper sizing and formats
- **Caching**: Browser and server-side caching
- **Bundle Size**: Optimized with Vite

## 🧰 Development Tools

- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **TypeScript**: Strict mode enabled
- **Pint**: PHP code formatting
- **Pest**: PHP testing framework

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy dist/ directory
```

### Backend (Laravel Forge/DigitalOcean)

```bash
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🔗 API Documentation

### Postman Collection

Import the collection from `backend/tests/fixtures/Employee.postman_collection.json`

### Sample Requests

**Create Employee:**

```json
POST /api/employees
{
  "name": "John Doe",
  "gender": "male",
  "maritalStatus": "single",
  "phoneNo": "1234567890",
  "email": "john.doe@example.com",
  "address": "123 Main St, City, State 12345",
  "dateOfBirth": "1990-01-15",
  "nationality": "american",
  "hireDate": "2023-01-01",
  "department": "engineering",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "0987654321",
  "jobTitle": "Software Engineer",
  "salary": 75000.00
}
```

**Response:**

```json
{
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "department": "engineering",
    "profilePhotoUrl": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Employee created successfully"
}
```
