#!/bin/bash

# =============================================================================
# WebEngage React Native Plugin - Cross-Architecture Test Runner
# =============================================================================
# This script builds and validates the plugin across all 3 RN architectures:
#   1. Old Architecture (Legacy Bridge)
#   2. New Architecture + Bridge (TurboModules with Bridge)
#   3. New Architecture + Bridgeless (TurboModules without Bridge)
#
# Usage:
#   ./scripts/test-all-architectures.sh [android|ios|both] [old|new|bridgeless|all]
#
# Examples:
#   ./scripts/test-all-architectures.sh android all      # Test all archs on Android
#   ./scripts/test-all-architectures.sh ios bridgeless   # Test bridgeless on iOS
#   ./scripts/test-all-architectures.sh both all         # Test everything
# =============================================================================

set -e

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18 > /dev/null 2>&1 || true

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
LIB_DIR="$PROJECT_ROOT/../lib"

PLATFORM=${1:-"both"}
ARCH=${2:-"all"}

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
log_error() { echo -e "${RED}[FAIL]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_header() { echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"; echo -e "${BLUE} $1${NC}"; echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"; }

RESULTS=()

record_result() {
  local arch=$1
  local platform=$2
  local status=$3
  RESULTS+=("$platform|$arch|$status")
}

# =============================================================================
# Step 1: Run Unit Tests (lib layer)
# =============================================================================
run_unit_tests() {
  log_header "Running Unit Tests (lib/)"
  cd "$LIB_DIR"
  
  if npm test 2>&1; then
    log_success "Unit tests passed"
    record_result "unit" "js" "PASS"
  else
    log_error "Unit tests failed"
    record_result "unit" "js" "FAIL"
  fi
  
  cd "$PROJECT_ROOT"
}

# =============================================================================
# Step 2: Build validation per architecture
# =============================================================================
switch_architecture() {
  local arch=$1
  log_info "Switching to architecture: $arch"
  "$SCRIPT_DIR/switch-architecture.sh" "$arch"
}

build_android() {
  local arch=$1
  log_header "Building Android ($arch)"
  
  switch_architecture "$arch"
  
  cd "$PROJECT_ROOT/android"
  
  if ./gradlew clean assembleDebug 2>&1 | tail -5; then
    log_success "Android build ($arch) succeeded"
    record_result "$arch" "android" "PASS"
  else
    log_error "Android build ($arch) failed"
    record_result "$arch" "android" "FAIL"
  fi
  
  cd "$PROJECT_ROOT"
}

build_ios() {
  local arch=$1
  log_header "Building iOS ($arch)"
  
  switch_architecture "$arch"
  
  cd "$PROJECT_ROOT/ios"
  
  # Pod install
  log_info "Running pod install..."
  pod install --silent 2>/dev/null || pod install
  
  # Build
  if xcodebuild \
    -workspace SampleApp.xcworkspace \
    -scheme SampleApp \
    -configuration Debug \
    -sdk iphonesimulator \
    -destination 'platform=iOS Simulator,name=iPhone 16 Pro' \
    -quiet \
    build 2>&1 | tail -5; then
    log_success "iOS build ($arch) succeeded"
    record_result "$arch" "ios" "PASS"
  else
    log_error "iOS build ($arch) failed"
    record_result "$arch" "ios" "FAIL"
  fi
  
  cd "$PROJECT_ROOT"
}

# =============================================================================
# Step 3: Print Summary
# =============================================================================
print_summary() {
  log_header "Test Summary"
  
  printf "%-12s %-15s %-8s\n" "PLATFORM" "ARCHITECTURE" "STATUS"
  printf "%-12s %-15s %-8s\n" "--------" "------------" "------"
  
  local pass_count=0
  local fail_count=0
  
  for result in "${RESULTS[@]}"; do
    IFS='|' read -r platform arch status <<< "$result"
    
    if [ "$status" = "PASS" ]; then
      printf "${GREEN}%-12s %-15s %-8s${NC}\n" "$platform" "$arch" "$status"
      ((pass_count++))
    else
      printf "${RED}%-12s %-15s %-8s${NC}\n" "$platform" "$arch" "$status"
      ((fail_count++))
    fi
  done
  
  echo ""
  local total=$((pass_count + fail_count))
  echo -e "Total: $total | ${GREEN}Passed: $pass_count${NC} | ${RED}Failed: $fail_count${NC}"
  
  if [ $fail_count -gt 0 ]; then
    echo -e "\n${RED}❌ Some tests failed!${NC}"
    exit 1
  else
    echo -e "\n${GREEN}✅ All tests passed!${NC}"
    exit 0
  fi
}

# =============================================================================
# Main Execution
# =============================================================================
log_header "WebEngage RN Plugin - Cross-Architecture Test Runner"
log_info "Platform: $PLATFORM | Architecture: $ARCH"

# Always run unit tests first
run_unit_tests

# Determine which architectures to test
ARCHS_TO_TEST=()
case $ARCH in
  "all") ARCHS_TO_TEST=("old" "new" "bridgeless") ;;
  "old"|"new"|"bridgeless") ARCHS_TO_TEST=("$ARCH") ;;
  *) log_error "Invalid architecture: $ARCH. Use: old, new, bridgeless, all"; exit 1 ;;
esac

# Run builds
for arch in "${ARCHS_TO_TEST[@]}"; do
  case $PLATFORM in
    "android") build_android "$arch" ;;
    "ios") build_ios "$arch" ;;
    "both")
      build_android "$arch"
      build_ios "$arch"
      ;;
    *) log_error "Invalid platform: $PLATFORM. Use: android, ios, both"; exit 1 ;;
  esac
done

print_summary
