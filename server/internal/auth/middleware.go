package auth

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware validates the JWT token and sets the user email in the context
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Remove "Bearer " prefix if present
		tokenString := authHeader
		if len(authHeader) > 7 && strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = authHeader[7:]
		}

		email, err := ParseToken(tokenString)
		if err != nil || email == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Set user email in context
		// Set it in both Gin context (for handlers using c.Get) and request context (for handlers using c.Request.Context())
		c.Set("userEmail", email)

		// Update request context for functions relying on context.Context (like GetUserEmailFromContext)
		ctx := SetUserEmailToContext(c.Request.Context(), email)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}
