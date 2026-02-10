package service

import (
	"context"
	"fmt"
	"strings"

	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
)

type RAGService struct {
	llm        llms.Model
	embedder   llms.Model
	chatModel  string
	embedModel string
}

func NewRAGService() (*RAGService, error) {
	llm, err := ollama.New(ollama.WithModel("gemma:2b"))
	if err != nil {
		return nil, fmt.Errorf("failed to create ollama client: %w", err)
	}

	return &RAGService{
		llm:        llm,
		chatModel:  "gemma:2b",
		embedModel: "nomic-embed-text",
	}, nil
}
func (s *RAGService) GenerateEmbedding(ctx context.Context, text string) ([]float32, error) {
	// We need a separate client or configuration for embedding if the main one is for chat
	// For simplicity with langchaingo, we can try to use the same client or create a new one for embedding
	embedLLM, err := ollama.New(ollama.WithModel("nomic-embed-text"))
	if err != nil {
		return nil, err
	}

	embeddings, err := embedLLM.CreateEmbedding(ctx, []string{text})
	if err != nil {
		return nil, err
	}

	if len(embeddings) == 0 {
		return nil, fmt.Errorf("no embeddings generated")
	}

	return embeddings[0], nil
}

func (s *RAGService) Chat(ctx context.Context, query string, contextDocs []string) (string, error) {
	contextBlob := strings.Join(contextDocs, "\n\n")
	prompt := fmt.Sprintf(`You are a helpful AI assistant for a personal journal.
Use the following journal entries as context to answer the user's question.
If the answer is not in the context, say you don't know based on the journal, but you can offer general advice if applicable.

Context:
%s

User Question: %s
Answer:`, contextBlob, query)

	completion, err := llms.GenerateFromSinglePrompt(ctx, s.llm, prompt)
	if err != nil {
		return "", err
	}
	return completion, nil
}
func (s *RAGService) SummarizeJournals(ctx context.Context, content []string, period string) (string, error) {
	if len(content) == 0 {
		return "No journal entries found for this period.", nil
	}

	joinedContent := strings.Join(content, "\n---\n")
	prompt := fmt.Sprintf(`You are a thoughtful assistant.
Summarize the following %s journal entries. Focus on key events, emotional themes, and achievements.

Entries:
%s

Summary:`, period, joinedContent)

	return llms.GenerateFromSinglePrompt(ctx, s.llm, prompt)
}

func (s *RAGService) AnalyzePatterns(ctx context.Context, content []string) (string, error) {
	if len(content) == 0 {
		return "Not enough data to analyze patterns.", nil
	}

	joinedContent := strings.Join(content, "\n---\n")
	prompt := fmt.Sprintf(`Analyze the following journal entries for recurring behavioral patterns, triggers, or emotional cycles.
Be constructive and insightful.

Entries:
%s

Analysis:`, joinedContent)

	return llms.GenerateFromSinglePrompt(ctx, s.llm, prompt)
}

// MoodAnalysisResult represents the structure for mood data
type MoodAnalysisResult struct {
	Moods []MoodPoint `json:"moods"`
}

type MoodPoint struct {
	Date  string `json:"date"`
	Mood  string `json:"mood"`
	Score int    `json:"score"` // 1-10 scale
}

// InsightsResult represents mental health insights
type InsightsResult struct {
	Condition string   `json:"condition"` // Great, Good, Bad, Severe
	Summary   string   `json:"summary"`
	Triggers  []string `json:"triggers"`
}

func (s *RAGService) AnalyzeMood(ctx context.Context, content []string) (string, error) {
	if len(content) == 0 {
		return "{}", nil
	}

	joinedContent := strings.Join(content, "\n---\n")
	prompt := fmt.Sprintf(`Analyze the mood of these journal entries.
Return a JSON object with a list of "moods". Each item should have:
- "date" (YYYY-MM-DD from the entry if available, or sequential)
- "mood" (one word)
- "score" (integer 1-10, where 1 is severe distress and 10 is excellent)

Entries:
%s

Output JSON only:`, joinedContent)

	return llms.GenerateFromSinglePrompt(ctx, s.llm, prompt)
}

func (s *RAGService) GetMentalHealthInsights(ctx context.Context, content []string) (string, error) {
	if len(content) == 0 {
		return "{}", nil
	}

	joinedContent := strings.Join(content, "\n---\n")
	prompt := fmt.Sprintf(`Analyze the overall mental health from these entries.
Return a JSON object with:
- "condition": One of "Great", "Good", "Bad", "Severe"
- "summary": A brief 1-2 sentence overview.
- "triggers": A list of strings identifying potential negative triggers.

Entries:
%s

Output JSON only:`, joinedContent)

	return llms.GenerateFromSinglePrompt(ctx, s.llm, prompt)
}

func (s *RAGService) WritingAssistant(ctx context.Context, input string) (string, error) {
	prompt := fmt.Sprintf(`You are a writing assistant. The user is writing a journal entry but feels stuck or wants to expand on a thought.
Help them elaborate, ask prompting questions, or suggest a new perspective.

User Input: "%s"

Suggestion:`, input)

	return llms.GenerateFromSinglePrompt(ctx, s.llm, prompt)
}
