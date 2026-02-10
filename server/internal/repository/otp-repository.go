package repository

import (
	"errors"
	"mind-mate-server/internal/db"
	"mind-mate-server/internal/model"
	"time"

	"gorm.io/gorm"
)

func SaveOTP(email string, code string) error {
	expiresAt := time.Now().Add(10 * time.Minute)

	db.DB.Where("email = ?", email).Delete(&model.OTP{})

	otp := model.OTP{
		Email:     email,
		Code:      code,
		ExpiresAt: expiresAt,
	}

	return db.DB.Create(&otp).Error
}

func VerifyOTP(email string, code string) (bool, error) {
	var otp model.OTP
	result := db.DB.Where("email = ?", email).First(&otp)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return false, nil // No OTP found
	}
	if result.Error != nil {
		return false, result.Error
	}

	if otp.ExpiresAt.Before(time.Now()) {
		db.DB.Delete(&otp)
		return false, nil
	}

	if otp.Code != code {
		return false, nil
	}
	db.DB.Delete(&otp)
	return true, nil
}
