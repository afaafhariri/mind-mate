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
	"mind-mate-server/internal/service"
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

	db.InitPostgres()
	defer db.ClosePostgres()

	if err := db.AutoMigrate(&model.User{}, &model.OTP{}, &model.Journal{}, &model.JournalImage{}, &model.JournalEmbedding{}); err != nil {
		log.Fatalf("Failed to auto-migrate: %v", err)
	}
	log.Println("Database migrations completed successfully")

	ragService, err := service.NewRAGService()
	if err != nil {
		log.Printf("Warning: Failed to initialize RAG service: %v. AI features will be disabled.", err)
	}
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}))

	router.GET("/system/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "healthy"})
	})
	authRoutes := router.Group("/api/auth")
	{
		authRoutes.POST("/signup", authHandler.Signup)
		authRoutes.POST("/login", authHandler.Login)
		authRoutes.POST("/verify-otp", authHandler.VerifyOTP)
	}

	media := router.Group("/api/media")
	{
		media.POST("/upload", authHandler.UploadMedia)
	}
	if ragService != nil {
		ragHandler := authHandler.NewRAGHandler(ragService)
		ragRoutes := router.Group("/api/rag")
		ragRoutes.Use(auth.AuthMiddleware())
		{
			ragRoutes.POST("/chat", ragHandler.Chat)
			ragRoutes.POST("/summary", ragHandler.Summary)
			ragRoutes.POST("/pattern", ragHandler.PatternRecognition)
			ragRoutes.POST("/mood", ragHandler.MoodAnalysis)
			ragRoutes.POST("/insights", ragHandler.GetMentalHealthInsights)
			ragRoutes.POST("/assistant", ragHandler.WritingAssistant)
		}
	}

	router.Static("/uploads", "./uploads")

	resolver := &graph.Resolver{
		RAGService: ragService,
	}

	gqlServer := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: resolver}))

	router.GET("/", func(c *gin.Context) {
		playground.Handler("GraphQL playground", "/graphql").ServeHTTP(c.Writer, c.Request)
	})

	router.POST("/graphql", func(c *gin.Context) {
		ctx := c.Request.Context()
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
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
	log.Printf("REST Auth endpoints: /api/auth/ ...")
	log.Printf("REST RAG endpoints: /api/rag/ ...")
	log.Printf("GraphQL playground: http://localhost:%s/", port)

	router.Run(":" + port)
}
