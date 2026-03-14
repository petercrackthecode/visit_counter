.PHONY: dev start backend frontend stop clean help

# Default target
dev: start

# Start both backend and frontend concurrently
start:
	@echo "Starting visit counter application..."
	@echo "Backend will run on http://localhost:5000"
	@echo "Frontend will run on http://localhost:3000 (or next available port)"
	@echo ""
	$(MAKE) backend & $(MAKE) frontend

# Start only backend
backend:
	$(MAKE) -C backend run-local

# Start only frontend (assumes backend is already running)
frontend:
	cd web && yarn install && yarn dev

# Stop services
stop:
	$(MAKE) -C backend stop

# Clean up environment
clean:
	$(MAKE) -C backend clean

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make dev     - Start both backend and frontend"
	@echo "  make start   - Same as 'make dev'"
	@echo "  make backend - Start only backend"
	@echo "  make frontend- Start only frontend"
	@echo "  make setup   - Install all dependencies"
	@echo "  make stop    - Stop services"
	@echo "  make clean   - Clean up environment"
	@echo "  make help    - Show this help message"