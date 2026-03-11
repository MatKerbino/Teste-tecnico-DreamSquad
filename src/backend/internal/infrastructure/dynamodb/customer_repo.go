package dynamodb

import (
	"context"
	"time"

	"billing-manager-backend/internal/domain"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func (r *DynamoRepository) ListCustomers(ctx context.Context, companyID string) ([]domain.Customer, error) {
	out, err := r.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              &r.tableName,
		KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk_prefix)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk":        &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
			":sk_prefix": &types.AttributeValueMemberS{Value: "CUSTOMER#"},
		},
	})
	if err != nil {
		return nil, err
	}

	customers := make([]domain.Customer, 0, len(out.Items))
	for _, item := range out.Items {
		var row struct {
			SK               string    `dynamodbav:"SK"`
			RelatedCompanyID string    `dynamodbav:"related_company_id"`
			Name             string    `dynamodbav:"name"`
			Email            string    `dynamodbav:"email"`
			Document         string    `dynamodbav:"document"`
			CreatedAt        time.Time `dynamodbav:"created_at"`
		}
		if err := attributevalue.UnmarshalMap(item, &row); err != nil {
			continue
		}
		customerID := row.SK[len("CUSTOMER#"):]
		customers = append(customers, domain.Customer{
			ID: customerID, CompanyID: companyID,
			RelatedCompanyID: row.RelatedCompanyID,
			Name:             row.Name, Email: row.Email, Document: row.Document, CreatedAt: row.CreatedAt,
		})
	}
	return customers, nil
}

func (r *DynamoRepository) CreateCustomer(ctx context.Context, c domain.Customer) error {
	item, err := attributevalue.MarshalMap(map[string]interface{}{
		"PK":                 "COMPANY#" + c.CompanyID,
		"SK":                 "CUSTOMER#" + c.ID,
		"related_company_id": c.RelatedCompanyID,
		"name":               c.Name,
		"email":              c.Email,
		"document":           c.Document,
		"created_at":         c.CreatedAt,
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

func (r *DynamoRepository) UpdateCustomer(ctx context.Context, c domain.Customer) error {
	_, err := r.client.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + c.CompanyID},
			"SK": &types.AttributeValueMemberS{Value: "CUSTOMER#" + c.ID},
		},
		UpdateExpression: aws.String("SET #n = :name, email = :email, document = :doc, related_company_id = :rcid"),
		ExpressionAttributeNames: map[string]string{
			"#n": "name",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":name":  &types.AttributeValueMemberS{Value: c.Name},
			":email": &types.AttributeValueMemberS{Value: c.Email},
			":doc":   &types.AttributeValueMemberS{Value: c.Document},
			":rcid":  &types.AttributeValueMemberS{Value: c.RelatedCompanyID},
		},
	})
	return err
}
func (r *DynamoRepository) DeleteCustomer(ctx context.Context, companyID, customerID string) error {
	_, err := r.client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
			"SK": &types.AttributeValueMemberS{Value: "CUSTOMER#" + customerID},
		},
	})
	return err
}
