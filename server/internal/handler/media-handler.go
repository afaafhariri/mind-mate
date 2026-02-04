package handler

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const uploadDir = "./uploads"

func init() {
	// Create uploads directory if it doesn't exist
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		panic(fmt.Sprintf("Failed to create uploads directory: %v", err))
	}
}

// UploadMedia handles file uploads
func UploadMedia(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
		return
	}
	defer file.Close()

	// Validate file type
	contentType := header.Header.Get("Content-Type")
	if !isAllowedMediaType(contentType) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Allowed: images (jpg, png, gif, webp)"})
		return
	}

	// Generate unique filename
	ext := filepath.Ext(header.Filename)
	if ext == "" {
		ext = getExtensionFromContentType(contentType)
	}
	filename := fmt.Sprintf("%d-%s%s", time.Now().UnixNano(), uuid.New().String()[:8], ext)
	filePath := filepath.Join(uploadDir, filename)

	// Create destination file
	dst, err := os.Create(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}
	defer dst.Close()

	// Copy file content
	if _, err := io.Copy(dst, file); err != nil {
		os.Remove(filePath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Return URL
	fileURL := fmt.Sprintf("/uploads/%s", filename)
	c.JSON(http.StatusOK, gin.H{
		"url":      fileURL,
		"filename": filename,
	})
}

func isAllowedMediaType(contentType string) bool {
	allowedTypes := []string{
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
	}
	for _, t := range allowedTypes {
		if strings.HasPrefix(contentType, t) {
			return true
		}
	}
	return false
}

func getExtensionFromContentType(contentType string) string {
	switch contentType {
	case "image/jpeg":
		return ".jpg"
	case "image/png":
		return ".png"
	case "image/gif":
		return ".gif"
	case "image/webp":
		return ".webp"
	default:
		return ".bin"
	}
}
