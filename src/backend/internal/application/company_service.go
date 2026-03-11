package application

import (
	"context"
	"time"

	"billing-manager-backend/internal/domain"

	"github.com/google/uuid"
)

type CompanyService struct {
	companies domain.CompanyRepository
}

func NewCompanyService(companies domain.CompanyRepository) *CompanyService {
	return &CompanyService{
		companies: companies,
	}
}

var _ CompanyUseCase = (*CompanyService)(nil)

func (s *CompanyService) CreateCompany(ctx context.Context, name, cnpj string) (*domain.Company, error) {
	companyID := uuid.NewString()
	company := domain.Company{
		ID:        companyID,
		Name:      name,
		CNPJ:      cnpj,
		CreatedAt: time.Now().UTC(),
	}

	if err := s.companies.CreateCompany(ctx, company); err != nil {
		return nil, err
	}

	return &company, nil
}

func (s *CompanyService) ListCompanies(ctx context.Context) ([]domain.Company, error) {
	return s.companies.ListCompanies(ctx)
}
func (s *CompanyService) UpdateCompany(ctx context.Context, c domain.Company) error {
	return s.companies.UpdateCompany(ctx, c)
}

func (s *CompanyService) DeleteCompany(ctx context.Context, id string) error {
	return s.companies.DeleteCompany(ctx, id)
}
