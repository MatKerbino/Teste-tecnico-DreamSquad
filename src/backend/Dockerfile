# ─── Build stage ─────────────────────────────────────────────
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the API server
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o /api ./cmd/api/

# Build the seed binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o /seed ./seed/

# ─── Final stage ─────────────────────────────────────────────
# Using distroless instead of scratch to allow 'docker run ... /seed'
# without a shell, while keeping the image minimal (~10MB).
FROM gcr.io/distroless/static-debian12

COPY --from=builder /api  /api
COPY --from=builder /seed /seed

EXPOSE 8080
ENTRYPOINT ["/api"]
