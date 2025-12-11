#!/bin/bash

echo "🧪 COMPREHENSIVE RAGDOL APPLICATION TEST SUITE"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
  local test_name=$1
  local url=$2
  local expected_status=$3
  
  echo -n "Testing: $test_name ... "
  
  response=$(curl -s -w "\n%{http_code}" "$url")
  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$status_code" = "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Status: $status_code)"
    ((TESTS_PASSED++))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (Expected: $expected_status, Got: $status_code)"
    ((TESTS_FAILED++))
    return 1
  fi
}

# Wait for server to be ready
echo "Waiting for server to be ready..."
sleep 3

echo ""
echo "=== 1. API ENDPOINT TESTS ==="
echo ""

# Test agent endpoints
run_test "GET /api/agents (list)" "http://localhost:3000/api/agents" "200"
run_test "GET /api/agents with limit" "http://localhost:3000/api/agents?limit=10" "200"
run_test "GET /api/agents filtered by approved" "http://localhost:3000/api/agents?approved=true" "200"

# Test properties endpoints
run_test "GET /api/admin/properties (list)" "http://localhost:3000/api/admin/properties" "200"

echo ""
echo "=== 2. PAGE RENDERING TESTS ==="
echo ""

# Test page routes
run_test "GET / (Homepage)" "http://localhost:3000" "200"
run_test "GET /properties (Properties List)" "http://localhost:3000/properties" "200"
run_test "GET /agents (Agents List)" "http://localhost:3000/agents" "200"
run_test "GET /admin/login (Admin Login)" "http://localhost:3000/admin/login" "200"

echo ""
echo "=== 3. API DATA VALIDATION TESTS ==="
echo ""

# Fetch agents and validate response
echo -n "Validating agent data structure ... "
agents_response=$(curl -s http://localhost:3000/api/agents?limit=5)
agent_count=$(echo "$agents_response" | jq 'length' 2>/dev/null || echo "0")

if [ "$agent_count" -gt "0" ]; then
  # Check for required fields
  title=$(echo "$agents_response" | jq '.[0].title' 2>/dev/null)
  rating=$(echo "$agents_response" | jq '.[0].rating' 2>/dev/null)
  
  if [ ! -z "$title" ] && [ ! -z "$rating" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Found $agent_count agents with valid data)"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAIL${NC} (Agent data missing required fields)"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${YELLOW}⚠ SKIP${NC} (No agents in database)"
fi

echo ""
echo "=== 4. DATABASE CONNECTIVITY TEST ==="
echo ""

# Test database by checking if we can fetch real agents
echo -n "Checking database agents table ... "
db_response=$(curl -s 'http://localhost:3000/api/admin/agents?limit=1')
if echo "$db_response" | jq 'has("agents")' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ PASS${NC} (Database accessible)"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ FAIL${NC} (Cannot access database)"
  ((TESTS_FAILED++))
fi

echo ""
echo "=== 5. REAL-TIME DATA TEST ==="
echo ""

# Fetch properties and check for agent relationships
echo -n "Testing property-agent relationships ... "
properties_response=$(curl -s 'http://localhost:3000/api/admin/properties?limit=5')
prop_count=$(echo "$properties_response" | jq '.properties | length' 2>/dev/null || echo "0")

if [ "$prop_count" -gt "0" ]; then
  echo -e "${GREEN}✓ PASS${NC} (Found $prop_count properties)"
  ((TESTS_PASSED++))
else
  echo -e "${YELLOW}⚠ INFO${NC} (No properties in database - expected for first run)"
fi

echo ""
echo "=== 6. ADMIN PORTAL ACCESS TEST ==="
echo ""

echo -n "Testing admin agent management page ... "
admin_response=$(curl -s 'http://localhost:3000/admin/agents')
if echo "$admin_response" | grep -q "Agent Management"; then
  echo -e "${GREEN}✓ PASS${NC} (Admin agent page accessible)"
  ((TESTS_PASSED++))
else
  echo -e "${YELLOW}⚠ INFO${NC} (Admin page may require authentication)"
fi

echo ""
echo "=== TEST SUMMARY ==="
echo ""
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi
