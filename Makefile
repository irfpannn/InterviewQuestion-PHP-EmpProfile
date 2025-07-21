# Employee Management System Makefile

.PHONY: install dev test clean backend-install frontend-install backend-dev frontend-dev backend-test

# Install all dependencies
install: backend-install frontend-install
	@echo "✅ All dependencies installed successfully!"

# Install backend dependencies
backend-install:
	@echo "📦 Installing backend dependencies..."
	cd backend && composer install --no-dev --optimize-autoloader
	cd backend && php artisan key:generate
	cd backend && php artisan storage:link
	cd backend && touch database/database.sqlite
	cd backend && php artisan migrate --force

# Install frontend dependencies
frontend-install:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install

# Start development servers
dev:
	@echo "🚀 Starting development servers..."
	@powershell -Command "Start-Process powershell -ArgumentList '-Command', 'cd backend; php artisan serve --host=localhost --port=8000' -WindowStyle Normal"
	@powershell -Command "Start-Process powershell -ArgumentList '-Command', 'cd frontend; npm run dev' -WindowStyle Normal"
	@echo "✅ Servers started!"
	@echo "🔗 Backend: http://localhost:8000"
	@echo "🔗 Frontend: http://localhost:5173"

# Start backend only
backend-dev:
	@echo "🚀 Starting backend server..."
	cd backend && php artisan serve --host=localhost --port=8000

# Start frontend only
frontend-dev:
	@echo "🚀 Starting frontend server..."
	cd frontend && npm run dev

# Run backend tests
backend-test:
	@echo "🧪 Running backend tests..."
	cd backend && php artisan test

# Run all tests
test: backend-test
	@echo "✅ All tests completed!"

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	cd backend && rm -rf vendor/ bootstrap/cache/*.php
	cd frontend && rm -rf node_modules/ dist/
	@echo "✅ Cleanup completed!"

# Setup environment
setup:
	@echo "⚙️  Setting up environment..."
	@powershell -Command "if (!(Test-Path 'backend\\.env')) { Copy-Item 'backend\\.env.example' 'backend\\.env' }"
	@echo "✅ Environment setup completed!"

# Full setup (install + setup)
all: setup install
	@echo "🎉 Employee Management System is ready!"
	@echo ""
	@echo "To start development servers, run:"
	@echo "  make dev"
	@echo ""
	@echo "To run tests, run:"
	@echo "  make test"
