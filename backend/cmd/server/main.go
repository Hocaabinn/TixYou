package main

import (
	"fmt"
	"log"

	"tixyou/backend/internal/config"
	"tixyou/backend/internal/router"
)

func main() {
	cfg := config.LoadConfig()

	r := router.SetupRouter()

	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🚀 TixYou Go Backend server starting on http://localhost%s", serverAddr)
	log.Printf("📡 Environment: %s", cfg.Env)

	if err := r.Run(serverAddr); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}
