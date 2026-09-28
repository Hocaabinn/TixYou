# TIXORA — Product Requirements Document (PRD)

**Version:** 1.1  
**Date:** 25 September 2026  
**Platform:** Android & iOS  
**IDE:** Antigravity IDE / Code Editor  
**Tagline:** Smart Events. Trusted Tickets.

## 1. Product Overview
TIXORA adalah platform event discovery dan ticketing untuk menemukan event, membeli tiket, menyimpan e-ticket, check-in, transfer, dan resale. TIXORA menggabungkan **AI sebagai Intelligence Layer**, **Blockchain sebagai Trust Layer**, dan **Ticketing sebagai Transaction Layer**. Pengguna tidak perlu memahami crypto untuk memakai aplikasi.

## 2. Problem
- Sulit menemukan event yang relevan.
- Informasi event/tiket tersebar.
- Risiko tiket palsu, duplikasi, dan penyalahgunaan.
- Transfer/resale sering tidak memiliki ownership yang jelas.
- Organizer membutuhkan insight penjualan dan peserta.
- Organizer membutuhkan tools sederhana untuk membuat dan mengelola event.

## 3. Target Users
### Attendee
Mencari, membeli, menyimpan, menggunakan, mentransfer, atau menjual kembali tiket.

### Organizer
Membuat event, mengatur tiket, memantau penjualan, dan melakukan check-in.

## 4. Core Journey
**Attendee:** Discover → Select → Buy → Own → Transfer/Resell → Attend  
**Organizer:** Create → Configure → Publish → Sell → Check-in → Analyze

# 5. Functional Requirements

## 5.1 Jelajah Event
Features: search, filter kategori/lokasi/tanggal/harga, sorting, event detail, AI recommendation.

Acceptance criteria:
- Search berdasarkan keyword.
- Filter dan sorting berjalan.
- Event detail menampilkan informasi penting.
- Empty state tersedia.
- AI recommendation memiliki fallback jika AI unavailable.

## 5.2 Beli Tiket
Features: ticket type, quantity, order summary, payment, confirmation, e-ticket.

Acceptance criteria:
- Tidak dapat membeli tiket habis.
- Total harga benar.
- Payment success menghasilkan tiket.
- Payment failure tidak menghasilkan tiket valid.
- Ticket issuance idempotent.
- E-ticket tersedia setelah pembayaran berhasil.

## 5.3 Dompet Tiket
Features: My Tickets, ticket detail, QR, status.

Status: `AVAILABLE`, `VALID`, `USED`, `TRANSFERRED`, `RESOLD`, `INVALID`.

Acceptance criteria:
- User dapat melihat tiket miliknya.
- Detail menampilkan event, ticket type, ticket ID, QR.
- QR hanya valid jika tiket valid.
- Tiket USED tidak dapat digunakan kembali.
- Ownership lama tidak aktif setelah transfer.

## 5.4 Check-in QR
Scanner memvalidasi ticket valid, belum digunakan, event sesuai, dan ticket ID valid. QR palsu, invalid/expired, already-used, atau event lain ditolak. Setiap check-in disimpan.

## 5.5 Transfer & Resale
### Transfer
Hanya owner aktif yang dapat transfer. Ownership berpindah setelah berhasil, QR owner sebelumnya invalid, dan riwayat tersimpan.

### Resale
Hanya tiket eligible. Harga mengikuti aturan event/platform. Listing dapat dibatalkan, ditutup setelah terjual, ownership berpindah ke buyer, dan riwayat tersimpan.

## 5.6 Organizer
Create/edit event, draft/publish, ticket type, pricing, inventory, sales monitoring, check-in monitoring.

Acceptance criteria:
- Event dapat disimpan sebagai draft.
- Event hanya dijual setelah publish.
- Organizer dapat membuat beberapa ticket type.
- Organizer hanya mengakses event miliknya.

# 6. AI Intelligence Layer

### AI Recommendation
Menggunakan data relevan seperti kategori, preferensi, search/purchase history, dan lokasi jika diberi izin. AI tidak boleh mengarang event. Fallback tersedia.

### AI Concierge
Menjawab permintaan natural-language berdasarkan data event yang tersedia. AI tidak boleh mengarang event.

### AI Event Creator
Membantu menghasilkan title, description, category, suggested ticket types, dan suggested pricing. Organizer wajib review sebelum publish.

### AI Sales Insight
Menganalisis sales trend, conversion, sales velocity, inventory, dan participant characteristics.

### AI Pricing
Memberikan rekomendasi harga berdasarkan data. Tidak boleh mengubah harga otomatis tanpa approval organizer.

### AI Rules
- Structured output.
- Backend mengontrol AI.
- AI tidak menghasilkan raw SQL.
- AI tidak auto-publish.
- AI tidak mengubah konfigurasi kritis tanpa approval.
- Data sensitif hanya dikirim jika diperlukan.
- Fallback saat AI API gagal.

# 7. Blockchain Trust Layer

