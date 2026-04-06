# 👨‍💻 Developer Guide
## Sourcing Agent - For Contributors & Maintainers

---

## 🎯 Audience

This guide is for:
- CTO (maintaining codebase)
- Developers (adding features)
- QA (testing functionality)
- DevOps (deployment)

---

## 🏗️ ARCHITECTURE OVERVIEW

### System Design

```
User (Dashboard) → Main Agent (GLM-5) → Tools → Suppliers/Data
```

**Components:**
1. **Dashboard** - Streamlit UI for user interaction
2. **Agent** - GLM-5 Turbo with tool routing
3. **Tools** - Python scripts for specific tasks
4. **Data** - JSON/Markdown file storage
5. **Knowledge** - NotebookLM + terminology files

---

## 📂 File Structure Explained

### Core Files

**Agent Configuration:**
```
~/.openclaw/agents/sourcing-agent/
├── agent/
│   ├── config.json       # Agent settings (model, tools, permissions)
│   ├── SOUL.md           # Personality prompt (bilingual sourcing expert)
│   ├── IDENTITY.md       # Agent metadata (name, role, capabilities)
│   └── TOOLS.md          # Available tools and their functions
```

**Dashboard:**
```
~/.openclaw/workspace/sourcing-agent/dashboard/
├── dashboard.py          # Main Streamlit app
├── requirements.txt      # Python dependencies
├── DASHBOARD_SPEC.md     # Technical specification
└── README.md            # Setup instructions
```

**Data:**
```
~/.openclaw/workspace/sourcing-agent/
├── suppliers/            # JSON dossiers
│   ├── supplier_template.json
│   └── supplier_*.json
├── customers/            # Markdown job files
│   ├── job_template.md
│   └── job_*.md
├── drafts/               # RFQ drafts
│   └── rfq_*.md
└── knowledge/            # Terminology dictionaries
    ├── cnc_terminology.md
    ├── plastic_terms.md
    └── pcb_terms.md
```

**Tools:**
```
~/.openclaw/workspace/sourcing-agent/tools/
├── search_1688.py        # 1688.com scraper
├── verify_supplier.py    # Business license verification
├── generate_rfq.py       # RFQ draft generator
└── utils.py              # Helper functions
```

---

## 🔧 DEVELOPMENT SETUP

### Environment

**Python Version:** 3.10+  
**Package Manager:** pip  
**Optional:** Virtual environment (venv)

**Installation:**
```bash
# Create venv (optional)
python3 -m venv ~/.venv/sourcing-agent
source ~/.venv/sourcing-agent/bin/activate

# Install dependencies
pip install -r dashboard/requirements.txt

# Install additional dev tools
pip install black pytest pylint
```

### IDE Configuration

**VSCode:**
```json
{
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "python.analysis.typeCheckingMode": "basic"
}
```

**PyCharm:**
- Set interpreter to Python 3.10+
- Enable PEP 8 checking
- Configure pytest runner

---

## 📝 CODING STANDARDS

### Python Style Guide

**Follow:** PEP 8  
**Formatter:** Black  
**Linter:** Pylint  
**Line Length:** 100 characters

**Example:**
```python
"""
Sourcing agent tool for searching 1688.com.

This module provides functionality to search suppliers
on 1688.com platform and extract relevant information.
"""

import json
from pathlib import Path
from typing import List, Dict, Optional


def search_1688(
    keyword: str,
    location: str = "Dongguan",
    filters: Optional[Dict] = None,
) -> List[Dict]:
    """
    Search 1688.com for suppliers.
    
    Args:
        keyword: Search term (e.g., "CNC加工")
        location: City filter (default: "Dongguan")
        filters: Additional filters (certification, worker count, etc.)
    
    Returns:
        List of supplier dictionaries with name, rating, contact info
    
    Raises:
        ValueError: If keyword is empty
        ConnectionError: If API request fails
    """
    if not keyword:
        raise ValueError("Keyword cannot be empty")
    
    # Implementation here
    suppliers = []
    
    return suppliers


if __name__ == "__main__":
    # Test
    results = search_1688("CNC加工", "Dongguan")
    print(f"Found {len(results)} suppliers")
```

### Naming Conventions

