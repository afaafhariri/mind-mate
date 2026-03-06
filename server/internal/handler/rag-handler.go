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

	similarJournals, err := repository.SearchSimilarJournals(user.ID, queryEmbedding, 5)
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

	if len(journals) == 0 {
		c.JSON(http.StatusOK, gin.H{"summary": "No journal entries found for this period."})
		return
	}

	var summaryBuilder string
	for _, j := range journals {
		if j.SummaryText != "" {
			summaryBuilder += j.SummaryText + " "
		}
	}

	if summaryBuilder == "" {
		summaryBuilder = "You have journaled, but no detailed summaries have been extracted. Keep writing to build a stronger profile."
	}

	c.JSON(http.StatusOK, gin.H{"summary": summaryBuilder})
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

	if len(journals) == 0 {
		c.JSON(http.StatusOK, gin.H{"analysis": "Not enough data to analyze patterns."})
		return
	}

	var avgAnxiety, avgSleep, count int
	triggerMap := make(map[string]int)

	for _, j := range journals {
		avgAnxiety += j.AnxietyLevel
		avgSleep += j.SleepQuality
		count++
		for _, t := range j.Triggers {
			triggerMap[t]++
		}
	}

	if count > 0 {
		avgAnxiety /= count
		avgSleep /= count
	}

	analysis := "Based on your recent data, your average anxiety level is " + string(rune('0'+avgAnxiety)) + "/10 and average sleep quality is " + string(rune('0'+avgSleep)) + "/10. "

	if len(triggerMap) > 0 {
		analysis += "Common triggers include: "
		for t := range triggerMap {
			analysis += t + ", "
		}
	}

	c.JSON(http.StatusOK, gin.H{"analysis": analysis})
}

func (h *RAGHandler) MoodAnalysis(c *gin.Context) {
	var req struct {
		Period string `json:"period"`
	}
	c.ShouldBindJSON(&req)

	email := auth.GetUserEmailFromContext(c.Request.Context())
	user, err := repository.GetUserByEmail(email)
	if err != nil || user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	now := time.Now()
	var startDate time.Time

	switch req.Period {
	case "7d":
		startDate = now.AddDate(0, 0, -7)
	case "14d":
		startDate = now.AddDate(0, 0, -14)
	case "30d":
		startDate = now.AddDate(0, 0, -30)
	case "3m":
		startDate = now.AddDate(0, -3, 0)
	case "6m":
		startDate = now.AddDate(0, -6, 0)
	case "1y":
		startDate = now.AddDate(-1, 0, 0)
	case "3y":
		startDate = now.AddDate(-3, 0, 0)
	case "5y":
		startDate = now.AddDate(-5, 0, 0)
	default:
		startDate = now.AddDate(0, 0, -7)
	}

	journals, err := repository.GetJournalsByDateRange(user.ID, startDate, now)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch journals"})
		return
	}

	type MoodPoint struct {
		Date         string `json:"date"`
		Mood         string `json:"mood"`
		Score        int    `json:"score"`
		AnxietyLevel int    `json:"anxiety_level"`
		SleepQuality int    `json:"sleep_quality"`
	}

	moods := make([]MoodPoint, 0, len(journals))
	for _, j := range journals {
		mood := j.PrimaryEmotion
		if mood == "" {
			mood = "neutral"
		}
		moods = append(moods, MoodPoint{
			Date:         j.CreatedAt.Format("2006-01-02"),
			Mood:         mood,
			Score:        j.MoodScore,
			AnxietyLevel: j.AnxietyLevel,
			SleepQuality: j.SleepQuality,
		})
	}

	output := map[string]interface{}{
		"moods": moods,
	}

	c.JSON(http.StatusOK, output)
}

func (h *RAGHandler) GetMentalHealthInsights(c *gin.Context) {
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

	if len(journals) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"condition": "Unknown",
			"summary":   "Not enough data.",
			"triggers":  []string{},
		})
		return
	}

	var greatCount, goodCount, badCount, severeCount int
	triggerSet := make(map[string]bool)

	for _, j := range journals {
		switch j.Condition {
		case "Great":
			greatCount++
		case "Good":
			goodCount++
		case "Bad":
			badCount++
		case "Severe":
			severeCount++
		}
		for _, t := range j.Triggers {
			triggerSet[t] = true
		}
	}

	dominantCondition := "Good"
	maxCond := goodCount
	if greatCount > maxCond {
		dominantCondition = "Great"
		maxCond = greatCount
	}
	if badCount > maxCond {
		dominantCondition = "Bad"
		maxCond = badCount
	}
	if severeCount > maxCond {
		dominantCondition = "Severe"
	}

	triggers := make([]string, 0, len(triggerSet))
	for t := range triggerSet {
		triggers = append(triggers, t)
	}

	c.JSON(http.StatusOK, gin.H{
		"condition": dominantCondition,
		"summary":   "Your general condition has been mostly " + dominantCondition + " over the last 30 days.",
		"triggers":  triggers,
	})
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
