package handlers

import (
	"billing-manager-backend/internal/domain"
	"billing-manager-backend/internal/infrastructure"
	"encoding/json"
	"net/http"
)

func (h *Handler) login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		infrastructure.JsonError(w, "invalid body", http.StatusBadRequest)
		return
	}

	token, user, err := h.users.Login(r.Context(), body.Email, body.Password)
	if err != nil {
		infrastructure.JsonError(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	infrastructure.JsonResponse(w, map[string]interface{}{
		"token": token,
		"user":  map[string]string{"id": user.ID, "name": user.Name, "email": user.Email, "company_id": user.CompanyID, "role": string(user.Role)},
	}, http.StatusOK)
}

func (h *Handler) impersonate(w http.ResponseWriter, r *http.Request) {
	if !infrastructure.IsMasterAdmin(r) {
		infrastructure.JsonError(w, "forbidden: system admin role required", http.StatusForbidden)
		return
	}

	companyID := r.URL.Query().Get("id")
	if companyID == "" {
		infrastructure.JsonError(w, "missing company id", http.StatusBadRequest)
		return
	}

	claims := infrastructure.ClaimsFromCtx(r)
	token, err := h.users.Impersonate(r.Context(), companyID, claims.Role)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	infrastructure.JsonResponse(w, map[string]interface{}{
		"token": token,
		"user": map[string]string{
			"id":         "impersonated-admin",
			"name":       "Master Administrator",
			"email":      "admin@billing.io",
			"company_id": companyID,
			"role":       string(claims.Role),
		},
	}, http.StatusOK)
}

func (h *Handler) register(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Name     string `json:"name"`
		CNPJ     string `json:"cnpj"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		infrastructure.JsonError(w, "invalid body", http.StatusBadRequest)
		return
	}

	company, err := h.companyReg.CreateCompany(r.Context(), body.Name, body.CNPJ)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	user, err := h.users.Register(r.Context(), company.ID, "Admin "+body.Name, body.Email, body.Password, domain.RoleAdmin)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	infrastructure.JsonResponse(w, map[string]interface{}{
		"company": company,
		"user":    map[string]string{"id": user.ID, "name": user.Name, "email": user.Email},
	}, http.StatusCreated)
}
