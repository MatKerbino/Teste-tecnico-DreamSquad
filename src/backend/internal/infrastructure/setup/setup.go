package setup

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Config struct {
	TableName     string
	BillingBucket string
	BackupBucket  string
	DBEndpoint    string
	S3Endpoint    string
}

type Manager struct {
	cfg      *Config
	dbClient *dynamodb.Client
	s3Client *s3.Client
}

func NewManager(cfg *Config, awsCfg aws.Config) *Manager {
	dbClient := dynamodb.NewFromConfig(awsCfg, func(o *dynamodb.Options) {
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

	return &Manager{
		cfg:      cfg,
		dbClient: dbClient,
		s3Client: s3Client,
	}
}

func (m *Manager) SetupDynamoDB(ctx context.Context) error {
	tableName := m.cfg.TableName
	fmt.Printf("Checking table %s...\n", tableName)

	_, err := m.dbClient.DescribeTable(ctx, &dynamodb.DescribeTableInput{
		TableName: aws.String(tableName),
	})
	if err == nil {
		fmt.Printf("Table %s already exists\n", tableName)
		return nil
	}

	fmt.Printf("Creating table %s...\n", tableName)
	_, err = m.dbClient.CreateTable(ctx, &dynamodb.CreateTableInput{
		TableName: aws.String(tableName),
		AttributeDefinitions: []types.AttributeDefinition{
			{AttributeName: aws.String("PK"), AttributeType: types.ScalarAttributeTypeS},
			{AttributeName: aws.String("SK"), AttributeType: types.ScalarAttributeTypeS},
			{AttributeName: aws.String("GSI1PK"), AttributeType: types.ScalarAttributeTypeS},
			{AttributeName: aws.String("GSI1SK"), AttributeType: types.ScalarAttributeTypeS},
			{AttributeName: aws.String("GSI2PK"), AttributeType: types.ScalarAttributeTypeS},
			{AttributeName: aws.String("GSI2SK"), AttributeType: types.ScalarAttributeTypeS},
		},
		KeySchema: []types.KeySchemaElement{
			{AttributeName: aws.String("PK"), KeyType: types.KeyTypeHash},
			{AttributeName: aws.String("SK"), KeyType: types.KeyTypeRange},
		},
		GlobalSecondaryIndexes: []types.GlobalSecondaryIndex{
			{
				IndexName: aws.String("EmailIndex"),
				KeySchema: []types.KeySchemaElement{
					{AttributeName: aws.String("GSI1PK"), KeyType: types.KeyTypeHash},
					{AttributeName: aws.String("GSI1SK"), KeyType: types.KeyTypeRange},
				},
				Projection: &types.Projection{
					ProjectionType: types.ProjectionTypeAll,
				},
				ProvisionedThroughput: &types.ProvisionedThroughput{
					ReadCapacityUnits:  aws.Int64(5),
					WriteCapacityUnits: aws.Int64(5),
				},
			},
			{
				IndexName: aws.String("BillingIndex"),
				KeySchema: []types.KeySchemaElement{
					{AttributeName: aws.String("GSI2PK"), KeyType: types.KeyTypeHash},
					{AttributeName: aws.String("GSI2SK"), KeyType: types.KeyTypeRange},
				},
				Projection: &types.Projection{
					ProjectionType: types.ProjectionTypeAll,
				},
				ProvisionedThroughput: &types.ProvisionedThroughput{
					ReadCapacityUnits:  aws.Int64(5),
					WriteCapacityUnits: aws.Int64(5),
				},
			},
		},
		ProvisionedThroughput: &types.ProvisionedThroughput{
			ReadCapacityUnits:  aws.Int64(5),
			WriteCapacityUnits: aws.Int64(5),
		},
	})

	if err != nil {
		return fmt.Errorf("failed to create table: %w", err)
	}

	fmt.Println("Table created successfully")
	return nil
}

func (m *Manager) SetupS3(ctx context.Context) error {
	buckets := []string{m.cfg.BillingBucket, m.cfg.BackupBucket}
	for _, b := range buckets {
		if b == "" {
			continue
		}
		fmt.Printf("Checking bucket %s...\n", b)
		_, err := m.s3Client.HeadBucket(ctx, &s3.HeadBucketInput{
			Bucket: aws.String(b),
		})
		if err == nil {
			fmt.Printf("Bucket %s already exists\n", b)
			continue
		}

		fmt.Printf("Creating bucket %s...\n", b)
		_, err = m.s3Client.CreateBucket(ctx, &s3.CreateBucketInput{
			Bucket: aws.String(b),
		})
		if err != nil {
			log.Printf("Warning: failed to create bucket %s: %v", b, err)
		} else {
			fmt.Printf("Bucket %s created successfully\n", b)
		}
	}
	return nil
}
