package main

import (
	"fmt"
	"mind-mate-server/internal/database"
	"mind-mate-server/internal/email"
	"mind-mate-server/internal/logger"
	"mind-mate-server/internal/server"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	log := logger.New()

	database.InitDB()

	emailService := email.NewSMTPService()

	server := server.NewServer(log, emailService)

	log.Info("Server listening on port 8080")
	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
