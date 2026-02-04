package model

import "time"

// Journal represents a user's journal entry
type Journal struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	UserID         uint           `gorm:"index;not null" json:"userId"`
	Topic          string         `gorm:"not null;size:500" json:"topic"`
	Body           string         `gorm:"type:text;not null" json:"body"`
	FontHeading    *string        `gorm:"size:100" json:"fontHeading,omitempty"`
	FontSubheading *string        `gorm:"size:100" json:"fontSubheading,omitempty"`
	FontBody       *string        `gorm:"size:100" json:"fontBody,omitempty"`
	FontMono       *string        `gorm:"size:100" json:"fontMono,omitempty"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	Images         []JournalImage `gorm:"foreignKey:JournalID;constraint:OnDelete:CASCADE" json:"images"`
	User           User           `gorm:"foreignKey:UserID" json:"-"`
}

// JournalImage represents an image attached to a journal
type JournalImage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	JournalID uint      `gorm:"index;not null" json:"journalId"`
	URL       string    `gorm:"not null;size:500" json:"url"`
	SortOrder int       `gorm:"default:0" json:"sortOrder"`
	CreatedAt time.Time `json:"createdAt"`
}
