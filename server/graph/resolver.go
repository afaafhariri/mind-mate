package graph

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require
// here.

import "mind-mate-server/internal/service"

type Resolver struct {
	RAGService *service.RAGService
}
