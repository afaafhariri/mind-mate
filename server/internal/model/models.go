package model

import "time"

type User struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Email         string    `gorm:"uniqueIndex;not null;size:255" json:"email"`
	FirstName     string    `gorm:"not null;size:255" json:"firstName"`
	LastName      string    `gorm:"not null;size:255" json:"lastName"`
	DateOfBirth   *string   `gorm:"size:50" json:"dateOfBirth,omitempty"`
	City          *string   `gorm:"size:255" json:"city,omitempty"`
	Country       *string   `gorm:"size:255" json:"country,omitempty"`
	Profession    *string   `gorm:"size:255" json:"profession,omitempty"`
	MaritalStatus *string   `gorm:"size:50" json:"maritalStatus,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type OTP struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Email     string    `gorm:"index;not null;size:255" json:"email"`
	Code      string    `gorm:"not null;size:10" json:"code"`
	ExpiresAt time.Time `gorm:"not null" json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
}
