package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type WelcomeMessage struct {
	App     string   `json:"app"`
	Version string   `json:"version"`
	Features []string `json:"features"`
}

func WelcomeHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": WelcomeMessage{
			App:     "TixYou API Service",
			Version: "1.0.0",
			Features: []string{
				"Authentication & Authorization",
				"Event Ticketing & Management",
				"Real-time Updates",
			},
		},
	})
}
