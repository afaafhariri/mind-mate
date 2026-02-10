package repository

import (
	"errors"
	"mind-mate-server/internal/db"
	"mind-mate-server/internal/model"

	gqlmodel "mind-mate-server/graph/model"

	"gorm.io/gorm"
)

func CreateUser(email string, firstName string, lastName string, dateOfBirth string, city string, country string, profession string, maritalStatus string) error {
	var existingUser model.User
	result := db.DB.Where("email = ?", email).First(&existingUser)
	if result.Error == nil {
		return errors.New("user with this email already exists")
	}
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return result.Error
	}

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

func UpdateUser(email string, firstName, lastName, dateOfBirth, city, country, profession, maritalStatus *string) (*gqlmodel.User, error) {
	var user model.User
	result := db.DB.Where("email = ?", email).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("user not found")
	}
	if result.Error != nil {
		return nil, result.Error
	}

	if firstName != nil {
		user.FirstName = *firstName
	}
	if lastName != nil {
		user.LastName = *lastName
	}
	if dateOfBirth != nil {
		user.DateOfBirth = dateOfBirth
	}
	if city != nil {
		user.City = city
	}
	if country != nil {
		user.Country = country
	}
	if profession != nil {
		user.Profession = profession
	}
	if maritalStatus != nil {
		user.MaritalStatus = maritalStatus
	}

	if err := db.DB.Save(&user).Error; err != nil {
		return nil, err
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

func UpdateUserEmail(oldEmail, newEmail string) (*gqlmodel.User, error) {
	var existingUser model.User
	result := db.DB.Where("email = ?", newEmail).First(&existingUser)
	if result.Error == nil {
		return nil, errors.New("email already in use")
	}
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, result.Error
	}

	var user model.User
	result = db.DB.Where("email = ?", oldEmail).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, errors.New("user not found")
	}
	if result.Error != nil {
		return nil, result.Error
	}

	user.Email = newEmail
	if err := db.DB.Save(&user).Error; err != nil {
		return nil, err
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