**Blockchain:** Solana  
**Smart Contract:** Anchor + Rust  
**Development:** Solana Devnet  
**Production:** Solana Mainnet (future)

Blockchain digunakan untuk ticket identity, ownership reference, status, verification, transfer, resale, dan audit/reference history.

### On-chain
Ticket ID/reference, Event ID/reference, ownership reference, status, timestamp, transfer reference.

### Off-chain
Nama, email, nomor telepon, payment information, personal data, dan sensitive transaction data.

**Personal data tidak boleh disimpan langsung di blockchain.**

## Blockchain Architecture
```text
TIXORA Backend
      |
      v
BlockchainService
      |
      +-- MockBlockchainService
      +-- SolanaBlockchainService
                    |
                    v
               Solana Devnet
```

Development awal menggunakan `MockBlockchainService`. Integrasi Solana dilakukan setelah core ticketing stabil.

Rules: jangan simpan personal data on-chain; jangan expose private key ke mobile; user tidak wajib punya wallet; blockchain failure tidak boleh menyebabkan duplicate ticket; semua blockchain operation memiliki error handling; backend/database menjaga transactional consistency.

# 8. Backend
Stack: Go, Gin, GORM, PostgreSQL, JWT, bcrypt/Argon2, REST JSON, Solana/Anchor integration.

Architecture: **Handler → Service → Repository → PostgreSQL**.

Payment dan blockchain menggunakan abstraction/interface.

# 9. API
```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me

GET    /api/v1/events
GET    /api/v1/events/:id
POST   /api/v1/events
PATCH  /api/v1/events/:id
DELETE /api/v1/events/:id

GET  /api/v1/tickets
GET  /api/v1/tickets/:id
POST /api/v1/tickets/purchase
POST /api/v1/tickets/:id/transfer
POST /api/v1/tickets/:id/resale

POST /api/v1/checkins
GET  /api/v1/checkins/history

GET  /api/v1/ai/recommendations
POST /api/v1/ai/concierge
POST /api/v1/ai/event-creator
GET  /api/v1/ai/insights
POST /api/v1/ai/pricing

GET  /api/v1/blockchain/tickets/:id
POST /api/v1/blockchain/verify
```

# 10. Database
Core tables: users, organizers, events, event_categories, ticket_types, ticket_orders, order_items, tickets, ticket_ownerships, ticket_transfers, ticket_resales, payments, check_ins, notifications, ai_recommendations, ai_insights.

```text
User
 ├── Orders
 ├── Tickets
 ├── TicketOwnership
 └── CheckIns
Organizer └── Events
Event ├── TicketTypes ├── Tickets └── CheckIns
Ticket ├── Ownership ├── TransferHistory ├── Resale └── CheckIn
```

# 11. Ticket Lifecycle
```text
AVAILABLE → ORDERED → PAID → ISSUED → VALID
                                      ├→ USED
                                      ├→ TRANSFERRED
                                      └→ RESOLD
```

# 12. Authentication & Authorization
Roles: `ATTENDEE`, `ORGANIZER`, `ADMIN`.

Requirements: JWT, password hashing, RBAC, protected organizer endpoints, ownership validation, input validation, rate limiting, secure errors.

# 13. Payment
```text
PaymentService
   ├── MockPaymentService
   └── ProductionPaymentService
```
MVP menggunakan mock payment. Requirements: idempotency, payment status, success/failure handling, webhook-ready architecture, dan tidak membuat tiket dua kali untuk satu pembayaran.

# 14. Mobile
Stack: React Native, Expo, TypeScript, Expo Router, TanStack Query/React Query, state management sesuai kebutuhan, QR scanner, secure token storage.

Attendee screens: Splash, Onboarding, Login/Register, Home, Explore/Search, Event Detail, Ticket Selection, Checkout, Payment, Payment Result, My Tickets, Ticket Detail, QR Ticket, Transfer, Resale, Profile.

Organizer screens: Dashboard, Create/Edit Event, Ticket Configuration, Sales Dashboard, AI Insights, Participant Analytics, Check-in Scanner.

# 15. UI/UX
Modern, premium, minimal, dark-friendly, event-focused, clear CTA, fast navigation. Prioritas: Discover → Event Detail → Purchase → Ticket Access → Check-in → Transfer/Resale. Wallet, gas fee, seed phrase, dan crypto tidak menjadi fokus UX.

# 16. Security
Password hashing, JWT validation, RBAC, input sanitization, ORM/parameterized queries, rate limiting, secret management, HTTPS production, no private key in mobile, no personal data on-chain, payment/ticket idempotency, audit logs, OWASP-oriented testing.

# 17. Error Format
```json
{
  "success": false,
  "error": {
    "code": "TICKET_ALREADY_USED",
    "message": "Ticket has already been used"
  }
}
```
HTTP status: 400, 401, 403, 404, 409, 422, 429, 500 sesuai kondisi.

