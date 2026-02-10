package graph

import (
	"math/rand"
	"strconv"
	"time"

	"mind-mate-server/graph/model"
	dbmodel "mind-mate-server/internal/model"
)

func generateOTP() string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return strconv.Itoa(100000 + r.Intn(900000))
}

func parseUint(id string) (uint, error) {
	parsed, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		return 0, err
	}
	return uint(parsed), nil
}

func convertJournalToGraphQL(j *dbmodel.Journal) *model.Journal {
	id := strconv.FormatUint(uint64(j.ID), 10)

	images := make([]*model.JournalImage, len(j.Images))
	for i, img := range j.Images {
		imgID := strconv.FormatUint(uint64(img.ID), 10)
		images[i] = &model.JournalImage{
			ID:        imgID,
			URL:       img.URL,
			SortOrder: int32(img.SortOrder),
		}
	}

	var fontSettings *model.FontSettings
	if j.FontHeading != nil || j.FontSubheading != nil || j.FontBody != nil || j.FontMono != nil {
		fontSettings = &model.FontSettings{
			Heading:    j.FontHeading,
			Subheading: j.FontSubheading,
			Body:       j.FontBody,
			Mono:       j.FontMono,
		}
	}

	createdAt := j.CreatedAt.Format(time.RFC3339)
	updatedAt := j.UpdatedAt.Format(time.RFC3339)

	return &model.Journal{
		ID:           id,
		Topic:        j.Topic,
		Body:         j.Body,
		FontSettings: fontSettings,
		Images:       images,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
	}
}
