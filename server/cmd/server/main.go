package main

import (
	"log"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"mind-mate-server/graph"
	"mind-mate-server/internal/db"
	authHandler "mind-mate-server/internal/handler"
	"mind-mate-server/internal/model"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	// Initialize PostgreSQL with GORM
	db.InitPostgres()
	defer db.ClosePostgres()

	// Auto-migrate models
	if err := db.AutoMigrate(&model.User{}, &model.OTP{}); err != nil {
		log.Fatalf("Failed to auto-migrate: %v", err)
	}
	log.Println("Database migrations completed successfully")

	// Create Gin router
	router := gin.Default()

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}))

	// Health check
	router.GET("/system/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})

	// REST Auth routes
	auth := router.Group("/api/auth")
	{
		auth.POST("/signup", authHandler.Signup)
		auth.POST("/login", authHandler.Login)
		auth.POST("/verify-otp", authHandler.VerifyOTP)
	}

	// GraphQL routes (kept for future use)
	gqlServer := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	router.GET("/", func(c *gin.Context) {
		playground.Handler("GraphQL playground", "/graphql").ServeHTTP(c.Writer, c.Request)
	})

	router.POST("/graphql", func(c *gin.Context) {
		gqlServer.ServeHTTP(c.Writer, c.Request)
	})

	log.Printf("Server running at http://localhost:%s/", port)
	log.Printf("REST Auth endpoints: /api/auth/signup, /api/auth/login, /api/auth/verify-otp")
	log.Printf("GraphQL playground: http://localhost:%s/", port)

	router.Run(":" + port)
}
