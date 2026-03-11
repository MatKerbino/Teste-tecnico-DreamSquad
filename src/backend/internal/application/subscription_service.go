package application

import (
	"context"
	"time"

	"billing-manager-backend/internal/domain"

	"github.com/google/uuid"
)

type SubscriptionService struct {
	subscriptions domain.SubscriptionRepository
}

func NewSubscriptionService(subscriptions domain.SubscriptionRepository) *SubscriptionService {
	return &SubscriptionService{
		subscriptions: subscriptions,
	}
}

var _ SubscriptionUseCase = (*SubscriptionService)(nil)

func (s *SubscriptionService) ListSubscriptions(ctx context.Context, companyID string) ([]domain.Subscription, error) {
	return s.subscriptions.ListSubscriptions(ctx, companyID)
}

func (s *SubscriptionService) CreateSubscription(ctx context.Context, companyID string, sub domain.Subscription) (*domain.Subscription, error) {
	sub.ID = uuid.NewString()
	sub.CompanyID = companyID
	sub.Active = true
	sub.CreatedAt = time.Now().UTC()

	return s.subscriptions.CreateSubscription(ctx, sub)
}

func (s *SubscriptionService) UpdateSubscription(ctx context.Context, companyID string, sub domain.Subscription) error {
	sub.CompanyID = companyID
	return s.subscriptions.UpdateSubscription(ctx, sub)
}

func (s *SubscriptionService) DeleteSubscription(ctx context.Context, companyID string, id string) error {
	return s.subscriptions.DeleteSubscription(ctx, companyID, id)
}
