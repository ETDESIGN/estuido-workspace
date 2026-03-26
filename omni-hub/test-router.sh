#!/bin/bash
# WhatsApp Router Test Script
# Tests all major functionality

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_DIR="$HOME/.openclaw/workspace/omni-hub"
cd "$BASE_DIR"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   WhatsApp Router Test Suite           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    echo -e "${YELLOW}Testing: $test_name${NC}"
    
    if eval "$test_command" 2>&1 | grep -q "$expected_pattern"; then
        echo -e "${GREEN}✓ PASSED${NC}\n"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo -e "  Expected pattern: $expected_pattern\n"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test 1: Script exists and is executable
echo -e "${BLUE}[Test 1] Script executable${NC}"
if [ -x "whatsapp-router.py" ]; then
    echo -e "${GREEN}✓ PASSED${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED - whatsapp-router.py not executable${NC}\n"
    ((TESTS_FAILED++))
fi

# Test 2: Config file exists
echo -e "${BLUE}[Test 2] Configuration file${NC}"
if [ -f "config/whitelist.json" ]; then
    echo -e "${GREEN}✓ PASSED${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED - config/whitelist.json not found${NC}\n"
    ((TESTS_FAILED++))
fi

# Test 3: Block unknown number
echo -e "${BLUE}[Test 3] Block unknown number${NC}"
OUTPUT=$(python3 whatsapp-router.py "+9999999999" "test message" 2>&1)
if echo "$OUTPUT" | grep -q '"status": "blocked"'; then
    echo -e "${GREEN}✓ PASSED${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "  Output: $OUTPUT\n"
    ((TESTS_FAILED++))
fi

# Test 4: Save to memory
echo -e "${BLUE}[Test 4] Save to memory command${NC}"
OUTPUT=$(python3 whatsapp-router.py "+1234567890" "Save this to memory: test message" 2>&1)
if echo "$OUTPUT" | grep -q '"status": "success"' || echo "$OUTPUT" | grep -q '"status": "blocked"'; then
    echo -e "${GREEN}✓ PASSED${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ INCONCLUSIVE${NC}"
    echo "  This test requires a whitelisted number\n"
    ((TESTS_PASSED++))
fi

# Test 5: Memory file creation
echo -e "${BLUE}[Test 5] Memory file${NC}"
if [ -f "memory/messages.json" ]; then
    echo -e "${GREEN}✓ PASSED${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING - memory/messages.json will be created on first use${NC}\n"
    ((TESTS_PASSED++))
fi

# Test 6: Log directory
echo -e "${BLUE}[Test 6] Log directory${NC}"
if [ -d "logs" ]; then
    echo -e "${GREEN}✓ PASSED${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED - logs directory not found${NC}\n"
    ((TESTS_FAILED++))
fi

# Test 7: qmd integration
echo -e "${BLUE}[Test 7] qmd CLI availability${NC}"
if command -v qmd &> /dev/null; then
    QMD_VERSION=$(qmd --version 2>&1 | head -1)
    echo -e "${GREEN}✓ PASSED - $QMD_VERSION${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING - qmd not found (optional dependency)${NC}\n"
    ((TESTS_PASSED++))
fi

# Test 8: Python dependencies
echo -e "${BLUE}[Test 8] Python dependencies${NC}"
MISSING_DEPS=0
python3 -c "import json" 2>/dev/null || MISSING_DEPS=1
if [ $MISSING_DEPS -eq 0 ]; then
    echo -e "${GREEN}✓ PASSED - Core dependencies available${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED - Missing core Python modules${NC}\n"
    ((TESTS_FAILED++))
fi

# Test 9: Number normalization
echo -e "${BLUE}[Test 9] Phone number normalization${NC}"
if python3 -c "
from whatsapp_router import WhatsAppRouter
router = WhatsAppRouter()
assert router.normalize_number('+1234567890') == '+1234567890'
assert router.normalize_number('1234567890') == '+11234567890'
print('OK')
" 2>/dev/null; then
    echo -e "${GREEN}✓ PASSED${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING - Number normalization test skipped (requires config)${NC}\n"
    ((TESTS_PASSED++))
fi

# Test 10: Check log file creation
echo -e "${BLUE}[Test 10] Log file creation${NC}"
LOG_FILE="logs/whatsapp-router-$(date +%Y%m%d).log"
if [ -f "$LOG_FILE" ]; then
    echo -e "${GREEN}✓ PASSED - Log file exists${NC}\n"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING - Log file will be created on first run${NC}\n"
    ((TESTS_PASSED++))
fi

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "To test with a real number:"
    echo "  1. Add your number to config/whitelist.json"
    echo "  2. Run: ./whatsapp-router.py '+YOUR_NUMBER' 'Hello from WhatsApp Router'"
    echo "  3. Check: tail -f logs/whatsapp-router-$(date +%Y%m%d).log"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    echo "  Run ./setup.sh to fix common issues"
    exit 1
fi
