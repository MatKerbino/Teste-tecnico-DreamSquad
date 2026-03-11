package infrastructure

import (
	"encoding/json"
	"net/http"
	"os"

	"billing-manager-backend/internal/application"
	"billing-manager-backend/internal/domain"
)

// ─── Helpers ──────────────────────────────────────────────────
func JsonResponse(w http.ResponseWriter, data interface{}, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(data)
}

func JsonError(w http.ResponseWriter, msg string, code int) {
	JsonResponse(w, map[string]string{"error": msg}, code)
}

func GetEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// ─── Auth Helpers ─────────────────────────────────────────────
func ClaimsFromCtx(r *http.Request) *application.Claims {
	c, ok := r.Context().Value(application.ClaimsKey).(*application.Claims)
	if !ok {
		return nil
	}
	return c
}

func IsMasterAdmin(r *http.Request) bool {
	c := ClaimsFromCtx(r)
	if c == nil {
		return false
	}
	return c.Role == domain.RoleMaster || (c.Role == domain.RoleAdmin && c.CompanyID == "company-demo")
}

func IsAdmin(r *http.Request) bool {
	c := ClaimsFromCtx(r)
	return c != nil && (c.Role == domain.RoleAdmin || c.Role == domain.RoleMaster)
}
