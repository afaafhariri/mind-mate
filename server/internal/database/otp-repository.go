package database

import (
	"time"
)

func SaveOTP(email, code string) error {
	query := `
		INSERT INTO otps (email, code, expires_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (email) DO UPDATE SET
			code = EXCLUDED.code,
			expires_at = EXCLUDED.expires_at
	`
	expiresAt := time.Now().Add(10 * time.Minute)
	_, err := DB.Exec(query, email, code, expiresAt)
	return err
}

func VerifyOTP(email, code string) (bool, error) {
	query := `SELECT code, expires_at FROM otps WHERE email = $1`
	row := DB.QueryRow(query, email)

	var storedCode string
	var expiresAt time.Time

	err := row.Scan(&storedCode, &expiresAt)
	if err != nil {
		return false, err
	}

	if time.Now().After(expiresAt) {
		return false, nil
	}

	if storedCode != code {
		return false, nil
	}

	// Delete OTP after successful verification
	_, _ = DB.Exec("DELETE FROM otps WHERE email = $1", email)

	return true, nil
}
