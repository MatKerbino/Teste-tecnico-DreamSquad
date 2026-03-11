package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/lambda"
)

func handler(ctx context.Context) error {
	apiURL := os.Getenv("API_URL")
	cronSecret := os.Getenv("CRON_SECRET")

	if apiURL == "" || cronSecret == "" {
		return fmt.Errorf("API_URL and CRON_SECRET environment variables must be set")
	}

	log.Printf("Discharging billing routine at %s", apiURL)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, apiURL, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+cronSecret)

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to call API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API returned non-OK status: %s", resp.Status)
	}

	log.Println("Billing routine triggered successfully via Backend API")
	return nil
}

func main() {
	lambda.Start(handler)
}
