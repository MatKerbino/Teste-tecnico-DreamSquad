package dynamodb

import (
	"billing-manager-backend/internal/domain"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type DynamoRepository struct {
	client    *dynamodb.Client
	tableName string
}

func NewDynamoRepository(client *dynamodb.Client, tableName string) *DynamoRepository {
	return &DynamoRepository{client: client, tableName: tableName}
}

var (
	_ domain.CompanyRepository      = (*DynamoRepository)(nil)
	_ domain.UserRepository         = (*DynamoRepository)(nil)
	_ domain.CustomerRepository     = (*DynamoRepository)(nil)
	_ domain.SubscriptionRepository = (*DynamoRepository)(nil)
	_ domain.InvoiceRepository      = (*DynamoRepository)(nil)
)
