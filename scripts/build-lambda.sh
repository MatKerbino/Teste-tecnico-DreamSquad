#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

LAMBDA_DIR=${1:-src/lambda}
USE_DOCKER=${2:-} 

ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
[[ "$LAMBDA_DIR" = /* ]] || LAMBDA_DIR="$ROOT_DIR/$LAMBDA_DIR"

info "Compilando Lambda em: $LAMBDA_DIR"

if [ "$USE_DOCKER" == "--docker" ]; then
    info "Modo: Docker (golang:1.22-alpine)"
    docker run --rm \
      -v "$LAMBDA_DIR:/src" \
      -w /src \
      golang:1.22-alpine \
      sh -c "GOARCH=amd64 CGO_ENABLED=0 go build -ldflags='-s -w' -o bootstrap . && \
             apk add --no-cache zip &>/dev/null && \
             zip lambda.zip bootstrap && rm bootstrap" \
      || error "Falha na compilação do Lambda via Docker."
else
    info "Modo: Local"
    cd "$LAMBDA_DIR"
    GOARCH=amd64 GOOS=linux CGO_ENABLED=0 go build -ldflags='-s -w' -o bootstrap . \
      || error "Falha no local go build."
    zip lambda.zip bootstrap >/dev/null \
      || error "Falha ao criar o arquivo zip."
    rm bootstrap
fi

success "lambda.zip gerado em $LAMBDA_DIR"

CRONJOB_DIR="$ROOT_DIR/modules/cronjob"
if [ -d "$CRONJOB_DIR" ]; then
    cp "$LAMBDA_DIR/lambda.zip" "$CRONJOB_DIR/lambda.zip"
    success "lambda.zip copiado para o módulo Terraform ($CRONJOB_DIR)"
fi
