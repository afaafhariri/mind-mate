package server

import (
	"fmt"
	"log/slog"
	"mind-mate-server/internal/email"
	"net/http"
	"time"
)

type Server struct {
	port         int
	logger       *slog.Logger
	emailService email.Service
}

func NewServer(logger *slog.Logger, emailService email.Service) *http.Server {
	port := 8080
	NewServer := &Server{
		port:         port,
		logger:       logger,
		emailService: emailService,
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
