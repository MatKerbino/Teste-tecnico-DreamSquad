package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"billing-manager-backend/internal/application"
	dreamdynamo "billing-manager-backend/internal/infrastructure/dynamodb"
	"billing-manager-backend/internal/infrastructure/handlers"
	dreams3 "billing-manager-backend/internal/infrastructure/s3"
)

type Config struct {
	TableName     string
	BillingBucket string
	BackupBucket  string
	AWSRegion     string
	Port          string
	DBEndpoint    string
	S3Endpoint    string
	JWTSecret     string
}

func loadConfig() *Config {
	return &Config{
		TableName:     getEnv("DYNAMODB_TABLE", "billing-manager_Data"),
		BillingBucket: getEnv("BILLING_BUCKET", ""),
		BackupBucket:  getEnv("BACKUP_BUCKET", ""),
		AWSRegion:     getEnv("AWS_REGION", "us-east-1"),
		Port:          getEnv("PORT", "8080"),
		DBEndpoint:    getEnv("DYNAMODB_ENDPOINT", ""),
		S3Endpoint:    getEnv("S3_ENDPOINT", ""),
		JWTSecret:     getEnv("JWT_SECRET", "billing-manager-secret-change-in-prod"),
	}
}

func main() {
	cfg := loadConfig()
	ctx := context.Background()

	awsCfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatalf("failed to load AWS config: %v", err)
	}

	// ─── Clients ──────────────────────────────────────────────────
	dynClient := dynamodb.NewFromConfig(awsCfg, func(o *dynamodb.Options) {
		if cfg.DBEndpoint != "" {
			o.BaseEndpoint = &cfg.DBEndpoint
		}
	})
	s3Client := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		if cfg.S3Endpoint != "" {
			o.BaseEndpoint = &cfg.S3Endpoint
			o.UsePathStyle = true
		}
	})

	// ─── Infrastructure ───────────────────────────────────────────
	repo := dreamdynamo.NewDynamoRepository(dynClient, cfg.TableName)
	store := dreams3.NewS3Service(s3Client, cfg.BillingBucket, cfg.BackupBucket, cfg.AWSRegion)

	// ─── Application Use Cases ────────────────────────────────────
	billingUC := application.NewBillingService(repo, repo, repo, store)
	userUC := application.NewUserService(repo, cfg.JWTSecret)
	customerUC := application.NewCustomerService(repo)
	subscriptionUC := application.NewSubscriptionService(repo)
	companyUC := application.NewCompanyService(repo)

	// ─── HTTP Handler ─────────────────────────────────────────────
	handler := handlers.NewHandler(
		repo,           // domain.CompanyRepository
		repo,           // domain.InvoiceRepository
		store,          // domain.StorageService
		billingUC,      // domain.BillingUseCase
		userUC,         // domain.UserUseCase
		customerUC,     // domain.CustomerUseCase
		subscriptionUC, // domain.SubscriptionUseCase
		companyUC,      // domain.CompanyUseCase
	)

	mux := http.NewServeMux()
	handler.RegisterRoutes(mux)

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.Port),
		Handler: handlers.CORSMiddleware(mux),
	}

	// ─── Server Run (goroutine) ───────────────────────────────────
	go func() {
		log.Printf("Billing Manager API running on :%s (table=%s)", cfg.Port, cfg.TableName)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// ─── Graceful Shutdown ────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
