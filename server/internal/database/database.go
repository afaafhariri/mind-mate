package database

import (
	"database/sql"
	"log/slog"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() {
	err := godotenv.Load()
	if err != nil {
		slog.Warn("Error loading .env file")
	}

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		slog.Error("DATABASE_URL environment variable is not set")
		os.Exit(1)
	}

	var dbErr error
	DB, dbErr = sql.Open("pgx", connStr)
	if dbErr != nil {
		slog.Error("Unable to connect to database", "error", dbErr)
		os.Exit(1)
	}

	err = DB.Ping()
	if err != nil {
		slog.Error("Unable to ping database", "error", err)
		os.Exit(1)
	}

	slog.Info("Connected to the database")

	createTables()
}

func createTables() {
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		date_of_birth DATE NOT NULL,
		city TEXT NOT NULL,
		country TEXT NOT NULL,
		profession TEXT NOT NULL,
		marital_status TEXT NOT NULL,
		income_frequency TEXT,
		income_amount NUMERIC,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := DB.Exec(createUsersTable)
	if err != nil {
		slog.Error("Unable to create users table", "error", err)
		os.Exit(1)
	}

	createOTPsTable := `
	CREATE TABLE IF NOT EXISTS otps (
		email TEXT PRIMARY KEY,
		code TEXT NOT NULL,
		expires_at TIMESTAMP NOT NULL
	);`

	_, err = DB.Exec(createOTPsTable)
	if err != nil {
		slog.Error("Unable to create otps table", "error", err)
		os.Exit(1)
	}

	slog.Info("Tables created successfully")
}
