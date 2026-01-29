package repository

import (
	"context"
	"fmt"
	"mind-mate-server/graph/model"
	"mind-mate-server/internal/db"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func CreateUser(ctx context.Context, email string, firstName string, lastName string, dateOfBirth string, city string, country string, profession string, maritalStatus string) error {
	docRef := db.Client.Collection("users").Doc(email)

	// Check if already exists
	_, err := docRef.Get(ctx)
	if err == nil {
		return fmt.Errorf("user with this email already exists")
	}
	if status.Code(err) != codes.NotFound {
		return err
	}

	_, err = docRef.Set(ctx, map[string]interface{}{
		"email":         email,
		"firstName":     firstName,
		"lastName":      lastName,
		"dateOfBirth":   dateOfBirth,
		"city":          city,
		"country":       country,
		"profession":    profession,
		"maritalStatus": maritalStatus,
		"createdAt":     time.Now(),
		"updatedAt":     time.Now(),
	})
	return err
}

func GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	doc, err := db.Client.Collection("users").Doc(email).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, nil // Not found
		}
		return nil, err
	}

	data := doc.Data()
	return &model.User{
		Email:         getString(data, "email"),
		FirstName:     getString(data, "firstName"),
		LastName:      getString(data, "lastName"),
		DateOfBirth:   getStringPtr(data, "dateOfBirth"),
		City:          getStringPtr(data, "city"),
		Country:       getStringPtr(data, "country"),
		Profession:    getStringPtr(data, "profession"),
		MaritalStatus: getStringPtr(data, "maritalStatus"),
	}, nil
}

func getString(data map[string]interface{}, key string) string {
	if v, ok := data[key].(string); ok {
		return v
	}
	return ""
}

func getStringPtr(data map[string]interface{}, key string) *string {
	if v, ok := data[key].(string); ok {
		return &v
	}
	return nil
}
