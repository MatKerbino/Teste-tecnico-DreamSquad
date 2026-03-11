package application

import (
	"context"
	"time"

	"billing-manager-backend/internal/domain"

	"github.com/google/uuid"
)

type CustomerService struct {
	customers domain.CustomerRepository
}

func NewCustomerService(customers domain.CustomerRepository) *CustomerService {
	return &CustomerService{
		customers: customers,
	}
}

var _ CustomerUseCase = (*CustomerService)(nil)

func (s *CustomerService) ListCustomers(ctx context.Context, companyID string) ([]domain.Customer, error) {
	return s.customers.ListCustomers(ctx, companyID)
}

func (s *CustomerService) CreateCustomer(ctx context.Context, companyID string, c domain.Customer) (*domain.Customer, error) {
	c.ID = uuid.NewString()
	c.CompanyID = companyID
	c.CreatedAt = time.Now().UTC()

	if err := s.customers.CreateCustomer(ctx, c); err != nil {
		return nil, err
	}
	return &c, nil
}

func (s *CustomerService) UpdateCustomer(ctx context.Context, companyID string, id string, c domain.Customer) (*domain.Customer, error) {
	c.ID = id
	c.CompanyID = companyID

	if err := s.customers.UpdateCustomer(ctx, c); err != nil {
		return nil, err
	}
	return &c, nil
}
func (s *CustomerService) DeleteCustomer(ctx context.Context, companyID string, id string) error {
	return s.customers.DeleteCustomer(ctx, companyID, id)
}
