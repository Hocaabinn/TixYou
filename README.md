<div align="center">

# 🎟️ TixYou — *App-Tiket*

**Smart Events. Trusted Tickets.**

Platform event discovery & ticketing:
**Discover with AI → Transact with Ticketing → Trust with Blockchain**

[![Go](https://img.shields.io/badge/Go-1.27-00ADD8?logo=go&logoColor=white)](https://go.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📖 Overview

**TixYou (TIXORA)** adalah platform event discovery dan ticketing untuk menemukan event,
membeli tiket, menyimpan e-ticket, check-in, transfer, dan resale.

TIXORA menggabungkan tiga lapisan sesuai [PRD v1.1](./TixYou_PRD.md):

| Layer | Teknologi | Peran |
|-------|-----------|-------|
| 🤖 **Intelligence** | AI (recommendation, concierge, event creator, sales insight, pricing) | Membantu menemukan & memahami event — tidak pernah mengarang data |
| 🎫 **Transaction** | Ticketing (purchase, e-ticket, QR check-in, transfer, resale) | Menangani pembelian dan penggunaan tiket |
| ⛓️ **Trust** | Blockchain (Solana + Anchor, Devnet) | Ownership & verifikasi yang dapat ditelusuri — tanpa mempersulit UX |

> **Prinsip produk:** pengguna tidak perlu memahami crypto untuk memakai aplikasi.
> Personal data selalu off-chain, private key tidak pernah disimpan di mobile.

---

## 🧱 Tech Stack

### Backend — `backend/`
- **Go** + **Gin** + **Gin-CORS** (REST JSON, Handler → Service → Repository)
- **GORM + PostgreSQL** & **JWT + bcrypt** *(target, lihat Roadmap)*
- **Payment & Blockchain abstraction** — `MockPaymentService` / `MockBlockchainService` untuk MVP

### Mobile — `mobile/`
- **React Native 0.86** + **Expo SDK 57** + **TypeScript 6**
- **Expo Router** (file-based routing), **TanStack Query** *(target)*
- QR scanner, secure token storage, dark-friendly UI

---

## 📁 Struktur Repositori

```text
TixYou/
├── TixYou_PRD.md            # Product Requirements Document v1.1
├── Referens/                # Referensi desain UI
├── backend/                 # Go REST API (Gin)
│   ├── cmd/server/main.go   # Entry point (port 8080)
│   └── internal/
│       ├── config/          # Env-based configuration
│       ├── handler/         # health, welcome, auth (mock)
│       └── router/          # Route group + CORS
└── mobile/                  # Aplikasi mobile (Expo + TypeScript)
    └── src/
        ├── app/             # Screens: index, explore, login/* (Expo Router)
        ├── components/      # UI components (themed text/view, tabs, icons)
        ├── constants/       # Theme tokens
        ├── hooks/           # use-color-scheme, use-theme
        ├── img/             # Aset gambar onboarding
        └── services/api.ts  # API client (auto base URL per platform)
```


---

## 🚀 Getting Started

### Prasyarat
- **Go 1.27+** — https://go.dev/dl
- **Node.js 20+** + npm
- **Git**

### 1. Jalankan Backend

```bash
cd backend
go run cmd/server/main.go
```

Server: `http://localhost:8080`

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/health` | GET | Health check |
| `/api/v1/welcome` | GET | Info aplikasi & fitur |
| `/api/v1/auth/login` | POST | Login (mock token) |
| `/api/v1/auth/signup` | POST | Registrasi (mock) |

Cek cepat:

```bash
curl http://localhost:8080/api/v1/health
```

### 2. Jalankan Mobile App

```bash
cd mobile
npm install
npx expo start
```

| Platform | Cara |
|----------|------|
| 🌐 Web | Tekan `w` |
| 🍎 iOS Simulator | Tekan `i` |
| 🤖 Android Emulator | Tekan `a` |
| 📱 HP fisik | Scan QR dengan **Expo Go** (satu Wi-Fi) |

### 3. Integrasi Backend ↔ Mobile

`mobile/src/services/api.ts` otomatis memilih base URL:

| Klien | Base URL |
|-------|----------|
| iOS Simulator & Web | `http://localhost:8080/api/v1` |
| Android Emulator | `http://10.0.2.2:8080/api/v1` |


---

## 🗺️ Roadmap

Target sesuai [PRD §23 — MVP Scope](./TixYou_PRD.md):

- [x] Go backend skeleton (Gin + CORS) & health/welcome endpoint
- [x] Auth screens (onboarding → login → signup)
- [x] Explore / discovery screen
- [ ] Event detail → ticket selection → checkout
- [ ] Mock payment + idempotent e-ticket issuance
- [ ] My Tickets + QR check-in scanner
- [ ] Transfer & resale (ownership history)
- [ ] Organizer: create event, ticket config, sales dashboard
- [ ] AI layer (recommendation, concierge, insights, pricing) dengan fallback
- [ ] PostgreSQL + JWT (Handler → Service → Repository)
- [ ] `MockBlockchainService` → Solana Devnet (`SolanaBlockchainService`)

**Non-goals MVP:** full crypto wallet, private key user-managed, mainnet, DeFi, cross-chain.

---

## 🔐 Environment Variables

Backend (PRD §27):

```env
APP_ENV=development
PORT=8080
DATABASE_URL=
JWT_SECRET=
PAYMENT_PROVIDER=mock
BLOCKCHAIN_PROVIDER=mock
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PROGRAM_ID=
```

> ⚠️ **Private key tidak boleh di-commit atau dikirim ke mobile.**
> File `.env*` sudah masuk `.gitignore`.

---

## 🧪 Development Commands

```bash
# Backend
cd backend && go run cmd/server/main.go
go vet ./...

# Mobile
cd mobile
npm run lint        # ESLint (expo lint)
npx tsc --noEmit    # Type check
npm run web         # Quick preview di browser
```

---

## 📄 PRD & Dokumentasi

Dokumen lengkap ada di [`TixYou_PRD.md`](./TixYou_PRD.md) — mencakup:

Functional requirements (jelajah event, beli tiket, dompet tiket, check-in QR,
transfer/resale, organizer) · AI Rules · Blockchain rules & arsitektur ·
API contract · Skema database · Ticket lifecycle · Auth & RBAC ·
Security checklist · Success metrics · Business model.

**Ticket lifecycle:**

```text
AVAILABLE → ORDERED → PAID → ISSUED → VALID
                                      ├→ USED
                                      ├→ TRANSFERRED
                                      └→ RESOLD
```

---

## 📜 License

MIT — lihat [LICENSE](LICENSE).

---

<div align="center">
<sub>Built with ❤️ following the TIXORA PRD v1.1</sub>
</div>

Override via env: `EXPO_PUBLIC_API_URL=http://<host>:8080/api/v1`
