package dynamodb

import (
	"context"
	"fmt"

	"billing-manager-backend/internal/domain"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func (r *DynamoRepository) GetUserByEmail(ctx context.Context, email string) (*domain.User, error) {
	out, err := r.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              &r.tableName,
		IndexName:              aws.String("EmailIndex"),
		KeyConditionExpression: aws.String("GSI1PK = :email"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":email": &types.AttributeValueMemberS{Value: email},
		},
		Limit: aws.Int32(1),
	})
	if err != nil {
		return nil, err
	}
	if len(out.Items) == 0 {
		return nil, fmt.Errorf("user not found")
	}

	var item struct {
		PK           string `dynamodbav:"PK"`
		SK           string `dynamodbav:"SK"`
		Name         string `dynamodbav:"name"`
		Email        string `dynamodbav:"email"`
		PasswordHash string `dynamodbav:"password_hash"`
		Role         string `dynamodbav:"role"`
	}
	if err := attributevalue.UnmarshalMap(out.Items[0], &item); err != nil {
		return nil, err
	}

	// PK = "COMPANY#<id>", SK = "USER#<userid>"
	companyID := item.PK[len("COMPANY#"):]
	userID := item.SK[len("USER#"):]

	return &domain.User{
		ID:           userID,
		CompanyID:    companyID,
		Name:         item.Name,
		Email:        item.Email,
		PasswordHash: item.PasswordHash,
		Role:         domain.Role(item.Role),
	}, nil
}

func (r *DynamoRepository) CreateUser(ctx context.Context, u domain.User) error {
	item, err := attributevalue.MarshalMap(map[string]interface{}{
		"PK":            "COMPANY#" + u.CompanyID,
		"SK":            "USER#" + u.ID,
		"GSI1PK":        u.Email,
		"GSI1SK":        "USER#" + u.ID,
		"name":          u.Name,
		"email":         u.Email,
		"password_hash": u.PasswordHash,
		"role":          string(u.Role),
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
func (r *DynamoRepository) DeleteUser(ctx context.Context, email string) error {
	u, err := r.GetUserByEmail(ctx, email)
	if err != nil {
		return err
	}

	_, err = r.client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + u.CompanyID},
			"SK": &types.AttributeValueMemberS{Value: "USER#" + u.ID},
		},
	})
	return err
}