**Files:** `snake_case.py`  
**Functions:** `snake_case()`  
**Classes:** `PascalCase`  
**Constants:** `UPPER_SNAKE_CASE`  
**Private:** `_leading_underscore`

### Documentation

**Docstrings:** Google style (as shown above)  
**Comments:** Explain WHY, not WHAT  
**README:** Update when adding features

---

## 🧪 TESTING

### Unit Tests

**Framework:** pytest  
**Location:** `tests/`  
**Naming:** `test_*.py`

**Example:**
```python
# tests/test_search_1688.py

import pytest
from tools.search_1688 import search_1688


def test_search_1688_basic():
    """Test basic 1688 search."""
    results = search_1688("CNC加工", "Dongguan")
    
    assert isinstance(results, list)
    assert len(results) > 0
    assert all("name" in r for r in results)


def test_search_1688_empty_keyword():
    """Test search with empty keyword."""
    with pytest.raises(ValueError):
        search_1688("")
```

**Run Tests:**
```bash
# All tests
pytest tests/

# Specific file
pytest tests/test_search_1688.py

# With coverage
pytest --cov=tools tests/
```

### Integration Tests

**End-to-End:**
```python
# tests/test_integration.py

def test_full_workflow():
    """Test complete sourcing workflow."""
    # 1. Submit request
    # 2. Agent analyzes
    # 3. Search suppliers
    # 4. Generate RFQ
    # 5. Verify output
    pass
```

### Manual Testing

**Dashboard:**
```bash
streamlit run dashboard/dashboard.py

# Test each page:
# - Submit request
# - View requests
# - Browse suppliers
# - Check analytics
```

**Agent:**
```bash
openclaw chat --agent sourcing-agent

# Test prompts:
# - "Find CNC suppliers in Dongguan"
# - "Analyze this drawing"
# - "Generate RFQ for..."
```

---

## 🔄 WORKFLOW

### Development Cycle

1. **Plan**
   - Read issue/requirement
   - Design solution
   - Estimate effort

2. **Develop**
   - Create feature branch
   - Write code
   - Write tests

3. **Test**
   - Run unit tests
   - Manual testing
   - Fix bugs

4. **Document**
   - Update README
   - Add docstrings
   - Record changelog

5. **Deploy**
   - Merge to main
   - Test in staging
   - Deploy to production

### Git Workflow

**Branching:**
```
main (production)
  └── develop (staging)
       └── feature/xxx (feature branch)
       └── bugfix/xxx (bug fix)
```

**Commands:**
```bash
# Create feature branch
git checkout -b feature/add-wechat-automation

# Commit changes
git add .
git commit -m "Add WeChat automation"

# Push
git push origin feature/add-wechat-automation

# Merge to develop
git checkout develop
git merge feature/add-wechat-automation
```

### Code Review

**Checklist:**
- [ ] Follows PEP 8
- [ ] Has docstrings
- [ ] Has tests
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No hardcoded values
- [ ] Error handling
- [ ] Logging added

---

## 🛠️ TOOLS DEVELOPMENT

### Creating New Tools

**Structure:**
```python
# tools/my_tool.py

import json
from pathlib import Path
from typing import Dict, List


def my_function(input_data: Dict) -> Dict:
    """
    Tool description.
    
    Args:
        input_data: Input parameters
    
    Returns:
        Result dictionary
    """
    # Implementation
    result = {}
    
    return result


if __name__ == "__main__":
    # Test
    test_input = {"param": "value"}
    output = my_function(test_input)
    print(json.dumps(output, indent=2))
```

**Register Tool:**
```bash
# Add to agent config
# ~/.openclaw/agents/sourcing-agent/agent/TOOLS.md

## My Tool

**Function:** `my_function`  
**Location:** `tools/my_tool.py`  
**Purpose:** Describe what it does  
**Input:** Input format  
**Output:** Output format
```

**Test Tool:**
```bash
python tools/my_tool.py
```

---

## 📊 DATA MODELS

### Supplier JSON Schema

