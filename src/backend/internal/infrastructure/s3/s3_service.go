package s3

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	"billing-manager-backend/internal/domain"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Service struct {
	client        *s3.Client
	billingBucket string
	backupBucket  string
	region        string
}

func NewS3Service(client *s3.Client, billingBucket, backupBucket, region string) *S3Service {
	return &S3Service{
		client:        client,
		billingBucket: billingBucket,
		backupBucket:  backupBucket,
		region:        region,
	}
}

func (s *S3Service) UploadBillingReport(ctx context.Context, timestamp time.Time, companyID string, content []byte) (string, error) {
	prefix := "billing"
	if companyID == "" {
		companyID = "global"
	}
	key := fmt.Sprintf("%s/%s/%s.csv", prefix, companyID, timestamp.UTC().Format(time.RFC3339))
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      &s.billingBucket,
		Key:         &key,
		Body:        bytes.NewReader(content),
		ContentType: aws.String("text/csv"),
	})
	if err != nil {
		return "", err
	}
	return key, nil
}

func (s *S3Service) UploadBackup(ctx context.Context, timestamp time.Time, companyID string, content []byte) (string, error) {
	prefix := "backup"
	if companyID == "" {
		companyID = "global"
	}
	key := fmt.Sprintf("%s/%s/%s-backup.json", prefix, companyID, timestamp.UTC().Format(time.RFC3339))
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      &s.backupBucket,
		Key:         &key,
		Body:        bytes.NewReader(content),
		ContentType: aws.String("application/json"),
	})
	if err != nil {
		return "", err
	}
	return key, nil
}

func (s *S3Service) ListBillingReports(ctx context.Context, companyID string) ([]domain.Report, error) {
	prefix := "billing"
	if companyID != "" {
		prefix = fmt.Sprintf("billing/%s", companyID)
	}
	return s.listObjects(ctx, s.billingBucket, prefix)
}

func (s *S3Service) ListBackupReports(ctx context.Context, companyID string) ([]domain.Report, error) {
	prefix := "backup"
	if companyID != "" {
		prefix = fmt.Sprintf("backup/%s", companyID)
	}
	return s.listObjects(ctx, s.backupBucket, prefix)
}

func (s *S3Service) listObjects(ctx context.Context, bucket, prefix string) ([]domain.Report, error) {
	input := &s3.ListObjectsV2Input{
		Bucket: &bucket,
	}
	if prefix != "" {
		input.Prefix = &prefix
	}

	out, err := s.client.ListObjectsV2(ctx, input)
	if err != nil {
		return nil, err
	}

	results := make([]domain.Report, 0, len(out.Contents))
	for _, obj := range out.Contents {
		results = append(results, domain.Report{
			Key:          aws.ToString(obj.Key),
			FileName:     getFileName(aws.ToString(obj.Key)),
			Size:         *obj.Size,
			LastModified: *obj.LastModified,
			Bucket:       bucket,
		})
	}
	return results, nil
}

func (s *S3Service) GetReport(ctx context.Context, bucket, key string) ([]byte, error) {
	out, err := s.client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: &bucket,
		Key:    &key,
	})
	if err != nil {
		return nil, err
	}
	defer out.Body.Close()
	return io.ReadAll(out.Body)
}

func getFileName(key string) string {
	parts := strings.Split(key, "/")
	return parts[len(parts)-1]
}
