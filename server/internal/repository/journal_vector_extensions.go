package repository

import (
	"time"

	"mind-mate-server/internal/db"
	"mind-mate-server/internal/model"

	"github.com/pgvector/pgvector-go"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// UpdateJournalEmbedding updates or creates the embedding for a journal
func UpdateJournalEmbedding(journalID uint, embedding []float32) error {
	vector := pgvector.NewVector(embedding)
	journalEmbedding := model.JournalEmbedding{
		JournalID: journalID,
		Embedding: vector,
	}

	// Upsert: On conflict update embedding
	result := db.DB.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "journal_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"embedding"}),
	}).Create(&journalEmbedding)

	return result.Error
}

// SearchSimilarJournals finds journals similar to the query embedding
// It joins with journals table to return full journal objects
func SearchSimilarJournals(userID uint, embedding []float32, limit int) ([]model.Journal, error) {
	var journals []model.Journal
	vector := pgvector.NewVector(embedding)

	err := db.DB.Table("journals").
		Select("journals.*").
		Joins("JOIN journal_embeddings ON journals.id = journal_embeddings.journal_id").
		Where("journals.user_id = ?", userID).
		Order(gorm.Expr("journal_embeddings.embedding <-> ?", vector)).
		Limit(limit).
		Find(&journals).Error

	return journals, err
}

// GetJournalsByDateRange returns journals within a specific date range
func GetJournalsByDateRange(userID uint, startDate, endDate time.Time) ([]model.Journal, error) {
	var journals []model.Journal
	err := db.DB.Where("user_id = ? AND created_at BETWEEN ? AND ?", userID, startDate, endDate).
		Order("created_at ASC").
		Find(&journals).Error
	return journals, err
}
