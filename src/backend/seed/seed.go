package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	ctx := context.Background()
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatalf("AWS config: %v", err)
	}

	tableName := getEnv("DYNAMODB_TABLE", "billing-manager_Data")
	dbEndpoint := getEnv("DYNAMODB_ENDPOINT", "")

	client := dynamodb.NewFromConfig(cfg, func(o *dynamodb.Options) {
		if dbEndpoint != "" {
			o.BaseEndpoint = &dbEndpoint
		}
	})

	log.Printf("Waiting for table %s to be ready...", tableName)
	for i := 0; i < 30; i++ {
		_, err := client.DescribeTable(ctx, &dynamodb.DescribeTableInput{
			TableName: &tableName,
		})
		if err == nil {
			log.Println("Table is ready!")
			break
		}
		if i == 29 {
			log.Fatalf("Table %s not found after 30 attempts: %v", tableName, err)
		}
		time.Sleep(1 * time.Second)
	}

	now := time.Now().UTC()

	// ─── Company ─────────────────────────────────────────────
	companyID := "company-demo"
	companyItem, _ := attributevalue.MarshalMap(map[string]interface{}{
		"PK":         "COMPANY#" + companyID,
		"SK":         "COMPANY#" + companyID,
		"name":       "Billing Manager Demo",
		"cnpj":       "00.000.000/0001-00",
		"created_at": now,
	})
	if _, err := client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &tableName,
		Item:      companyItem,
	}); err != nil {
		log.Fatalf("seed company: %v", err)
	}
	fmt.Println("Company seeded")

	// ─── Admin User ───────────────────────────────────────────
	userID := "user-admin"
	email := "admin@billing.io"
	rawPassword := "Billing@2026"
	hash, err := bcrypt.GenerateFromPassword([]byte(rawPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("bcrypt: %v", err)
	}

	userItem, _ := attributevalue.MarshalMap(map[string]interface{}{
		"PK":            "COMPANY#" + companyID,
		"SK":            "USER#" + userID,
		"GSI1PK":        email, // EmailIndex
		"GSI1SK":        "USER#" + userID,
		"name":          "Admin",
		"email":         email,
		"password_hash": string(hash),
		"role":          "admin",
		"created_at":    now,
	})
	if _, err := client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &tableName,
		Item:      userItem,
	}); err != nil {
		log.Fatalf("seed user: %v", err)
	}
	fmt.Printf("Admin user seeded: %s / %s\n", email, rawPassword)

	// ─── Sample Subscription ──────────────────────────────────
	subID := "sub-demo-01"
	subItem, _ := attributevalue.MarshalMap(map[string]interface{}{
		"PK":                "COMPANY#" + companyID,
		"SK":                "SUBSCRIPTION#" + subID,
		"GSI2PK":            "STATUS#active",
		"GSI2SK":            fmt.Sprintf("DUEDAY#%02d#%s", now.Day(), subID),
		"target_company_id": companyID,
		"amount":            150.00,
		"due_day":           now.Day(),
		"active":            true,
		"created_at":        now,
	})
	if _, err := client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &tableName,
		Item:      subItem,
	}); err != nil {
		log.Printf("Warning: failed to seed subscription: %v", err)
	} else {
		fmt.Printf("Subscription seeded for today (day %d)\n", now.Day())
	}

	// ─── Sample Customer ──────────────────────────────────────
	custID := "cust-demo-01"
	custItem, _ := attributevalue.MarshalMap(map[string]interface{}{
		"PK":                 "COMPANY#" + companyID,
		"SK":                 "CUSTOMER#" + custID,
		"name":               "João Cliente",
		"email":              "joao@demo.com",
		"document":           "123.456.789-00",
		"related_company_id": companyID,
		"created_at":         now,
	})
	if _, err := client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &tableName,
		Item:      custItem,
	}); err != nil {
		log.Printf("Warning: failed to seed customer: %v", err)
	} else {
		fmt.Println("Customer seeded")
	}

	fmt.Println("\nSeed complete! You can now log in and test billing.")
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
