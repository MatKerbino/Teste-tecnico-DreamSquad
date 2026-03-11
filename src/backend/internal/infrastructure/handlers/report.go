package handlers

import (
	"billing-manager-backend/internal/infrastructure"
	"net/http"
	"strings"
)

func (h *Handler) listReports(w http.ResponseWriter, r *http.Request) {
	companyID := infrastructure.ClaimsFromCtx(r).CompanyID
	if infrastructure.IsMasterAdmin(r) {
		companyID = ""
	}
	billing, _ := h.storage.ListBillingReports(r.Context(), companyID)
	backups, _ := h.storage.ListBackupReports(r.Context(), companyID)
	infrastructure.JsonResponse(w, map[string]interface{}{
		"billing_reports": billing,
		"backup_reports":  backups,
	}, http.StatusOK)
}

func (h *Handler) downloadReport(w http.ResponseWriter, r *http.Request) {
	bucket := r.URL.Query().Get("bucket")
	key := r.URL.Query().Get("key")
	if bucket == "" || key == "" {
		infrastructure.JsonError(w, "bucket and key are required", http.StatusBadRequest)
		return
	}

	content, err := h.storage.GetReport(r.Context(), bucket, key)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	contentType := "application/octet-stream"
	if strings.HasSuffix(key, ".csv") {
		contentType = "text/csv"
	} else if strings.HasSuffix(key, ".json") {
		contentType = "application/json"
	}

	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Content-Disposition", "attachment; filename="+key)
	w.Write(content)
}
