package handler

import (
	"mind-mate-server/internal/auth"
	"mind-mate-server/internal/repository"
	"mind-mate-server/internal/service"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type RAGHandler struct {
	Service *service.RAGService
}

func NewRAGHandler(service *service.RAGService) *RAGHandler {
	return &RAGHandler{Service: service}
}

func (h *RAGHandler) Chat(c *gin.Context) {
	var req struct {
		Query string `json:"query" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	email := auth.GetUserEmailFromContext(c.Request.Context())
	user, err := repository.GetUserByEmail(email)
	if err != nil || user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	queryEmbedding, err := h.Service.GenerateEmbedding(c.Request.Context(), req.Query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process query"})
		return
	}

	similarJournals, err := repository.SearchSimilarJournals(user.ID, queryEmbedding, 5) // Top 5
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search journals"})
		return
	}

	contextDocs := make([]string, len(similarJournals))
	for i, j := range similarJournals {
		contextDocs[i] = "Date: " + j.CreatedAt.Format("2006-01-02") + "\nTopic: " + j.Topic + "\nContent: " + j.Body
	}

	response, err := h.Service.Chat(c.Request.Context(), req.Query, contextDocs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate response"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"response": response})
}

func (h *RAGHandler) Summary(c *gin.Context) {
	var req struct {
		Period string `json:"period" binding:"required,oneof=weekly monthly yearly"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	email := auth.GetUserEmailFromContext(c.Request.Context())
	user, err := repository.GetUserByEmail(email)
	if err != nil || user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	now := time.Now()
	var startDate time.Time
	switch req.Period {
	case "weekly":
		startDate = now.AddDate(0, 0, -7)
	case "monthly":
		startDate = now.AddDate(0, -1, 0)
	case "yearly":
		startDate = now.AddDate(-1, 0, 0)
	}

	journals, err := repository.GetJournalsByDateRange(user.ID, startDate, now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch journals"})
		return
	}

	content := make([]string, len(journals))
	for i, j := range journals {
		content[i] = "Date: " + j.CreatedAt.Format("2006-01-02") + "\nTopic: " + j.Topic + "\nContent: " + j.Body
	}

	summary, err := h.Service.SummarizeJournals(c.Request.Context(), content, req.Period)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate summary"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"summary": summary})
}

func (h *RAGHandler) PatternRecognition(c *gin.Context) {
	email := auth.GetUserEmailFromContext(c.Request.Context())
	user, err := repository.GetUserByEmail(email)
	if err != nil || user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	startDate := time.Now().AddDate(0, 0, -30)
	journals, err := repository.GetJournalsByDateRange(user.ID, startDate, time.Now())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch journals"})
		return
	}

	content := make([]string, len(journals))
	for i, j := range journals {
		content[i] = "Date: " + j.CreatedAt.Format("2006-01-02") + "\nTopic: " + j.Topic + "\nContent: " + j.Body
	}

	analysis, err := h.Service.AnalyzePatterns(c.Request.Context(), content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze patterns"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"analysis": analysis})
}

// MoodAnalysis correlates topics with mood
func (h *RAGHandler) MoodAnalysis(c *gin.Context) {
	email := auth.GetUserEmailFromContext(c.Request.Context())
	user, err := repository.GetUserByEmail(email)
	if err != nil || user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Analyze last 30 days
	startDate := time.Now().AddDate(0, 0, -30)
	journals, err := repository.GetJournalsByDateRange(user.ID, startDate, time.Now())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch journals"})
		return
	}

	content := make([]string, len(journals))
	for i, j := range journals {
		content[i] = "Date: " + j.CreatedAt.Format("2006-01-02") + "\nTopic: " + j.Topic + "\nContent: " + j.Body
	}

	analysis, err := h.Service.AnalyzeMood(c.Request.Context(), content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to analyze mood"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"analysis": analysis})
}

func (h *RAGHandler) WritingAssistant(c *gin.Context) {
	var req struct {
		Input string `json:"input" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	suggestion, err := h.Service.WritingAssistant(c.Request.Context(), req.Input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate suggestion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"suggestion": suggestion})
}
