package application

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"billing-manager-backend/internal/domain"
)

type BillingService struct {
	invoices      domain.InvoiceRepository
	subscriptions domain.SubscriptionRepository
	companies     domain.CompanyRepository
	storage       domain.StorageService
}

func NewBillingService(
	invoices domain.InvoiceRepository,
	subscriptions domain.SubscriptionRepository,
	companies domain.CompanyRepository,
	storage domain.StorageService,
) *BillingService {
	return &BillingService{
		invoices:      invoices,
		subscriptions: subscriptions,
		companies:     companies,
		storage:       storage,
	}
}

var _ BillingUseCase = (*BillingService)(nil)

func (s *BillingService) RunBilling(ctx context.Context, companyID string, forcedDueDay int) (string, []domain.Invoice, error) {
	now := time.Now().UTC()
	today := now.Day()
	if forcedDueDay != 0 {
		today = forcedDueDay
	}

	subs, err := s.subscriptions.GetActiveSubscriptionsByDueDay(ctx, today)
	if err != nil {
		return "", nil, fmt.Errorf("billing: fetch subscriptions: %w", err)
	}

	invoices := make([]domain.Invoice, 0, len(subs))
	periodStr := now.Format("200601")

	subsByCompany := make(map[string][]domain.Subscription)
	for _, sub := range subs {
		if companyID != "" && sub.CompanyID != companyID {
			continue
		}
		subsByCompany[sub.CompanyID] = append(subsByCompany[sub.CompanyID], sub)
	}

	for compID, companySubs := range subsByCompany {
		existingInv, err := s.invoices.ListInvoices(ctx, compID)
		if err != nil {
			existingInv = []domain.Invoice{}
		}
		invMap := make(map[string]domain.Invoice)
		for _, inv := range existingInv {
			invMap[inv.ID] = inv
		}

		for _, sub := range companySubs {
			invID := fmt.Sprintf("%s-%s", periodStr, sub.ID)

			if existing, ok := invMap[invID]; ok {
				invoices = append(invoices, existing)
				continue
			}

			inv := domain.Invoice{
				ID:              invID,
				SubscriptionID:  sub.ID,
				TargetCompanyID: sub.TargetCompanyID,
				CompanyID:       sub.CompanyID,
				Amount:          sub.Amount,
				DueDate:         time.Date(now.Year(), now.Month(), sub.DueDay, 0, 0, 0, 0, time.UTC),
				Status:          domain.InvoiceStatusPending,
				CreatedAt:       now,
			}
			if err := s.invoices.CreateInvoice(ctx, inv); err != nil {
				return "", nil, fmt.Errorf("billing: create invoice for subscription %s: %w", sub.ID, err)
			}
			invoices = append(invoices, inv)
		}
	}

	allCompanies, _ := s.companies.ListCompanies(ctx)
	compNameMap := make(map[string]string)
	for _, c := range allCompanies {
		compNameMap[c.ID] = c.Name
	}
	if companyID != "" && len(allCompanies) == 0 {
		compNameMap[companyID] = companyID
	}

	reportContent, err := s.buildCSV(invoices, compNameMap)
	if err != nil {
		return "", nil, fmt.Errorf("billing: build CSV: %w", err)
	}

	key, err := s.storage.UploadBillingReport(ctx, now, companyID, reportContent)
	if err != nil {
		return "", nil, fmt.Errorf("billing: upload report: %w", err)
	}

	return key, invoices, nil
}

func (s *BillingService) RunBackup(ctx context.Context, companyID string) (string, error) {
	now := time.Now().UTC()

	invoices, err := s.invoices.ListInvoices(ctx, companyID)
	if err != nil {
		return "", fmt.Errorf("backup: list invoices: %w", err)
	}

	subs, err := s.subscriptions.ListSubscriptions(ctx, companyID)
	if err != nil {
		return "", fmt.Errorf("backup: list subscriptions: %w", err)
	}

	dump := map[string]interface{}{
		"generated_at":  now.Format(time.RFC3339),
		"coverage":      "tenant",
		"company_id":    companyID,
		"invoices":      invoices,
		"subscriptions": subs,
	}

	if companyID == "" {
		dump["coverage"] = "global"
		delete(dump, "company_id")
	}

	data, err := json.MarshalIndent(dump, "", "  ")
	if err != nil {
		return "", fmt.Errorf("backup: marshal JSON: %w", err)
	}

	key, err := s.storage.UploadBackup(ctx, now, companyID, data)
	if err != nil {
		return "", fmt.Errorf("backup: upload: %w", err)
	}

	return key, nil
}

func (s *BillingService) buildCSV(invoices []domain.Invoice, compNames map[string]string) ([]byte, error) {
	var buf strings.Builder
	w := csv.NewWriter(&buf)

	if err := w.Write([]string{"company_name", "company_id", "subscription_id", "target_company_name", "target_company_id", "amount", "due_date", "status", "created_at"}); err != nil {
		return nil, err
	}

	for _, inv := range invoices {
		targetName := compNames[inv.TargetCompanyID]
		if targetName == "" {
			targetName = inv.TargetCompanyID
		}
		compName := compNames[inv.CompanyID]
		if compName == "" {
			compName = inv.CompanyID
		}

		if err := w.Write([]string{
			compName,
			inv.CompanyID,
			inv.SubscriptionID,
			targetName,
			inv.TargetCompanyID,
			fmt.Sprintf("%.2f", inv.Amount),
			inv.DueDate.Format("2006-01-02"),
			string(inv.Status),
			inv.CreatedAt.Format(time.RFC3339),
		}); err != nil {
			return nil, err
		}
	}

	w.Flush()
	if err := w.Error(); err != nil {
		return nil, err
	}

	return []byte(buf.String()), nil
}
