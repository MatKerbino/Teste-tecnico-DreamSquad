package handlers

import (
	"billing-manager-backend/internal/domain"
	"billing-manager-backend/internal/infrastructure"
	"encoding/json"
	"net/http"
)

func (h *Handler) listSubscriptions(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	subs, err := h.subscriptions.ListSubscriptions(r.Context(), c.CompanyID)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, subs, http.StatusOK)
}

func (h *Handler) createSubscription(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	var body domain.Subscription
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		infrastructure.JsonError(w, "invalid body", http.StatusBadRequest)
		return
	}

	created, err := h.subscriptions.CreateSubscription(r.Context(), c.CompanyID, body)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, created, http.StatusCreated)
}

func (h *Handler) updateSubscription(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	id := r.PathValue("id")
	var body domain.Subscription
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		infrastructure.JsonError(w, "invalid body", http.StatusBadRequest)
		return
	}
	body.ID = id
	if err := h.subscriptions.UpdateSubscription(r.Context(), c.CompanyID, body); err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, body, http.StatusOK)
}

func (h *Handler) deleteSubscription(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	id := r.PathValue("id")
	if err := h.subscriptions.DeleteSubscription(r.Context(), c.CompanyID, id); err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, map[string]string{"status": "deleted"}, http.StatusOK)
}
