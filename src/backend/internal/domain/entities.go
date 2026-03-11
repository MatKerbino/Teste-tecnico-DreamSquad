package domain

import "time"

// ─── Company ─────────────────────────────────────────────────

type Company struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CNPJ      string    `json:"cnpj"`
	CreatedAt time.Time `json:"created_at"`
}

// ─── User ─────────────────────────────────────────────────────

type Role string

const (
	RoleAdmin  Role = "admin"
	RoleUser   Role = "user"
	RoleMaster Role = "master"
)

type User struct {
	ID           string    `json:"id"`
	CompanyID    string    `json:"company_id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         Role      `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}

// ─── Customer (Contact) ───────────────────────────────────────
type Customer struct {
	ID               string    `json:"id"`
	CompanyID        string    `json:"company_id"`
	RelatedCompanyID string    `json:"related_company_id"`
	Name             string    `json:"name"`
	Email            string    `json:"email"`
	Document         string    `json:"document"`
	CreatedAt        time.Time `json:"created_at"`
}

// ─── Subscription ─────────────────────────────────────────────
type Subscription struct {
	ID              string    `json:"id"`
	TargetCompanyID string    `json:"target_company_id"`
	CompanyID       string    `json:"company_id"`
	Amount          float64   `json:"amount"`
	DueDay          int       `json:"due_day"`
	Active          bool      `json:"active"`
	CreatedAt       time.Time `json:"created_at"`
}

// ─── Invoice ──────────────────────────────────────────────────

type InvoiceStatus string

const (
	InvoiceStatusPending  InvoiceStatus = "pending"
	InvoiceStatusPaid     InvoiceStatus = "paid"
	InvoiceStatusCanceled InvoiceStatus = "canceled"
)

type Invoice struct {
	ID              string        `json:"id"`
	SubscriptionID  string        `json:"subscription_id"`
	TargetCompanyID string        `json:"target_company_id"`
	CompanyID       string        `json:"company_id"`
	DueDate         time.Time     `json:"due_date"`
	Amount          float64       `json:"amount"`
	Status          InvoiceStatus `json:"status"`
	CreatedAt       time.Time     `json:"created_at"`
}

// ─── Report ───────────────────────────────────────────────────

type Report struct {
	Key          string    `json:"key"`
	FileName     string    `json:"file_name"`
	Bucket       string    `json:"bucket"`
	Size         int64     `json:"size"`
	LastModified time.Time `json:"last_modified"`
	DownloadURL  string    `json:"download_url,omitempty"`
}
