package handler

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"tixyou/backend/internal/database"
	"tixyou/backend/internal/model"
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

	// Organizer-only fields
	OrganizationName string `json:"organization_name"`
	OrganizerType    string `json:"organizer_type"`
	Phone            string `json:"phone"`
	City             string `json:"city"`
	PrimaryCategory  string `json:"primary_category"`
	Website          string `json:"website"`
}

func generateID(prefix string) string {
	bytes := make([]byte, 8)
	rand.Read(bytes)
	return prefix + "_" + hex.EncodeToString(bytes)
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

	// If Database is connected, query from DB
	if database.DB != nil {
		var user model.User
		if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Email atau password salah.",
			})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Email atau password salah.",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Login berhasil!",
			"data": gin.H{
				"token": "jwt_token_" + user.ID,
				"user": gin.H{
					"id":         user.ID,
					"name":       user.Name,
					"email":      user.Email,
					"role":       user.Role,
					"created_at": user.CreatedAt,
				},
			},
		})
		return
	}

	// Fallback mock authentication if DB not connected yet
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login berhasil (mode demo/offline DB)!",
		"data": gin.H{
			"token": "mock_jwt_token_tixyou_2026",
			"user": gin.H{
				"id":         "usr_demo",
				"name":       "Demo User",
				"email":      req.Email,
				"role":       "attendee",
				"created_at": time.Now(),
			},
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

	if req.Role == "organizer" && (req.OrganizationName == "" || req.Phone == "" || req.City == "") {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"success": false,
			"message": "Data organizer belum lengkap (organization_name, phone, city).",
		})
		return
	}

	// If Database is connected, store in PostgreSQL
	if database.DB != nil {
		var existingUser model.User
		if err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"message": "Email sudah terdaftar. Silakan login.",
			})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal mengenkripsi password.",
			})
			return
		}

		userID := generateID("usr")
		newUser := model.User{
			ID:           userID,
			Email:        req.Email,
			PasswordHash: string(hashedPassword),
			Name:         req.Name,
			Role:         req.Role,
			Phone:        req.Phone,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}

		if err := database.DB.Create(&newUser).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Gagal menyimpan akun ke database: " + err.Error(),
			})
			return
		}

		// If organizer, create organizer record
		if req.Role == "organizer" {
			organizer := model.Organizer{
				ID:               generateID("org"),
				UserID:           userID,
				OrganizationName: req.OrganizationName,
				OrganizerType:    req.OrganizerType,
				City:             req.City,
				PrimaryCategory:  req.PrimaryCategory,
				Website:          req.Website,
				CreatedAt:        time.Now(),
				UpdatedAt:        time.Now(),
			}
			database.DB.Create(&organizer)
		}

		c.JSON(http.StatusCreated, gin.H{
			"success": true,
			"message": "Akun berhasil dibuat di database Supabase! Silakan login.",
			"data": gin.H{
				"user": gin.H{
					"id":         newUser.ID,
					"name":       newUser.Name,
					"email":      newUser.Email,
					"role":       newUser.Role,
					"created_at": newUser.CreatedAt,
				},
			},
		})
		return
	}

	// Fallback mock response if DB not connected yet
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Akun berhasil dibuat (mode demo/offline DB)! Silakan login.",
		"data": gin.H{
			"user": gin.H{
				"id":         generateID("usr"),
				"name":       req.Name,
				"email":      req.Email,
				"role":       req.Role,
				"created_at": time.Now(),
			},
		},
	})
}