# 18. Repository Structure
```text
TIXORA/
├── mobile/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── services/
│   ├── hooks/
│   ├── store/
│   └── types/
├── backend/
│   ├── cmd/api/main.go
│   ├── internal/
│   │   ├── config/
│   │   ├── handler/
│   │   ├── middleware/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── routes/
│   │   └── dto/
│   ├── migrations/
│   └── go.mod
├── contracts/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── AI.md
│   ├── BLOCKCHAIN.md
│   ├── SETUP.md
│   └── IMPLEMENTATION_PLAN.md
├── TIXORA_PRD.md
└── README.md
```

# 19. Development Phases
1. **Foundation:** repository, React Native/Expo, Go/Gin, PostgreSQL, GORM, env, auth, base API, design system, mock payment, mock blockchain.
2. **Event Discovery:** CRUD, search, filter, sorting, detail, categories.
3. **Ticketing:** ticket types, inventory, orders, mock payment, e-ticket, QR, wallet.
4. **Organizer & Check-in:** dashboard, sales, participants, QR check-in, history.
5. **AI:** recommendations, concierge, event creator, sales insights, pricing.
6. **Blockchain:** Anchor, Solana Devnet, ticket identity, ownership reference, verification, transfer, sync.
7. **Resale:** listing, purchase, ownership transfer, lifecycle, history.

# 20. Definition of Done
Feature selesai jika acceptance criteria terpenuhi, UI terhubung API, API terhubung DB, auth berjalan, validation dan loading/empty/error states tersedia, tests sesuai kebutuhan, tidak ada critical runtime error, dokumentasi diperbarui, dan berjalan di development/staging.

# 21. Success Metrics
Attendee: discovery rate, search-to-detail conversion, checkout conversion, ticket issuance success, check-in success, transfer/resale usage.  
Organizer: event creation completion, ticket sell-through, organizer retention, AI insight usage, check-in usage.  
Platform: DAU/MAU, GMV, tickets sold, events created, verification success, payment success, API error rate.

# 22. Business Model
Potential revenue: ticket transaction fee, organizer platform fee, premium analytics, promoted events, resale transaction fee, future B2B event management services. Fee structure configurable.

# 23. MVP Scope
Authentication, event discovery, event detail, ticket purchase, mock payment, e-ticket, QR validation, organizer event management, basic sales dashboard, dan mock blockchain abstraction.

Real Solana Devnet integration dilakukan setelah core ticketing stabil.

# 24. Non-Goals MVP
Full crypto wallet experience, user-managed private keys, mainnet deployment, DeFi, fully autonomous AI, advanced secondary market, dan cross-chain support bukan blocker MVP.

# 25. Technical Principles
1. Business logic first, blockchain second.
2. Blockchain memperkuat trust tanpa memperumit UX.
3. AI membantu tetapi tidak mengontrol critical actions.
4. Personal data tetap off-chain.
5. Payment dan ticket issuance harus idempotent.
6. External services menggunakan abstraction.
7. MVP tetap usable saat AI/blockchain unavailable.
8. Mobile tidak menyimpan private blockchain credentials.
9. Backend/database menjaga transactional consistency.
10. Arsitektur memungkinkan provider blockchain diganti.

# 26. Antigravity IDE Compatibility
TIXORA **bisa dikembangkan menggunakan Antigravity IDE / Code Editor**. IDE hanya development environment dan tidak mengubah arsitektur aplikasi.

Environment: Node.js + npm/pnpm, Expo tooling, Go, PostgreSQL, Git, Rust + Cargo, Solana CLI, Anchor CLI untuk Phase 6, Android Studio/perangkat Android, dan Xcode untuk iOS build pada macOS.

AI coding agent di Antigravity dapat membantu implementasi, tetapi hasil harus diverifikasi dengan build, test, lint, dan runtime check.

# 27. Environment Variables
```env
APP_ENV=development
PORT=8080
DATABASE_URL=
JWT_SECRET=
AI_API_KEY=
AI_MODEL=
PAYMENT_PROVIDER=mock
BLOCKCHAIN_PROVIDER=mock
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PROGRAM_ID=
SOLANA_PRIVATE_KEY=
EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
```
Private key tidak boleh di-commit atau dikirim ke mobile.

# 28. Final Architecture
```text
                   TIXORA
                      |
       +--------------+--------------+
       |                             |
 React Native                    Organizer
    Mobile                         Tools
       |                             |
       +--------------+--------------+
                      |
                  Go Backend
                      |
        +-------------+-------------+
        |             |             |
   PostgreSQL         AI       Payment Service
        |             |        Mock / Production
        |             |
        +-------------+-------------+
                      |
              BlockchainService
                      |
             +--------+--------+
             |                 |
       Mock Service      Solana Service
                               |
                         Solana Devnet
```

# 29. Product Principle
**TIXORA bukan sekadar aplikasi jual tiket.**

**Discover with AI → Transact with Ticketing → Trust with Blockchain**

AI membantu menemukan dan memahami event. Ticketing menangani pembelian dan penggunaan tiket. Blockchain memberikan lapisan verifikasi dan ownership yang dapat ditelusuri. Semua teknologi harus tetap terasa sederhana bagi pengguna akhir.

---
## END OF PRD
