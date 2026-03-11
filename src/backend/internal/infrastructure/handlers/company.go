package handlers

import (
	"billing-manager-backend/internal/domain"
	"billing-manager-backend/internal/infrastructure"
	"encoding/json"
	"net/http"
)

func (h *Handler) createCompany(w http.ResponseWriter, r *http.Request) {
	if !infrastructure.IsMasterAdmin(r) {
		infrastructure.JsonError(w, "forbidden: system admin role required", http.StatusForbidden)
		return
	}

	var body struct {
		Name string `json:"name"`
		CNPJ string `json:"cnpj"`
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

	infrastructure.JsonResponse(w, company, http.StatusCreated)
}

func (h *Handler) getCompanyMe(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	company, err := h.companies.GetCompany(r.Context(), c.CompanyID)
	if err != nil {
		infrastructure.JsonError(w, "company not found", http.StatusNotFound)
		return
	}
	infrastructure.JsonResponse(w, company, http.StatusOK)
}

func (h *Handler) listCompanies(w http.ResponseWriter, r *http.Request) {
	c := infrastructure.ClaimsFromCtx(r)
	if infrastructure.IsAdmin(r) {
		companies, err := h.companyReg.ListCompanies(r.Context())
		if err != nil {
			infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
			return
		}
		infrastructure.JsonResponse(w, companies, http.StatusOK)
		return
	}

	company, err := h.companies.GetCompany(r.Context(), c.CompanyID)
	if err != nil {
		infrastructure.JsonError(w, "company not found", http.StatusNotFound)
		return
	}
	infrastructure.JsonResponse(w, []domain.Company{*company}, http.StatusOK)
}

func (h *Handler) registerForCompany(w http.ResponseWriter, r *http.Request) {
	var body struct {
		CompanyID string      `json:"company_id"`
		Name      string      `json:"name"`
		Email     string      `json:"email"`
		Password  string      `json:"password"`
		Role      domain.Role `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		infrastructure.JsonError(w, "invalid body", http.StatusBadRequest)
		return
	}

	claims := infrastructure.ClaimsFromCtx(r)
	isMaster := infrastructure.IsMasterAdmin(r)
	isAdmin := infrastructure.IsAdmin(r)

	if !isMaster {
		if !isAdmin || claims.CompanyID != body.CompanyID {
			infrastructure.JsonError(w, "forbidden: insufficient permissions", http.StatusForbidden)
			return
		}
	}

	user, err := h.users.Register(r.Context(), body.CompanyID, body.Name, body.Email, body.Password, body.Role)
	if err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	infrastructure.JsonResponse(w, map[string]string{"id": user.ID, "status": "created"}, http.StatusCreated)
}

func (h *Handler) updateCompany(w http.ResponseWriter, r *http.Request) {
	if !infrastructure.IsMasterAdmin(r) {
		infrastructure.JsonError(w, "forbidden: system admin role required", http.StatusForbidden)
		return
	}
	id := r.PathValue("id")
	var body domain.Company
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		infrastructure.JsonError(w, "invalid body", http.StatusBadRequest)
		return
	}
	body.ID = id
	if err := h.companyReg.UpdateCompany(r.Context(), body); err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, body, http.StatusOK)
}

func (h *Handler) deleteCompany(w http.ResponseWriter, r *http.Request) {
	if !infrastructure.IsMasterAdmin(r) {
		infrastructure.JsonError(w, "forbidden: system admin role required", http.StatusForbidden)
		return
	}
	id := r.PathValue("id")
	if err := h.companyReg.DeleteCompany(r.Context(), id); err != nil {
		infrastructure.JsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	infrastructure.JsonResponse(w, map[string]string{"status": "deleted"}, http.StatusOK)
}
