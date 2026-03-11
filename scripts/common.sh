#!/usr/bin/env bash
# =============================================================================
# Billing Manager — Common Utilities
# =============================================================================

# ─── Colors & Formatting ─────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

function info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
function success() { echo -e "${GREEN}[ OK ]${NC}  $*"; }
function warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
function error()   { echo -e "${RED}[ERR ]${NC}  $*" >&2; exit 1; }
function step()    { echo -e "\n${BOLD}${CYAN}━━━ $* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }
