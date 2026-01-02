package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	var dbErr error
	DB, dbErr = sql.Open("pgx", connStr)
	if dbErr != nil {
		log.Fatalf("Unable to connect to database: %v\n", dbErr)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatalf("Unable to ping database: %v\n", err)
	}

	fmt.Println("Connected to the database")

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
		log.Fatalf("Unable to create users table: %v\n", err)
	}

	createOTPsTable := `
	CREATE TABLE IF NOT EXISTS otps (
		email TEXT PRIMARY KEY,
		code TEXT NOT NULL,
		expires_at TIMESTAMP NOT NULL
	);`

	_, err = DB.Exec(createOTPsTable)
	if err != nil {
		log.Fatalf("Unable to create otps table: %v\n", err)
	}

	fmt.Println("Tables created successfully")
}
