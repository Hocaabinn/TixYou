package database

import (
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"tixyou/backend/internal/model"
)

var DB *gorm.DB

// ConnectDB initializes the PostgreSQL connection (Supabase or other Postgres instance)
func ConnectDB(databaseURL string) (*gorm.DB, error) {
	if databaseURL == "" {
		log.Println("⚠️ DATABASE_URL is empty. Database connection skipped.")
		return nil, nil
	}

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	db, err := gorm.Open(postgres.Open(databaseURL), gormConfig)
	if err != nil {
		log.Printf("❌ Failed to connect to Supabase PostgreSQL: %v", err)
		return nil, err
	}

	// Configure connection pool
	sqlDB, err := db.DB()
	if err != nil {
		log.Printf("❌ Failed to get database instance: %v", err)
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("✅ Successfully connected to Supabase PostgreSQL!")

	// Auto-migrate tables
	err = db.AutoMigrate(
		&model.User{},
		&model.Organizer{},
		&model.Event{},
		&model.TicketType{},
		&model.Ticket{},
		&model.Order{},
	)
	if err != nil {
		log.Printf("⚠️ AutoMigrate error: %v", err)
	} else {
		log.Println("✅ Database schema migrated successfully!")
	}

	DB = db
	return db, nil
}
