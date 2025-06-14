# Security Intent Co-Pilot Makefile
# Author: Suneet Dungrani

.PHONY: help build run test clean install dev

help:
	@echo "Security Intent Co-Pilot - Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make build    - Build Docker containers"
	@echo "  make run      - Run the application"
	@echo "  make test     - Run tests"
	@echo "  make dev      - Run in development mode"
	@echo "  make clean    - Clean build artifacts"

install:
	cd vscode-extension && npm install
	cd backend && pip install -r requirements.txt

build:
	docker-compose build

run:
	docker-compose up

dev:
	docker-compose up --build

test:
	cd backend && python -m pytest
	cd vscode-extension && npm test

clean:
	docker-compose down
	rm -rf vscode-extension/out
	rm -rf vscode-extension/node_modules
	rm -rf backend/__pycache__
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +