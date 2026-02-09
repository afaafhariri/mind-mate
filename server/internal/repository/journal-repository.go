package repository

import (
	"errors"
	"mind-mate-server/internal/db"
	"mind-mate-server/internal/model"

	"gorm.io/gorm"
)

// CreateJournal creates a new journal with optional images
func CreateJournal(userID uint, topic, body string, fontHeading, fontSubheading, fontBody, fontMono *string, imageUrls []string) (*model.Journal, error) {
	journal := model.Journal{
		UserID:         userID,
		Topic:          topic,
		Body:           body,
		FontHeading:    fontHeading,
		FontSubheading: fontSubheading,
		FontBody:       fontBody,
		FontMono:       fontMono,
	}

	// Start transaction
	tx := db.DB.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	// Create journal
	if err := tx.Create(&journal).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create images if provided
	if len(imageUrls) > 0 {
		for i, url := range imageUrls {
			image := model.JournalImage{
				JournalID: journal.ID,
				URL:       url,
				SortOrder: i,
			}
			if err := tx.Create(&image).Error; err != nil {
				tx.Rollback()
				return nil, err
			}
		}
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	// Reload with images
	if err := db.DB.Preload("Images").First(&journal, journal.ID).Error; err != nil {
		return nil, err
	}

	return &journal, nil
}

// GetJournalsByUserID returns all journals for a user with optional sorting
func GetJournalsByUserID(userID uint, sortBy *string) ([]model.Journal, error) {
	var journals []model.Journal

	// Determine sort order
	orderClause := "created_at DESC" // default: newest first
	if sortBy != nil {
		switch *sortBy {
		case "OLDEST_FIRST":
			orderClause = "created_at ASC"
		case "ALPHABETICAL":
			orderClause = "topic ASC"
		case "NEWEST_FIRST":
			orderClause = "created_at DESC"
		}
	}

	result := db.DB.Where("user_id = ?", userID).
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		Order(orderClause).
		Find(&journals)
	return journals, result.Error
}

// GetJournalByID returns a journal by ID
func GetJournalByID(id uint) (*model.Journal, error) {
	var journal model.Journal
	result := db.DB.Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("sort_order ASC")
	}).First(&journal, id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if result.Error != nil {
		return nil, result.Error
	}
	return &journal, nil
}

// UpdateJournal updates a journal
func UpdateJournal(id uint, topic, body string, fontHeading, fontSubheading, fontBody, fontMono *string, imageUrls []string) (*model.Journal, error) {
	var journal model.Journal
	if err := db.DB.First(&journal, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("journal not found")
		}
		return nil, err
	}

	tx := db.DB.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	// Update journal fields
	journal.Topic = topic
	journal.Body = body
	journal.FontHeading = fontHeading
	journal.FontSubheading = fontSubheading
	journal.FontBody = fontBody
	journal.FontMono = fontMono

	if err := tx.Save(&journal).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Delete existing images and recreate
	if err := tx.Where("journal_id = ?", id).Delete(&model.JournalImage{}).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// Create new images
	if len(imageUrls) > 0 {
		for i, url := range imageUrls {
			image := model.JournalImage{
				JournalID: id,
				URL:       url,
				SortOrder: i,
			}
			if err := tx.Create(&image).Error; err != nil {
				tx.Rollback()
				return nil, err
			}
		}
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	// Reload with images
	if err := db.DB.Preload("Images").First(&journal, id).Error; err != nil {
		return nil, err
	}

	return &journal, nil
}

// DeleteJournal deletes a journal by ID
func DeleteJournal(id uint) error {
	result := db.DB.Delete(&model.Journal{}, id)
	if result.RowsAffected == 0 {
		return errors.New("journal not found")
	}
	return result.Error
}
