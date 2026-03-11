package handlers

import (
	"billing-manager-backend/internal/infrastructure"
	"fmt"
	"net/http"
)

func (h *Handler) runBilling(w http.ResponseWriter, r *http.Request) {
	if !infrastructure.IsAdmin(r) {
		infrastructure.JsonError(w, "forbidden: admin role required", http.StatusForbidden)
		return
	}
	c := infrastructure.ClaimsFromCtx(r)
	dueDayStr := r.URL.Query().Get("due_day")
	dueDay := 0
	if dueDayStr != "" {
		fmt.Sscanf(dueDayStr, "%d", &dueDay)
	}

	companyID := c.CompanyID
	if infrastructure.IsMasterAdmin(r) {
		companyID = ""
	}

	key, invoices, err := h.billing.RunBilling(r.Context(), companyID, dueDay)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, map[string]interface{}{
		"report_key":       key,
		"invoices_created": len(invoices),
		"invoices":         invoices,
	}, http.StatusOK)
}

func (h *Handler) runSystemBilling(w http.ResponseWriter, r *http.Request) {
	reportKey, invoices, err := h.billing.RunBilling(r.Context(), "", 0)
	if err != nil {
		infrastructure.JsonError(w, fmt.Sprintf("billing failed: %v", err), http.StatusInternalServerError)
		return
	}

	backupKey, err := h.billing.RunBackup(r.Context(), "")
	if err != nil {
		infrastructure.JsonError(w, fmt.Sprintf("backup failed: %v", err), http.StatusInternalServerError)
		return
	}

	infrastructure.JsonResponse(w, map[string]interface{}{
		"report_key":       reportKey,
		"backup_key":       backupKey,
		"invoices_created": len(invoices),
	}, http.StatusOK)
}

func (h *Handler) runBackup(w http.ResponseWriter, r *http.Request) {
	if !infrastructure.IsMasterAdmin(r) {
		infrastructure.JsonError(w, "forbidden: master admin role required", http.StatusForbidden)
		return
	}
	companyID := infrastructure.ClaimsFromCtx(r).CompanyID
	if infrastructure.IsMasterAdmin(r) {
		companyID = ""
	}
	key, err := h.billing.RunBackup(r.Context(), companyID)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, map[string]string{"backup_key": key}, http.StatusOK)
}
