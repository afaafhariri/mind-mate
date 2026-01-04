package database

import (
	"database/sql"
	"time"
)

type User struct {
	ID              int       `json:"id"`
	FirstName       string    `json:"firstName"`
	LastName        string    `json:"lastName"`
	Email           string    `json:"email"`
	DateOfBirth     string    `json:"dateOfBirth"` // YYYY-MM-DD
	City            string    `json:"city"`
	Country         string    `json:"country"`
	Profession      string    `json:"profession"`
	MaritalStatus   string    `json:"maritalStatus"`
	IncomeFrequency string    `json:"incomeFrequency,omitempty"`
	IncomeAmount    float64   `json:"incomeAmount,omitempty"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

func CreateUser(user User) error {
	query := `
		INSERT INTO users (first_name, last_name, email, date_of_birth, city, country, profession, marital_status, income_frequency, income_amount, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
		ON CONFLICT (email) DO UPDATE SET
			first_name = EXCLUDED.first_name,
			last_name = EXCLUDED.last_name,
			date_of_birth = EXCLUDED.date_of_birth,
			city = EXCLUDED.city,
			country = EXCLUDED.country,
			profession = EXCLUDED.profession,
			marital_status = EXCLUDED.marital_status,
			income_frequency = EXCLUDED.income_frequency,
			income_amount = EXCLUDED.income_amount,
			updated_at = CURRENT_TIMESTAMP
	`
	_, err := DB.Exec(query, user.FirstName, user.LastName, user.Email, user.DateOfBirth, user.City, user.Country, user.Profession, user.MaritalStatus, user.IncomeFrequency, user.IncomeAmount)
	return err
}

func GetUserByEmail(email string) (*User, error) {
	query := `SELECT id, first_name, last_name, email, date_of_birth, city, country, profession, marital_status, income_frequency, income_amount, created_at, updated_at FROM users WHERE email = $1`
	row := DB.QueryRow(query, email)

	var user User
	var dob time.Time
	var incomeFreq sql.NullString
	var incomeAmt sql.NullFloat64

	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &dob, &user.City, &user.Country, &user.Profession, &user.MaritalStatus, &incomeFreq, &incomeAmt, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}

	user.DateOfBirth = dob.Format("2006-01-02")
	if incomeFreq.Valid {
		user.IncomeFrequency = incomeFreq.String
	}
	if incomeAmt.Valid {
		user.IncomeAmount = incomeAmt.Float64
	}

	return &user, nil
}
