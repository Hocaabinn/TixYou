package main

import (
	"fmt"
	"log"

	"tixyou/backend/internal/config"
	"tixyou/backend/internal/database"
	"tixyou/backend/internal/router"
)

func main() {
	cfg := config.LoadConfig()

	// Connect to Database (Supabase PostgreSQL)
	if cfg.DatabaseURL != "" {
		if _, err := database.ConnectDB(cfg.DatabaseURL); err != nil {
			log.Printf("⚠️ Database connection error: %v (Continuing in fallback mode)", err)
		}
	} else {
		log.Println("ℹ️ Tip: Isi DATABASE_URL di backend/.env untuk mengaktifkan koneksi Supabase.")
	}

	r := router.SetupRouter()

	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🚀 TixYou Go Backend server starting on http://localhost%s", serverAddr)
	log.Printf("📡 Environment: %s", cfg.Env)

	if err := r.Run(serverAddr); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}
