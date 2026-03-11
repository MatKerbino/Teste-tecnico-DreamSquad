package handlers

import (
	"net/http"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	// Public
	mux.HandleFunc("GET /health", h.health)
	mux.HandleFunc("POST /api/auth/login", h.login)
	mux.HandleFunc("POST /api/auth/register", h.register)
	mux.HandleFunc("POST /api/auth/register-for-company", h.AuthMiddleware(h.registerForCompany))
	mux.HandleFunc("POST /api/auth/impersonate", h.AuthMiddleware(h.impersonate))

	// Protected
	mux.HandleFunc("GET /api/companies/me", h.AuthMiddleware(h.getCompanyMe))
	mux.HandleFunc("GET /api/companies", h.AuthMiddleware(h.listCompanies))
	mux.HandleFunc("POST /api/companies", h.AuthMiddleware(h.createCompany))
	mux.HandleFunc("PUT /api/companies/{id}", h.AuthMiddleware(h.updateCompany))
	mux.HandleFunc("DELETE /api/companies/{id}", h.AuthMiddleware(h.deleteCompany))
	mux.HandleFunc("DELETE /api/users/{email}", h.AuthMiddleware(h.deleteUser))
	mux.HandleFunc("GET /api/customers", h.AuthMiddleware(h.listCustomers))
	mux.HandleFunc("POST /api/customers", h.AuthMiddleware(h.createCustomer))
	mux.HandleFunc("PUT /api/customers/{id}", h.AuthMiddleware(h.updateCustomer))
	mux.HandleFunc("DELETE /api/customers/{id}", h.AuthMiddleware(h.deleteCustomer))
	mux.HandleFunc("GET /api/subscriptions", h.AuthMiddleware(h.listSubscriptions))
	mux.HandleFunc("POST /api/subscriptions", h.AuthMiddleware(h.createSubscription))
	mux.HandleFunc("PUT /api/subscriptions/{id}", h.AuthMiddleware(h.updateSubscription))
	mux.HandleFunc("DELETE /api/subscriptions/{id}", h.AuthMiddleware(h.deleteSubscription))
	mux.HandleFunc("GET /api/invoices", h.AuthMiddleware(h.listInvoices))
	mux.HandleFunc("DELETE /api/invoices/{id}", h.AuthMiddleware(h.deleteInvoice))
	mux.HandleFunc("PATCH /api/invoices/{id}/pay", h.AuthMiddleware(h.payInvoice))
	mux.HandleFunc("POST /api/operations/billing", h.AuthMiddleware(h.runBilling))
	mux.HandleFunc("POST /api/operations/backup", h.AuthMiddleware(h.runBackup))
	mux.HandleFunc("GET /api/operations/reports", h.AuthMiddleware(h.listReports))
	mux.HandleFunc("GET /api/operations/reports/download", h.AuthMiddleware(h.downloadReport))

	// System/Cron
	mux.HandleFunc("POST /api/routines/system/billing", h.CronAuthMiddleware(h.runSystemBilling))
}
