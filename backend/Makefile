.PHONY: setup run run-local stop clean

# Default target
run-local: setup
	ENV=local REDIS_URL=redis://localhost:6379/ .venv/bin/python app.py

run: setup
	.venv/bin/python app.py

# Boot up Docker services and set up the Python environment
setup:
	docker compose -f docker-compose.yml up -d
	python -m venv .venv || true
	.venv/bin/pip install -r requirements.txt

# Stop Docker services
stop:
	docker-compose -f docker-compose.yml down

# Clean up  environment
clean: stop
	rm -rf .venv

# Install dependencies only
install:
	python -m venv .venv || true
	.venv/bin/pip install -r requirements.txt
