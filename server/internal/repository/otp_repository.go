package repository

import (
	"context"
	"mind-mate-server/internal/db"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func SaveOTP(ctx context.Context, email string, code string) error {
	expiresAt := time.Now().Add(10 * time.Minute)
	_, err := db.Client.Collection("otps").Doc(email).Set(ctx, map[string]interface{}{
		"email":     email,
		"code":      code,
		"expiresAt": expiresAt,
	})
	return err
}

func VerifyOTP(ctx context.Context, email string, code string) (bool, error) {
	docRef := db.Client.Collection("otps").Doc(email)
	doc, err := docRef.Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return false, nil
		}
		return false, err
	}

	data := doc.Data()

	// Check expiration
	expiresAtVal, ok := data["expiresAt"].(time.Time)
	if !ok {
		// Try cast to Timestamp? Firestore SDK usually returns time.Time for timestamps.
		// If not, it might be nil
		return false, nil
	}

	if expiresAtVal.Before(time.Now()) {
		docRef.Delete(ctx)
		return false, nil
	}

	storedCode, ok := data["code"].(string)
	if !ok || storedCode != code {
		return false, nil
	}

	// Valid OTP, delete it
	docRef.Delete(ctx)
	return true, nil
}
