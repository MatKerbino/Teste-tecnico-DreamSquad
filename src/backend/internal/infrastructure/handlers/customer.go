package handlers

import (
	"billing-manager-backend/internal/domain"
	"billing-manager-backend/internal/infrastructure"
	"encoding/json"
	"net/http"
)

func (h *Handler) listCustomers(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	customers, err := h.customers.ListCustomers(r.Context(), c.CompanyID)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, customers, http.StatusOK)
}

func (h *Handler) createCustomer(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	var body domain.Customer
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		infrastructure.JsonError(w, "invalid body", http.StatusBadRequest)
		return
	}

	created, err := h.customers.CreateCustomer(r.Context(), c.CompanyID, body)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, created, http.StatusCreated)
}

func (h *Handler) updateCustomer(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	id := r.PathValue("id")
	var body domain.Customer
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		infrastructure.JsonError(w, "invalid body", http.StatusBadRequest)
		return
	}

	updated, err := h.customers.UpdateCustomer(r.Context(), c.CompanyID, id, body)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, updated, http.StatusOK)
}

func (h *Handler) deleteCustomer(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	id := r.PathValue("id")
	if err := h.customers.DeleteCustomer(r.Context(), c.CompanyID, id); err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, map[string]string{"status": "deleted"}, http.StatusOK)
}

func (h *Handler) deleteUser(w http.ResponseWriter, r *http.Request) {
	if !infrastructure.IsMasterAdmin(r) {
		infrastructure.JsonError(w, "forbidden: system admin role required", http.StatusForbidden)
		return
	}
	email := r.PathValue("email")
	if err := h.users.DeleteUser(r.Context(), email); err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, map[string]string{"status": "deleted"}, http.StatusOK)
}
