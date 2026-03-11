package handlers

import (
	"billing-manager-backend/internal/application"
	"billing-manager-backend/internal/domain"
	"billing-manager-backend/internal/infrastructure"
	"net/http"
)

var (
	jwtSecret  = []byte(infrastructure.GetEnv("JWT_SECRET", "billing-manager-secret-change-in-prod"))
	cronSecret = infrastructure.GetEnv("CRON_SECRET", "billing-manager-cron-secret-change-in-prod")
)

type Handler struct {
	companies     domain.CompanyRepository
	invoices      domain.InvoiceRepository
	storage       domain.StorageService
	billing       application.BillingUseCase
	users         application.UserUseCase
	customers     application.CustomerUseCase
	subscriptions application.SubscriptionUseCase
	companyReg    application.CompanyUseCase
}

func NewHandler(
	companies domain.CompanyRepository,
	invoices domain.InvoiceRepository,
	storage domain.StorageService,
	billing application.BillingUseCase,
	users application.UserUseCase,
	customers application.CustomerUseCase,
	subscriptions application.SubscriptionUseCase,
	companyReg application.CompanyUseCase,
) *Handler {
	return &Handler{
		companies:     companies,
		invoices:      invoices,
		storage:       storage,
		billing:       billing,
		users:         users,
		customers:     customers,
		subscriptions: subscriptions,
		companyReg:    companyReg,
	}
}

// ─── Helpers & Auth Checks ────────────────────────────────────
func (h *Handler) health(w http.ResponseWriter, _ *http.Request) {
	infrastructure.JsonResponse(w, map[string]string{"status": "ok"}, http.StatusOK)
}
