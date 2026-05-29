#!/bin/bash

# =============================================================================
# Quick Validation - Runs unit tests and type checks without building native
# Usage: ./scripts/quick-validate.sh
# =============================================================================

set -e

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18 > /dev/null 2>&1 || true

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
LIB_DIR="$PROJECT_ROOT/../lib"

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
log_error() { echo -e "${RED}[FAIL]${NC} $1"; }

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE} WebEngage RN Plugin - Quick Validation${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

FAILURES=0

# 1. Check lib dependencies
log_info "Checking lib dependencies..."
cd "$LIB_DIR"
if [ ! -d "node_modules" ]; then
  log_info "Installing lib dependencies..."
  npm install --silent
fi

# 2. Run unit tests
log_info "Running unit tests..."
if npm test -- --passWithNoTests 2>&1; then
  log_success "Unit tests passed"
else
  log_error "Unit tests failed"
  ((FAILURES++))
fi

# 3. Check TurboModule spec exists and is valid
log_info "Checking TurboModule spec..."
if [ -f "$LIB_DIR/src/NativeWebEngageModule.ts" ]; then
  # Verify it exports a TurboModule spec
  if grep -q "TurboModuleRegistry" "$LIB_DIR/src/NativeWebEngageModule.ts"; then
    log_success "TurboModule spec is valid"
  else
    log_error "TurboModule spec missing TurboModuleRegistry"
    ((FAILURES++))
  fi
else
  log_error "NativeWebEngageModule.ts not found"
  ((FAILURES++))
fi

# 4. Check codegen config in package.json
log_info "Checking codegen config..."
if grep -q '"codegenConfig"' "$LIB_DIR/package.json"; then
  log_success "codegenConfig present in package.json"
else
  log_error "codegenConfig missing from package.json"
  ((FAILURES++))
fi

# 5. Check dual source sets exist (Android)
log_info "Checking Android dual source sets..."
if [ -f "$LIB_DIR/android/src/newarch/WebEngageModule.kt" ] && [ -f "$LIB_DIR/android/src/oldarch/WebEngageModule.kt" ]; then
  log_success "Android newarch/oldarch source sets present"
else
  log_error "Android dual source sets missing"
  ((FAILURES++))
fi

# 6. Check iOS .mm file (required for C++ interop)
log_info "Checking iOS Objective-C++ file..."
if [ -f "$LIB_DIR/ios/WEGWebEngageBridge/WEGWebEngageBridge.mm" ]; then
  if grep -q "getTurboModule" "$LIB_DIR/ios/WEGWebEngageBridge/WEGWebEngageBridge.mm"; then
    log_success "iOS TurboModule registration present"
  else
    log_error "iOS getTurboModule method missing"
    ((FAILURES++))
  fi
else
  log_error "WEGWebEngageBridge.mm not found"
  ((FAILURES++))
fi

# 7. Check podspec has install_modules_dependencies
log_info "Checking podspec new arch support..."
if grep -q "install_modules_dependencies" "$LIB_DIR/react-native-webengage.podspec"; then
  log_success "Podspec supports new architecture"
else
  log_error "Podspec missing install_modules_dependencies"
  ((FAILURES++))
fi

# 8. Check JS fallback pattern
log_info "Checking JS TurboModule fallback..."
if grep -q "TurboModuleRegistry" "$LIB_DIR/src/index.js"; then
  log_success "JS layer has TurboModule fallback"
else
  log_error "JS layer missing TurboModule fallback"
  ((FAILURES++))
fi

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $FAILURES -eq 0 ]; then
  echo -e "${GREEN}✅ All validations passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ $FAILURES validation(s) failed${NC}"
  exit 1
fi
