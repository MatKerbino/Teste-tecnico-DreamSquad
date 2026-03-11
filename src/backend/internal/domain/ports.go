package domain

import (
	"context"
	"time"
)

// CompanyRepository defines operations for companies.
type CompanyRepository interface {
	GetCompany(ctx context.Context, companyID string) (*Company, error)
	ListCompanies(ctx context.Context) ([]Company, error)
	CreateCompany(ctx context.Context, c Company) error
	UpdateCompany(ctx context.Context, c Company) error
	DeleteCompany(ctx context.Context, companyID string) error
}

// UserRepository defines user-related operations.
type UserRepository interface {
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	CreateUser(ctx context.Context, u User) error
	DeleteUser(ctx context.Context, email string) error
}

// CustomerRepository defines CRUD operations for end-customers.
type CustomerRepository interface {
	ListCustomers(ctx context.Context, companyID string) ([]Customer, error)
	CreateCustomer(ctx context.Context, c Customer) error
	UpdateCustomer(ctx context.Context, c Customer) error
	DeleteCustomer(ctx context.Context, companyID, customerID string) error
}

// SubscriptionRepository defines operations for recurring subscriptions.
type SubscriptionRepository interface {
	ListSubscriptions(ctx context.Context, companyID string) ([]Subscription, error)
	CreateSubscription(ctx context.Context, s Subscription) (*Subscription, error)
	UpdateSubscription(ctx context.Context, s Subscription) error
	DeleteSubscription(ctx context.Context, companyID, subscriptionID string) error
	// GetActiveSubscriptionsByDueDay is the core query for the daily billing routine.
	GetActiveSubscriptionsByDueDay(ctx context.Context, dueDay int) ([]Subscription, error)
}

// InvoiceRepository defines CRUD operations for invoices.
type InvoiceRepository interface {
	ListInvoices(ctx context.Context, companyID string) ([]Invoice, error)
	CreateInvoice(ctx context.Context, inv Invoice) error
	PayInvoice(ctx context.Context, companyID, subscriptionID, invoiceID string) error
	DeleteInvoice(ctx context.Context, companyID, invoiceID string) error
}

// StorageService abstracts file uploads and listings (S3 adapter).
type StorageService interface {
	UploadBillingReport(ctx context.Context, ts time.Time, companyID string, content []byte) (string, error)
	UploadBackup(ctx context.Context, ts time.Time, companyID string, content []byte) (string, error)
	ListBillingReports(ctx context.Context, companyID string) ([]Report, error)
	ListBackupReports(ctx context.Context, companyID string) ([]Report, error)
	GetReport(ctx context.Context, bucket, key string) ([]byte, error)
}
