package model

import (
	"time"

	"gorm.io/gorm"
)

// User represents application users (Attendees & Organizers)
type User struct {
	ID           string         `gorm:"primaryKey;type:varchar(64)" json:"id"`
	Email        string         `gorm:"uniqueIndex;type:varchar(191);not null" json:"email"`
	PasswordHash string         `gorm:"type:varchar(255);not null" json:"-"`
	Name         string         `gorm:"type:varchar(191);not null" json:"name"`
	Role         string         `gorm:"type:varchar(32);default:'attendee'" json:"role"` // attendee, organizer, admin
	AvatarURL    string         `gorm:"type:varchar(512)" json:"avatar_url,omitempty"`
	Phone        string         `gorm:"type:varchar(64)" json:"phone,omitempty"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	Organizer *Organizer `gorm:"foreignKey:UserID" json:"organizer,omitempty"`
	Tickets   []Ticket   `gorm:"foreignKey:OwnerID" json:"tickets,omitempty"`
}

// Organizer represents detailed organizer entity
type Organizer struct {
	ID               string    `gorm:"primaryKey;type:varchar(64)" json:"id"`
	UserID           string    `gorm:"uniqueIndex;type:varchar(64);not null" json:"user_id"`
	OrganizationName string    `gorm:"type:varchar(191);not null" json:"organization_name"`
	OrganizerType    string    `gorm:"type:varchar(64)" json:"organizer_type"` // personal, community, business
	City             string    `gorm:"type:varchar(128)" json:"city"`
	PrimaryCategory  string    `gorm:"type:varchar(64)" json:"primary_category"`
	Website          string    `gorm:"type:varchar(255)" json:"website,omitempty"`
	Verified         bool      `gorm:"default:false" json:"verified"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`

	// Relations
	Events []Event `gorm:"foreignKey:OrganizerID" json:"events,omitempty"`
}

// Event represents an event listed on TixYou
type Event struct {
	ID          string         `gorm:"primaryKey;type:varchar(64)" json:"id"`
	OrganizerID string         `gorm:"index;type:varchar(64);not null" json:"organizer_id"`
	Title       string         `gorm:"type:varchar(255);not null" json:"title"`
	Slug        string         `gorm:"uniqueIndex;type:varchar(255)" json:"slug"`
	Description string         `gorm:"type:text" json:"description"`
	Category    string         `gorm:"type:varchar(64);index" json:"category"` // Concert, Festival, Workshop, etc.
	BannerURL   string         `gorm:"type:varchar(512)" json:"banner_url"`
	Location    string         `gorm:"type:varchar(255)" json:"location"`
	City        string         `gorm:"type:varchar(128);index" json:"city"`
	Venue       string         `gorm:"type:varchar(255)" json:"venue"`
	StartDate   time.Time      `gorm:"index" json:"start_date"`
	EndDate     time.Time      `json:"end_date"`
	Status      string         `gorm:"type:varchar(32);default:'draft'" json:"status"` // draft, published, ended, cancelled
	IsFeatured  bool           `gorm:"default:false" json:"is_featured"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	TicketTypes []TicketType `gorm:"foreignKey:EventID" json:"ticket_types,omitempty"`
}

// TicketType represents ticket tier / category in an event
type TicketType struct {
	ID          string    `gorm:"primaryKey;type:varchar(64)" json:"id"`
	EventID     string    `gorm:"index;type:varchar(64);not null" json:"event_id"`
	Name        string    `gorm:"type:varchar(128);not null" json:"name"` // VIP, Early Bird, General, etc.
	Description string    `gorm:"type:text" json:"description"`
	Price       float64   `gorm:"type:decimal(12,2);not null" json:"price"`
	Quota       int       `gorm:"not null" json:"quota"`
	Sold        int       `gorm:"default:0" json:"sold"`
	Available   int       `gorm:"default:0" json:"available"`
	SaleStart   time.Time `json:"sale_start"`
	SaleEnd     time.Time `json:"sale_end"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Ticket represents individual issued digital ticket
type Ticket struct {
	ID             string    `gorm:"primaryKey;type:varchar(64)" json:"id"`
	TicketTypeID   string    `gorm:"index;type:varchar(64);not null" json:"ticket_type_id"`
	EventID        string    `gorm:"index;type:varchar(64);not null" json:"event_id"`
	OwnerID        string    `gorm:"index;type:varchar(64);not null" json:"owner_id"`
	QRCodeData     string    `gorm:"type:text;not null" json:"qr_code_data"`
	Status         string    `gorm:"type:varchar(32);default:'AVAILABLE'" json:"status"` // AVAILABLE, USED, TRANSFERRED, RESOLD, INVALID
	OnChainAddress string    `gorm:"type:varchar(128)" json:"on_chain_address,omitempty"`
	PurchasedAt    time.Time `json:"purchased_at"`
	UsedAt         *time.Time `json:"used_at,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Order represents ticket purchase transaction
type Order struct {
	ID          string    `gorm:"primaryKey;type:varchar(64)" json:"id"`
	UserID      string    `gorm:"index;type:varchar(64);not null" json:"user_id"`
	TotalAmount float64   `gorm:"type:decimal(12,2);not null" json:"total_amount"`
	Status      string    `gorm:"type:varchar(32);default:'pending'" json:"status"` // pending, paid, cancelled, failed
	PaymentRef  string    `gorm:"type:varchar(128)" json:"payment_ref,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
