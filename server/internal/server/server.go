package server

import (
	"fmt"
	"log/slog"
	"net/http"
	"time"
)

type Server struct {
	port   int
	logger *slog.Logger
}

func NewServer(logger *slog.Logger) *http.Server {
	port := 8080
	NewServer := &Server{
		port:   port,
		logger: logger,
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
