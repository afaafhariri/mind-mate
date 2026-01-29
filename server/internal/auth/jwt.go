package auth

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

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
