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

func (r *DynamoRepository) ListSubscriptions(ctx context.Context, companyID string) ([]domain.Subscription, error) {
	var out *dynamodb.ScanOutput
	var qOut *dynamodb.QueryOutput
	var err error

	if companyID == "" {
		out, err = r.client.Scan(ctx, &dynamodb.ScanInput{
			TableName:        &r.tableName,
			FilterExpression: aws.String("begins_with(SK, :sk_prefix)"),
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":sk_prefix": &types.AttributeValueMemberS{Value: "SUBSCRIPTION#"},
			},
		})
	} else {
		qOut, err = r.client.Query(ctx, &dynamodb.QueryInput{
			TableName:              &r.tableName,
			KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk_prefix)"),
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":pk":        &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
				":sk_prefix": &types.AttributeValueMemberS{Value: "SUBSCRIPTION#"},
			},
		})
	}
	if err != nil {
		return nil, err
	}

	var items []map[string]types.AttributeValue
	if companyID == "" {
		items = out.Items
	} else {
		items = qOut.Items
	}

	subs := make([]domain.Subscription, 0, len(items))
	for _, item := range items {
		var row struct {
			PK              string    `dynamodbav:"PK"`
			SK              string    `dynamodbav:"SK"`
			TargetCompanyID string    `dynamodbav:"target_company_id"`
			Amount          float64   `dynamodbav:"amount"`
			DueDay          int       `dynamodbav:"due_day"`
			Active          bool      `dynamodbav:"active"`
			CreatedAt       time.Time `dynamodbav:"created_at"`
		}
		if err := attributevalue.UnmarshalMap(item, &row); err != nil {
			continue
		}
		subs = append(subs, domain.Subscription{
			ID:              row.SK[len("SUBSCRIPTION#"):],
			TargetCompanyID: row.TargetCompanyID,
			CompanyID:       row.PK[len("COMPANY#"):],
			Amount:          row.Amount,
			DueDay:          row.DueDay,
			Active:          row.Active,
			CreatedAt:       row.CreatedAt,
		})
	}
	return subs, nil
}

func (r *DynamoRepository) CreateSubscription(ctx context.Context, s domain.Subscription) (*domain.Subscription, error) {
	item, err := attributevalue.MarshalMap(map[string]interface{}{
		"PK":                "COMPANY#" + s.CompanyID,
		"SK":                "SUBSCRIPTION#" + s.ID,
		"GSI2PK":            "STATUS#active",
		"GSI2SK":            fmt.Sprintf("DUEDAY#%02d#%s", s.DueDay, s.ID),
		"target_company_id": s.TargetCompanyID,
		"amount":            s.Amount,
		"due_day":           s.DueDay,
		"active":            s.Active,
		"created_at":        s.CreatedAt,
	})
	if err != nil {
		return nil, err
	}
	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &r.tableName,
		Item:      item,
	})
	return &s, err
}

func (r *DynamoRepository) GetActiveSubscriptionsByDueDay(ctx context.Context, dueDay int) ([]domain.Subscription, error) {
	out, err := r.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              &r.tableName,
		IndexName:              aws.String("BillingIndex"),
		KeyConditionExpression: aws.String("GSI2PK = :status AND begins_with(GSI2SK, :dueday_prefix)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":status":        &types.AttributeValueMemberS{Value: "STATUS#active"},
			":dueday_prefix": &types.AttributeValueMemberS{Value: fmt.Sprintf("DUEDAY#%02d", dueDay)},
		},
	})
	if err != nil {
		return nil, err
	}

	subs := make([]domain.Subscription, 0, len(out.Items))
	for _, item := range out.Items {
		var row struct {
			PK              string  `dynamodbav:"PK"`
			SK              string  `dynamodbav:"SK"`
			TargetCompanyID string  `dynamodbav:"target_company_id"`
			Amount          float64 `dynamodbav:"amount"`
			DueDay          int     `dynamodbav:"due_day"`
		}
		if err := attributevalue.UnmarshalMap(item, &row); err != nil {
			continue
		}
		subs = append(subs, domain.Subscription{
			ID:              row.SK[len("SUBSCRIPTION#"):],
			TargetCompanyID: row.TargetCompanyID,
			CompanyID:       row.PK[len("COMPANY#"):],
			Amount:          row.Amount,
			DueDay:          row.DueDay,
			Active:          true,
		})
	}
	return subs, nil
}
func (r *DynamoRepository) UpdateSubscription(ctx context.Context, s domain.Subscription) error {
	status := "STATUS#inactive"
	if s.Active {
		status = "STATUS#active"
	}

	_, err := r.client.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + s.CompanyID},
			"SK": &types.AttributeValueMemberS{Value: "SUBSCRIPTION#" + s.ID},
		},
		UpdateExpression: aws.String("SET amount = :amt, due_day = :dd, active = :act, target_company_id = :tcid, GSI2PK = :g2p, GSI2SK = :g2s"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":amt":  &types.AttributeValueMemberN{Value: fmt.Sprintf("%.2f", s.Amount)},
			":dd":   &types.AttributeValueMemberN{Value: fmt.Sprintf("%d", s.DueDay)},
			":act":  &types.AttributeValueMemberBOOL{Value: s.Active},
			":tcid": &types.AttributeValueMemberS{Value: s.TargetCompanyID},
			":g2p":  &types.AttributeValueMemberS{Value: status},
			":g2s":  &types.AttributeValueMemberS{Value: fmt.Sprintf("DUEDAY#%02d#%s", s.DueDay, s.ID)},
		},
	})
	return err
}

func (r *DynamoRepository) DeleteSubscription(ctx context.Context, companyID, subscriptionID string) error {
	_, err := r.client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
			"SK": &types.AttributeValueMemberS{Value: "SUBSCRIPTION#" + subscriptionID},
		},
	})
	return err
}
