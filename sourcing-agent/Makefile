# Sourcing Agent Makefile
# Convenient shortcuts for common tasks

.PHONY: help dashboard test clean monitor stats backup

help:
	@echo "Sourcing Agent - Available Commands"
	@echo ""
	@echo "  make dashboard    - Start Streamlit dashboard"
	@echo "  make test         - Run tests"
	@echo "  make clean        - Clean up old files"
	@echo "  make monitor      - Health check"
	@echo "  make stats        - Show statistics"
	@echo "  make backup       - Backup data"
	@echo "  make install      - Install dependencies"

dashboard:
	@echo "Starting dashboard..."
	@cd dashboard && streamlit run dashboard.py --server.port 8501

test:
	@echo "Running tests..."
	@pytest tests/ -v

clean:
	@echo "Cleaning up..."
	@find . -type f -name "*.pyc" -delete
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find drafts -name "rfq_*.md" -mtime +7 -delete 2>/dev/null || true
	@echo "Cleanup complete"

monitor:
	@echo "Running health check..."
	@bash scripts/monitor.sh

stats:
	@echo "Statistics:"
	@echo "  Jobs: $$(ls -1 customers/job_*.md 2>/dev/null | wc -l)"
	@echo "  Suppliers: $$(ls -1 suppliers/supplier_*.json 2>/dev/null | wc -l)"
	@echo "  Drafts: $$(ls -1 drafts/rfq_*.md 2>/dev/null | wc -l)"

backup:
	@echo "Creating backup..."
	@tar -czf ../sourcing-agent-backup-$$(date +%Y%m%d_%H%M%S).tar.gz \
		suppliers customers drafts knowledge
	@echo "Backup complete"

install:
	@echo "Installing dependencies..."
	@pip install -r dashboard/requirements.txt
	@echo "Installation complete"

init:
	@echo "Initializing project..."
	@mkdir -p suppliers customers drafts knowledge tools tests
	@touch suppliers/.gitkeep customers/.gitkeep drafts/.gitkeep
	@echo "Initialization complete"
