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

func (r *DynamoRepository) ListInvoices(ctx context.Context, companyID string) ([]domain.Invoice, error) {
	var out *dynamodb.ScanOutput
	var qOut *dynamodb.QueryOutput
	var err error

	if companyID == "" {
		out, err = r.client.Scan(ctx, &dynamodb.ScanInput{
			TableName:        &r.tableName,
			FilterExpression: aws.String("begins_with(SK, :sk_prefix)"),
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":sk_prefix": &types.AttributeValueMemberS{Value: "INVOICE#"},
			},
		})
	} else {
		qOut, err = r.client.Query(ctx, &dynamodb.QueryInput{
			TableName:              &r.tableName,
			KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk_prefix)"),
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":pk":        &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
				":sk_prefix": &types.AttributeValueMemberS{Value: "INVOICE#"},
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

	invoices := make([]domain.Invoice, 0, len(items))
	for _, item := range items {
		var row struct {
			PK              string               `dynamodbav:"PK"`
			SK              string               `dynamodbav:"SK"`
			SubscriptionID  string               `dynamodbav:"subscription_id"`
			TargetCompanyID string               `dynamodbav:"target_company_id"`
			Amount          float64              `dynamodbav:"amount"`
			DueDate         time.Time            `dynamodbav:"due_date"`
			Status          domain.InvoiceStatus `dynamodbav:"status"`
			CreatedAt       time.Time            `dynamodbav:"created_at"`
		}
		if err := attributevalue.UnmarshalMap(item, &row); err != nil {
			continue
		}
		invoices = append(invoices, domain.Invoice{
			ID:              row.SK[len("INVOICE#"):],
			SubscriptionID:  row.SubscriptionID,
			TargetCompanyID: row.TargetCompanyID,
			CompanyID:       row.PK[len("COMPANY#"):],
			Amount:          row.Amount,
			DueDate:         row.DueDate,
			Status:          row.Status,
			CreatedAt:       row.CreatedAt,
		})
	}
	return invoices, nil
}

func (r *DynamoRepository) CreateInvoice(ctx context.Context, inv domain.Invoice) error {
	item, err := attributevalue.MarshalMap(map[string]interface{}{
		"PK":                "COMPANY#" + inv.CompanyID,
		"SK":                "INVOICE#" + inv.ID,
		"subscription_id":   inv.SubscriptionID,
		"target_company_id": inv.TargetCompanyID,
		"amount":            inv.Amount,
		"due_date":          inv.DueDate,
		"status":            inv.Status,
		"created_at":        inv.CreatedAt,
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

func (r *DynamoRepository) PayInvoice(ctx context.Context, companyID, subscriptionID, invoiceID string) error {
	_, err := r.client.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
			"SK": &types.AttributeValueMemberS{Value: "INVOICE#" + invoiceID},
		},
		UpdateExpression:         aws.String("SET #s = :paid"),
		ExpressionAttributeNames: map[string]string{"#s": "status"},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":paid": &types.AttributeValueMemberS{Value: string(domain.InvoiceStatusPaid)},
		},
	})
	return err
}
func (r *DynamoRepository) DeleteInvoice(ctx context.Context, companyID, invoiceID string) error {
	_, err := r.client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "COMPANY#" + companyID},
			"SK": &types.AttributeValueMemberS{Value: "INVOICE#" + invoiceID},
		},
	})
	return err
}
