package application

import (
	"context"
	"billing-manager-backend/internal/domain"
)

type BillingUseCase interface {
	RunBilling(ctx context.Context, companyID string, forcedDueDay int) (reportKey string, invoices []domain.Invoice, err error)
	RunBackup(ctx context.Context, companyID string) (backupKey string, err error)
}

type CustomerUseCase interface {
	ListCustomers(ctx context.Context, companyID string) ([]domain.Customer, error)
	CreateCustomer(ctx context.Context, companyID string, c domain.Customer) (*domain.Customer, error)
	UpdateCustomer(ctx context.Context, companyID string, id string, c domain.Customer) (*domain.Customer, error)
	DeleteCustomer(ctx context.Context, companyID string, id string) error
}

type SubscriptionUseCase interface {
	ListSubscriptions(ctx context.Context, companyID string) ([]domain.Subscription, error)
	CreateSubscription(ctx context.Context, companyID string, s domain.Subscription) (*domain.Subscription, error)
	UpdateSubscription(ctx context.Context, companyID string, s domain.Subscription) error
	DeleteSubscription(ctx context.Context, companyID string, id string) error
}

type CompanyUseCase interface {
	CreateCompany(ctx context.Context, name, cnpj string) (*domain.Company, error)
	ListCompanies(ctx context.Context) ([]domain.Company, error)
	UpdateCompany(ctx context.Context, c domain.Company) error
	DeleteCompany(ctx context.Context, id string) error
}

type UserUseCase interface {
	Login(ctx context.Context, email, password string) (string, *domain.User, error)
	Register(ctx context.Context, companyID, name, email, password string, role domain.Role) (*domain.User, error)
	DeleteUser(ctx context.Context, email string) error
	Impersonate(ctx context.Context, companyID string, currentRole domain.Role) (string, error)
}
