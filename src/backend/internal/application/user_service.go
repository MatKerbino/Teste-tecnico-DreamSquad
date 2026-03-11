package application

import (
	"context"
	"fmt"
	"time"

	"billing-manager-backend/internal/domain"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	users     domain.UserRepository
	jwtSecret []byte
}

func NewUserService(users domain.UserRepository, secret string) *UserService {
	return &UserService{
		users:     users,
		jwtSecret: []byte(secret),
	}
}

var _ UserUseCase = (*UserService)(nil)

type contextKey string

const ClaimsKey contextKey = "claims"

type Claims struct {
	UserID    string      `json:"user_id"`
	CompanyID string      `json:"company_id"`
	Email     string      `json:"email"`
	Role      domain.Role `json:"role"`
	jwt.RegisteredClaims
}

func (s *UserService) Login(ctx context.Context, email, password string) (string, *domain.User, error) {
	user, err := s.users.GetUserByEmail(ctx, email)
	if err != nil {
		return "", nil, fmt.Errorf("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", nil, fmt.Errorf("invalid credentials")
	}

	claims := &Claims{
		UserID:    user.ID,
		CompanyID: user.CompanyID,
		Email:     user.Email,
		Role:      user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(s.jwtSecret)
	if err != nil {
		return "", nil, fmt.Errorf("could not generate token: %w", err)
	}

	return token, user, nil
}

func (s *UserService) Register(ctx context.Context, companyID, name, email, password string, role domain.Role) (*domain.User, error) {
	if existing, _ := s.users.GetUserByEmail(ctx, email); existing != nil {
		return nil, fmt.Errorf("user with email %s already exists", email)
	}

	userID := uuid.NewString()

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := domain.User{
		ID:           userID,
		CompanyID:    companyID,
		Name:         name,
		Email:        email,
		PasswordHash: string(hash),
		Role:         role,
		CreatedAt:    time.Now().UTC(),
	}

	if err := s.users.CreateUser(ctx, user); err != nil {
		return nil, err
	}

	return &user, nil
}
func (s *UserService) DeleteUser(ctx context.Context, email string) error {
	return s.users.DeleteUser(ctx, email)
}

func (s *UserService) Impersonate(ctx context.Context, companyID string, currentRole domain.Role) (string, error) {
	effectiveRole := domain.RoleAdmin
	if currentRole == domain.RoleMaster {
		effectiveRole = domain.RoleMaster
	}

	claims := &Claims{
		UserID:    "impersonated-admin",
		CompanyID: companyID,
		Email:     "admin@billing.io",
		Role:      effectiveRole,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(2 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(s.jwtSecret)
	if err != nil {
		return "", fmt.Errorf("could not generate impersonation token: %w", err)
	}

	return token, nil
}
