package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	Env         string
	DatabaseURL string
	JWTSecret   string
}

func LoadConfig() *Config {
	// Try loading from .env file if available
	if err := godotenv.Load(); err != nil {
		log.Println("ℹ️ No .env file found, using system environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	env := os.Getenv("ENV")
	if env == "" {
		env = "development"
	}

	dbURL := os.Getenv("DATABASE_URL")

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "tixyou_default_jwt_secret_key_2026"
	}

	return &Config{
		Port:        port,
		Env:         env,
		DatabaseURL: dbURL,
		JWTSecret:   jwtSecret,
	}
}
