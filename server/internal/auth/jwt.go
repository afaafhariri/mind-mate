package auth

import (
	"context"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserEmailKey contextKey = "userEmail"

func GenerateToken(userId string, email string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "my_secret_key"
	}

	// Parse duration, default 30 days
	// Node used "30d". Go time.ParseDuration doesn't support 'd'.
	// We'll implement simple logic or just assume 30 days.
	expiration := time.Hour * 24 * 30

	claims := jwt.MapClaims{
		"id":    userId,
		"email": email,
		"exp":   time.Now().Add(expiration).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ParseToken validates a JWT token and returns the email
func ParseToken(tokenString string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "my_secret_key"
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		email, _ := claims["email"].(string)
		return email, nil
	}

	return "", jwt.ErrSignatureInvalid
}

// GetUserEmailFromContext retrieves the user email from context
func GetUserEmailFromContext(ctx context.Context) string {
	email, _ := ctx.Value(UserEmailKey).(string)
	return email
}

// SetUserEmailToContext adds user email to context
func SetUserEmailToContext(ctx context.Context, email string) context.Context {
	return context.WithValue(ctx, UserEmailKey, email)
}
