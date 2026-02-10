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
	embedder   llms.Model // specific model for embeddings if different
	chatModel  string
	embedModel string
}

func NewRAGService() (*RAGService, error) {
	// Initialize Ollama LLM
	// We use the same client for now, but configured with different models per call if needed
	llm, err := ollama.New(ollama.WithModel("gemma:2b")) // Default chat model
	if err != nil {
		return nil, fmt.Errorf("failed to create ollama client: %w", err)
	}

	return &RAGService{
		llm:        llm,
		chatModel:  "gemma:2b",         // or phi3
		embedModel: "nomic-embed-text", // Standard embedding model
	}, nil
}

// GenerateEmbedding generates vector embeddings for the given text using Ollama
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

// Chat interacts with the LLM using the provided context
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

// SummarizeJournals generates a summary of the provided journal entries
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

// AnalyzePatterns identifies recurring themes or behaviors
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

// AnalyzeMood correlates topics with mood
func (s *RAGService) AnalyzeMood(ctx context.Context, content []string) (string, error) {
	if len(content) == 0 {
		return "No entries to analyze.", nil
	}

	joinedContent := strings.Join(content, "\n---\n")
	prompt := fmt.Sprintf(`Analyze the mood and emotional tone of these journal entries. 
Identify what topics are associated with positive moods and which with negative moods.

Entries:
%s

Mood Analysis:`, joinedContent)

	return llms.GenerateFromSinglePrompt(ctx, s.llm, prompt)
}

// WritingAssistant helps expand thoughts
func (s *RAGService) WritingAssistant(ctx context.Context, input string) (string, error) {
	prompt := fmt.Sprintf(`You are a writing assistant. The user is writing a journal entry but feels stuck or wants to expand on a thought.
Help them elaborate, ask prompting questions, or suggest a new perspective.

User Input: "%s"

Suggestion:`, input)

	return llms.GenerateFromSinglePrompt(ctx, s.llm, prompt)
}
