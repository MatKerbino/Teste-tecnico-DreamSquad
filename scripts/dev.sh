#!/bin/bash
set -e

echo "Starting development environment..."

docker compose up -d localstack

echo "Waiting for Localstack to be healthy..."
MAX_RETRIES=30
COUNT=0
until [ "$(docker inspect -f '{{.State.Health.Status}}' billing-manager-aws)" == "healthy" ]; do
    sleep 1
    COUNT=$((COUNT + 1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "Localstack failed to become healthy in time."
        exit 1
    fi
done

echo "Localstack is ready!"

echo "Setting up database and buckets..."
docker compose run --build --rm setup-db

echo "Seeding initial data..."
docker compose run --build --rm seed

echo "Starting backend and frontend..."
docker compose up -d backend frontend

echo ""
echo "Environment is up!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo "Para parar tudo, use: make dev-down"