```json
{
  "id": "supplier_001",
  "name": "Factory Name",
  "name_cn": "工厂名称",
  "name_en": "Factory Name",
  "location": {
    "city": "Dongguan",
    "district": "Changping",
    "address": "Full address",
    "coordinates": {
      "lat": 23.0207,
      "lng": 113.7518
    }
  },
  "specialties": ["CNC", "Aluminum"],
  "capabilities": {
    "cnc": true,
    "injection_molding": false,
    "materials": ["Aluminum 6061"],
    "max_part_size": "500mm x 500mm",
    "tolerance": "±0.05mm"
  },
  "certifications": ["ISO 9001:2015"],
  "verification": {
    "business_license": "License number",
    "license_verified": true,
    "factory_verified": true,
    "trading_company": false
  },
  "platforms": {
    "1688": {
      "url": "https://...",
      "chengthong": true,
      "rating": 4.5
    }
  },
  "contact": {
    "wechat": "WeChat ID",
    "email": "email@factory.com",
    "phone": "+86-XXX-XXXX-XXXX"
  },
  "pricing": {
    "currency": "USD",
    "moq": 100,
    "sample_cost": 50
  },
  "performance": {
    "on_time_delivery": 95,
    "quality_score": 4.3,
    "responsiveness": "fast"
  },
  "notes": "Additional observations",
  "last_updated": "2026-03-27",
  "status": "active"
}
```

### Customer Job Markdown Schema

See `customers/job_template.md`

---

## 🔌 INTEGRATION POINTS

### OpenClaw Framework

**Agent Config:**
```json
{
  "name": "sourcing-agent",
  "model": "zai/glm-5-turbo",
  "tools": ["vision", "web_search", "web_fetch"],
  "temperature": 0.7,
  "max_tokens": 4096
}
```

**Tool Calling:**
```python
# From agent prompt
tools.search_1688(keyword="CNC加工", location="Dongguan")
tools.vision.analyze(image="/path/to/drawing.png")
tools.translate.chinese_to_english(text="铝合金")
```

### NotebookLM

**Query:**
```bash
~/.local/bin/notebooklm ask "Find suppliers for CNC aluminum in Dongguan"
```

**Add Source:**
```bash
~/.local/bin/notebooklm source add knowledge/cnc_terminology.md
```

---

## 🚀 DEPLOYMENT

### Local Development

```bash
# Start dashboard
streamlit run dashboard/dashboard.py

# Access
http://localhost:8501
```

### Production (Future)

**Option 1: Streamlit Cloud**
1. Push code to GitHub
2. Connect to Streamlit Cloud
3. Deploy

**Option 2: Docker**
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["streamlit", "run", "dashboard/dashboard.py"]
```

**Option 3: Cloud Run**
```bash
gcloud run deploy source-agent --source .
```

---

## 📈 PERFORMANCE

### Benchmarks

**Dashboard:**
- Page load: < 2 seconds
- Form submission: < 3 seconds
- Data refresh: < 5 seconds

**Agent:**
- Drawing analysis: < 30 seconds
- Supplier search: < 2 minutes
- RFQ generation: < 1 minute

### Optimization

**Caching:**
```python
@st.cache_data(ttl=3600)
def load_suppliers():
    """Load and cache suppliers."""
    # Implementation
```

**Lazy Loading:**
```python
# Load data only when needed
if page == "Suppliers":
    suppliers = load_suppliers()
```

---

## 🐛 DEBUGGING

### Common Issues

**Import Error:**
```bash
# Check PYTHONPATH
echo $PYTHONPATH

# Install dependencies
pip install -r requirements.txt
```

**Permission Error:**
```bash
# Fix file permissions
chmod 644 suppliers/*.json
chmod 644 customers/*.md
```

**Module Not Found:**
```bash
# Add to PYTHONPATH
export PYTHONPATH="/home/e/.openclaw/workspace/sourcing-agent:$PYTHONPATH"
```

### Logging

**Enable Debug Logging:**
```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
```

---

## 📚 RESOURCES

### Documentation
- OpenClaw Docs: https://docs.openclaw.ai
- Streamlit Docs: https://docs.streamlit.io
- GLM-5 Docs: https://github.com/MoonlightGalex/GLM-5

### Community
- OpenClaw Discord
- Streamlit Community
- Python China

---

**Last Updated:** 2026-03-27  
**Maintainer:** CTO Agent  
**Version:** 1.0
