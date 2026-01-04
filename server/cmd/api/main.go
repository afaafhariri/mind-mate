package main

import (
	"fmt"
	"mind-mate-server/internal/database"
	"mind-mate-server/internal/logger"
	"mind-mate-server/internal/server"
)

func main() {
	log := logger.New()

	database.InitDB()

	server := server.NewServer(log)

	log.Info("Server listening on port 8080")
	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
