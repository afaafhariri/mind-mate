package model

import (
	"time"

	"github.com/pgvector/pgvector-go"
)

type Journal struct {
	ID             uint             `gorm:"primaryKey" json:"id"`
	UserID         uint             `gorm:"index;not null" json:"userId"`
	Topic          string           `gorm:"not null;size:500" json:"topic"`
	Body           string           `gorm:"type:text;not null" json:"body"`
	FontHeading    *string          `gorm:"size:100" json:"fontHeading,omitempty"`
	FontSubheading *string          `gorm:"size:100" json:"fontSubheading,omitempty"`
	FontBody       *string          `gorm:"size:100" json:"fontBody,omitempty"`
	FontMono       *string          `gorm:"size:100" json:"fontMono,omitempty"`
	CreatedAt      time.Time        `json:"createdAt"`
	UpdatedAt      time.Time        `json:"updatedAt"`
	Images         []JournalImage   `gorm:"foreignKey:JournalID;constraint:OnDelete:CASCADE" json:"images"`
	User           User             `gorm:"foreignKey:UserID" json:"-"`
	Embedding      JournalEmbedding `gorm:"foreignKey:JournalID;constraint:OnDelete:CASCADE" json:"-"`
}

type JournalImage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	JournalID uint      `gorm:"index;not null" json:"journalId"`
	URL       string    `gorm:"not null;size:500" json:"url"`
	SortOrder int       `gorm:"default:0" json:"sortOrder"`
	CreatedAt time.Time `json:"createdAt"`
}

type JournalEmbedding struct {
	ID        uint            `gorm:"primaryKey" json:"id"`
	JournalID uint            `gorm:"uniqueIndex;not null" json:"journalId"`
	Embedding pgvector.Vector `gorm:"type:vector(768)" json:"embedding"`
	CreatedAt time.Time       `json:"createdAt"`
}
