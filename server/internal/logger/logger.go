package logger

import (
"log/slog"
"os"
)

func New() *slog.Logger {
	opts := &slog.HandlerOptions{
		Level: slog.LevelDebug,
	}
	
	// Use JSON handler for structured logging
	handler := slog.NewJSONHandler(os.Stdout, opts)
	
	logger := slog.New(handler)
	
	slog.SetDefault(logger)
	
	return logger
}
