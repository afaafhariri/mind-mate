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
	"mind-mate-server/internal/auth"
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
	if err := db.AutoMigrate(&model.User{}, &model.OTP{}, &model.Journal{}, &model.JournalImage{}); err != nil {
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
	authRoutes := router.Group("/api/auth")
	{
		authRoutes.POST("/signup", authHandler.Signup)
		authRoutes.POST("/login", authHandler.Login)
		authRoutes.POST("/verify-otp", authHandler.VerifyOTP)
	}

	// REST Media routes
	media := router.Group("/api/media")
	{
		media.POST("/upload", authHandler.UploadMedia)
	}

	// Serve uploaded files
	router.Static("/uploads", "./uploads")

	// GraphQL routes (kept for future use)
	gqlServer := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	router.GET("/", func(c *gin.Context) {
		playground.Handler("GraphQL playground", "/graphql").ServeHTTP(c.Writer, c.Request)
	})

	router.POST("/graphql", func(c *gin.Context) {
		// Extract JWT from Authorization header and set user email in context
		ctx := c.Request.Context()
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			// Remove "Bearer " prefix if present
			tokenString := authHeader
			if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				tokenString = authHeader[7:]
			}
			if email, err := auth.ParseToken(tokenString); err == nil && email != "" {
				ctx = auth.SetUserEmailToContext(ctx, email)
			}
		}
		c.Request = c.Request.WithContext(ctx)
		gqlServer.ServeHTTP(c.Writer, c.Request)
	})

	log.Printf("Server running at http://localhost:%s/", port)
	log.Printf("REST Auth endpoints: /api/auth/signup, /api/auth/login, /api/auth/verify-otp")
	log.Printf("GraphQL playground: http://localhost:%s/", port)

	router.Run(":" + port)
}
