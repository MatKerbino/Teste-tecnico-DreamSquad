package main

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/config"

	"billing-manager-backend/internal/infrastructure"
	"billing-manager-backend/internal/infrastructure/setup"
)

func main() {
	ctx := context.Background()

	// ─── Config ───────────────────────────────────────────────────
	cfg := &setup.Config{
		TableName:     infrastructure.GetEnv("DYNAMODB_TABLE", "billing-manager_Data"),
		BillingBucket: infrastructure.GetEnv("BILLING_BUCKET", "billing-reports"),
		BackupBucket:  infrastructure.GetEnv("BACKUP_BUCKET", "database-backups"),
		DBEndpoint:    infrastructure.GetEnv("DYNAMODB_ENDPOINT", ""),
		S3Endpoint:    infrastructure.GetEnv("S3_ENDPOINT", ""),
	}

	awsCfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatalf("AWS config: %v", err)
	}

	// ─── Setup Manager ────────────────────────────────────────────
	manager := setup.NewManager(cfg, awsCfg)

	if err := manager.SetupDynamoDB(ctx); err != nil {
		log.Fatalf("Error setting up DynamoDB: %v", err)
	}

	if err := manager.SetupS3(ctx); err != nil {
		log.Fatalf("Error setting up S3: %v", err)
	}

	fmt.Println("Database and Storage setup completed!")
}
