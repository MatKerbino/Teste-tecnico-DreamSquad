package dynamodb

import (
	"context"
	"fmt"
	"time"

	"billing-manager-backend/internal/domain"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func (r *DynamoRepository) GetCompany(ctx context.Context, companyID string) (*domain.Company, error) {
	out, err := r.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
			"SK": &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
		},
	})
	if err != nil {
		return nil, err
	}
	if out.Item == nil {
		return nil, fmt.Errorf("company not found")
	}

	var item struct {
		Name      string    `dynamodbav:"name"`
		CNPJ      string    `dynamodbav:"cnpj"`
		CreatedAt time.Time `dynamodbav:"created_at"`
	}
	if err := attributevalue.UnmarshalMap(out.Item, &item); err != nil {
		return nil, err
	}
	return &domain.Company{ID: companyID, Name: item.Name, CNPJ: item.CNPJ, CreatedAt: item.CreatedAt}, nil
}

func (r *DynamoRepository) CreateCompany(ctx context.Context, c domain.Company) error {
	item, err := attributevalue.MarshalMap(map[string]interface{}{
		"PK":         "COMPANY#" + c.ID,
		"SK":         "COMPANY#" + c.ID,
		"name":       c.Name,
		"cnpj":       c.CNPJ,
		"created_at": c.CreatedAt,
	})
	if err != nil {
		return err
	}

	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &r.tableName,
		Item:      item,
	})
	return err
}

func (r *DynamoRepository) ListCompanies(ctx context.Context) ([]domain.Company, error) {
	out, err := r.client.Scan(ctx, &dynamodb.ScanInput{
		TableName:        &r.tableName,
		FilterExpression: aws.String("begins_with(PK, :prefix) AND PK = SK"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":prefix": &types.AttributeValueMemberS{Value: "COMPANY#"},
		},
	})
	if err != nil {
		return nil, err
	}

	companies := make([]domain.Company, 0, len(out.Items))
	for _, item := range out.Items {
		var row struct {
			PK        string    `dynamodbav:"PK"`
			Name      string    `dynamodbav:"name"`
			CNPJ      string    `dynamodbav:"cnpj"`
			CreatedAt time.Time `dynamodbav:"created_at"`
		}
		if err := attributevalue.UnmarshalMap(item, &row); err != nil {
			continue
		}
		companies = append(companies, domain.Company{
			ID:        row.PK[len("COMPANY#"):],
			Name:      row.Name,
			CNPJ:      row.CNPJ,
			CreatedAt: row.CreatedAt,
		})
	}
	return companies, nil
}
func (r *DynamoRepository) UpdateCompany(ctx context.Context, c domain.Company) error {
	_, err := r.client.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + c.ID},
			"SK": &types.AttributeValueMemberS{Value: "COMPANY#" + c.ID},
		},
		UpdateExpression: aws.String("SET #n = :name, cnpj = :cnpj"),
		ExpressionAttributeNames: map[string]string{
			"#n": "name", // 'name' is a reserved keyword in DynamoDB
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":name": &types.AttributeValueMemberS{Value: c.Name},
			":cnpj": &types.AttributeValueMemberS{Value: c.CNPJ},
		},
	})
	return err
}

func (r *DynamoRepository) DeleteCompany(ctx context.Context, companyID string) error {
	_, err := r.client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
			"SK": &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
		},
	})
	return err
}
