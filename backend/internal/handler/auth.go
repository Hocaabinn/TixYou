package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type SignUpRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role"`
}

type UserProfile struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

func LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Payload login tidak valid. Pastikan email dan password terisi.",
		})
		return
	}

	// Demo user authentication logic
	user := UserProfile{
		ID:        "usr_1001",
		Name:      "Bintang",
		Email:     req.Email,
		Role:      "attendee",
		CreatedAt: time.Now(),
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login berhasil!",
		"data": gin.H{
			"token": "mock_jwt_token_tixyou_2026",
			"user":  user,
		},
	})
}

func SignUpHandler(c *gin.Context) {
	var req SignUpRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Payload registrasi tidak valid. Mohon lengkapi semua kolom.",
		})
		return
	}

	if req.Role == "" {
		req.Role = "attendee"
	}

	newUser := UserProfile{
		ID:        "usr_1002",
		Name:      req.Name,
		Email:     req.Email,
		Role:      req.Role,
		CreatedAt: time.Now(),
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Akun berhasil dibuat! Silakan login.",
		"data": gin.H{
			"user": newUser,
		},
	})
}
