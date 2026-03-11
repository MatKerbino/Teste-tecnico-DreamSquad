package handlers

import (
	"billing-manager-backend/internal/infrastructure"
	"net/http"
	"strings"
)

func (h *Handler) listInvoices(w http.ResponseWriter, r *http.Request) {
	companyID := infrastructure.ClaimsFromCtx(r).CompanyID
	if infrastructure.IsMasterAdmin(r) {
		companyID = ""
	}

	invoices, err := h.invoices.ListInvoices(r.Context(), companyID)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, invoices, http.StatusOK)
}

func (h *Handler) payInvoice(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	parts := strings.SplitN(id, ":", 2)
	if len(parts) != 2 {
		infrastructure.JsonError(w, "id must be <subscriptionID>:<invoiceID>", http.StatusBadRequest)
		return
	}
	c := infrastructure.ClaimsFromCtx(r)
	if err := h.invoices.PayInvoice(r.Context(), c.CompanyID, parts[0], parts[1]); err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, map[string]string{"status": "paid"}, http.StatusOK)
}

func (h *Handler) deleteInvoice(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	id := r.PathValue("id")
	if err := h.invoices.DeleteInvoice(r.Context(), c.CompanyID, id); err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, map[string]string{"status": "deleted"}, http.StatusOK)
}
