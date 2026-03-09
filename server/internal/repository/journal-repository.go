package repository

import (
	"errors"

	"mind-mate-server/internal/db"
	"mind-mate-server/internal/model"
	"mind-mate-server/internal/service"

	"gorm.io/gorm"
)

func CreateJournal(userID uint, topic, body string, fontHeading, fontSubheading, fontBody, fontMono *string, imageUrls []string, metrics *service.JournalMetrics) (*model.Journal, error) {
	journal := model.Journal{
		UserID:         userID,
		Topic:          topic,
		Body:           body,
		FontHeading:    fontHeading,
		FontSubheading: fontSubheading,
		FontBody:       fontBody,
		FontMono:       fontMono,
	}

	if metrics != nil {
		journal.MoodScore = metrics.MoodScore
		journal.AnxietyLevel = metrics.AnxietyLevel
		journal.SleepQuality = metrics.SleepQuality
		journal.Condition = metrics.Condition
		journal.PrimaryEmotion = metrics.PrimaryEmotion
		journal.Triggers = metrics.Triggers
		journal.SummaryText = metrics.SummaryText
	}

	tx := db.DB.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}
	if err := tx.Create(&journal).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

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

	if err := db.DB.Preload("Images").First(&journal, journal.ID).Error; err != nil {
		return nil, err
	}

	return &journal, nil
}

func GetJournalsByUserID(userID uint, sortBy *string) ([]model.Journal, error) {
	var journals []model.Journal

	orderClause := "created_at DESC"
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

func UpdateJournal(id uint, topic, body string, fontHeading, fontSubheading, fontBody, fontMono *string, imageUrls []string, metrics *service.JournalMetrics) (*model.Journal, error) {
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

	journal.Topic = topic
	journal.Body = body
	journal.FontHeading = fontHeading
	journal.FontSubheading = fontSubheading
	journal.FontBody = fontBody
	journal.FontMono = fontMono

	if metrics != nil {
		journal.MoodScore = metrics.MoodScore
		journal.AnxietyLevel = metrics.AnxietyLevel
		journal.SleepQuality = metrics.SleepQuality
		journal.Condition = metrics.Condition
		journal.PrimaryEmotion = metrics.PrimaryEmotion
		journal.Triggers = metrics.Triggers
		journal.SummaryText = metrics.SummaryText
	}

	if err := tx.Save(&journal).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := tx.Where("journal_id = ?", id).Delete(&model.JournalImage{}).Error; err != nil {
		tx.Rollback()
		return nil, err
	}
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

	if err := db.DB.Preload("Images").First(&journal, id).Error; err != nil {
		return nil, err
	}

	return &journal, nil
}

func DeleteJournal(id uint) error {
	result := db.DB.Delete(&model.Journal{}, id)
	if result.RowsAffected == 0 {
		return errors.New("journal not found")
	}
	return result.Error
}
