package repository

import (
	"errors"
	"mind-mate-server/internal/db"
	"mind-mate-server/internal/model"

	gqlmodel "mind-mate-server/graph/model"

	"gorm.io/gorm"
)

func CreateUser(email string, firstName string, lastName string, dateOfBirth string, city string, country string, profession string, maritalStatus string) error {
	// Check if user already exists
	var existingUser model.User
	result := db.DB.Where("email = ?", email).First(&existingUser)
	if result.Error == nil {
		return errors.New("user with this email already exists")
	}
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return result.Error
	}

	// Create new user
	user := model.User{
		Email:         email,
		FirstName:     firstName,
		LastName:      lastName,
		DateOfBirth:   &dateOfBirth,
		City:          &city,
		Country:       &country,
		Profession:    &profession,
		MaritalStatus: &maritalStatus,
	}

	return db.DB.Create(&user).Error
}

// GetUserByEmail returns a User for REST handlers
func GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	result := db.DB.Where("email = ?", email).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil // Not found
	}
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

// GetUserByEmailForGraphQL returns a GraphQL User model
func GetUserByEmailForGraphQL(email string) (*gqlmodel.User, error) {
	var user model.User
	result := db.DB.Where("email = ?", email).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil // Not found
	}
	if result.Error != nil {
		return nil, result.Error
	}

	return &gqlmodel.User{
		Email:         user.Email,
		FirstName:     user.FirstName,
		LastName:      user.LastName,
		DateOfBirth:   user.DateOfBirth,
		City:          user.City,
		Country:       user.Country,
		Profession:    user.Profession,
		MaritalStatus: user.MaritalStatus,
	}, nil
}
