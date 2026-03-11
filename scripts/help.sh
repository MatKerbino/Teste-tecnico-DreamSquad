#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

MAKEFILE_LIST=${1:-Makefile}

info "Comandos disponíveis:"
grep -E '^[a-zA-Z_-]+:.*?## .*$' "$MAKEFILE_LIST" | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $1, $2}'
