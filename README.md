<div align="center">
  <img src="client/public/apple-touch-icon.png" width="120" alt="Mind Mate Logo" />
  <h1>Mind Mate</h1>
  <p>A private, AI-powered journaling app for mental wellness tracking.</p>
</div>

## Overview

Mind Mate is a full-stack personal journaling application that helps you track your thoughts, analyze your mood, and gain insights into your mental wellness — all powered by a local LLM running on your machine. It uses Retrieval-Augmented Generation (RAG) with vector search to let you chat with your past journal entries, generate summaries, and automatically extract emotional metrics from your writing.

All AI processing happens locally via [Ollama](https://ollama.com), so your journal data never leaves your machine.

## Features

- **Passwordless Authentication** — Sign up and log in with email OTP verification (no passwords).
- **Rich Journal Editor** — Create and edit entries with custom fonts (sans-serif, serif, monospace, handwriting), markdown-like formatting (headings, bullets, monospace), and image attachments.
- **AI-Powered Metric Extraction** — Each journal entry is automatically analyzed by the LLM to extract mood score, anxiety level, sleep quality, emotional condition, primary emotion, triggers, and a summary.
- **Dashboard Analytics** — View mental health insights, mood/anxiety/sleep trend charts, journaling streak, and weekly/monthly summaries.
- **Context-Aware Chat** — Ask questions about your past entries using RAG (vector similarity search + LLM context).
- **Summaries** — Generate weekly, monthly, and yearly recaps of your journals.
- **Pattern Recognition** — Identify recurring behavioral patterns, triggers, and emotional cycles.
- **Mood Trends** — Track mood score, anxiety level, and sleep quality over configurable time periods (7d to 5y).
- **Writing Assistant** — Get AI suggestions to expand your thoughts when you feel stuck.
- **Profile Management** — Update personal details and change your email (with OTP verification).
- **PWA Support** — Installable as a Progressive Web App via the web manifest.

## Tech Stack

### Frontend

- **React 19** — UI library.
- **TypeScript** — Static typing.
- **Vite** — Build tool and dev server.
- **Material UI (MUI v7)** — Component library.
- **Apollo Client** — GraphQL client for queries and mutations.
- **Chart.js / react-chartjs-2** — Mood trend line charts on the dashboard.
- **Tailwind CSS** — Utility-first CSS framework.
- **React Router v7** — Client-side routing.

### Backend

- **Go** — Backend language.
- **Gin** — HTTP framework for REST API endpoints.
- **gqlgen** — Code-first GraphQL server for the primary data API.
- **GORM** — ORM for PostgreSQL database interactions.
- **go-mail** — SMTP email delivery for OTP codes.
- **golang-jwt** — JWT generation and validation.

### Database & AI

- **PostgreSQL** — Primary relational database.
- **pgvector** — Vector similarity search extension for embedding-based journal retrieval.
- **Ollama** — Local LLM runner (uses `gemma:2b` for chat/analysis, `nomic-embed-text` for 768-dim embeddings).
- **LangChainGo** — Go framework for LLM prompt orchestration.

## Architecture

The application uses a **dual API architecture**:

- **GraphQL** (`POST /graphql`) — Primary data API for all CRUD operations (journals, users, auth). Powered by gqlgen with code generation.
- **REST** (`/api/rag/*`) — AI/RAG endpoints for chat, mood analysis, summaries, pattern recognition, and writing assistance.
- **REST** (`/api/auth/*`) — Duplicate auth endpoints (signup, login, verify-otp) also available as REST.
- **REST** (`/api/media/upload`) — File upload for journal image attachments.

### Authentication Flow

1. User enters their email address.
2. Server generates a 6-digit OTP and sends it via email.
3. User enters the OTP.
4. Server validates the OTP and returns a JWT token (30-day expiry, HS256).
5. All subsequent requests include the JWT in the `Authorization: Bearer <token>` header.

No passwords are used anywhere in the system.

## Project Structure

```
mind-mate/
├── client/                          # React frontend
│   ├── public/                      # Static assets and PWA manifest
│   └── src/
│       ├── components/              # Reusable UI components
│       │   ├── LiveClock.tsx        # Real-time clock on dashboard
│       │   ├── Loading.tsx          # Animated splash loader
│       │   ├── OtpInput.tsx         # 6-digit OTP input
│       │   ├── Sidebar.tsx          # Navigation sidebar
│       │   └── journals/            # Journal-specific components
│       │       ├── JournalCard.tsx   # Journal preview card
│       │       ├── JournalDetail.tsx # Full journal view with custom fonts
│       │       └── JournalEditor.tsx # Create/edit modal with formatting toolbar
│       ├── graphql/                 # GraphQL queries and mutations
│       ├── layouts/                 # DashboardLayout with sidebar
│       ├── pages/                   # Route pages
│       │   ├── Chat.tsx             # AI chat interface
│       │   ├── Dashboard.tsx        # Analytics dashboard
│       │   ├── Journals.tsx         # Journal list and management
│       │   ├── Login.tsx            # Login with OTP
│       │   ├── Profile.tsx          # Profile settings
│       │   ├── Signup.tsx           # Registration with OTP
│       │   └── Splash.tsx           # Animated splash screen
│       └── services/
│           └── ragService.ts        # REST client for AI endpoints
├── server/                          # Go backend
│   ├── cmd/server/main.go           # Application entry point
│   ├── graph/                       # GraphQL layer (gqlgen)
│   │   ├── schema.graphqls          # GraphQL schema definition
│   │   ├── schema.resolvers.go      # Resolver implementations
│   │   ├── helpers.go               # Model conversion utilities
│   │   └── model/models_gen.go      # Auto-generated GraphQL models
│   ├── internal/
│   │   ├── auth/                    # JWT and auth middleware
│   │   ├── db/                      # PostgreSQL connection (GORM)
│   │   ├── handler/                 # REST handlers (auth, media, RAG)
│   │   ├── model/                   # Database models (GORM)
│   │   ├── repository/              # Data access layer
│   │   └── service/                 # Business logic (email, RAG/AI)
│   └── migrations/                  # SQL migration files
```

## Prerequisites

- **Go** (version 1.25 or higher)
- **Node.js** (version 18 or higher)
- **PostgreSQL** (with extension support for pgvector)
- **Ollama**

## Getting Started

### 1. Setup Ollama

Install [Ollama](https://ollama.com) and pull the required models:

```bash
ollama pull nomic-embed-text
ollama pull gemma:2b
```

### 2. Database Setup

Create a PostgreSQL database. The application runs migrations automatically on startup, including enabling the `pgvector` extension.

### 3. Backend Configuration

Create a `.env` file in the `server/` directory:

```env
DATABASE_URL=postgres://user:password@localhost:5432/mindmate?sslmode=disable
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@example.com
PORT=4000
```

| Variable        | Required | Default         | Description                         |
| --------------- | -------- | --------------- | ----------------------------------- |
| `DATABASE_URL`  | Yes      | —               | PostgreSQL connection string        |
| `JWT_SECRET`    | No       | `my_secret_key` | Secret key for signing JWT tokens   |
| `SMTP_HOST`     | Yes      | —               | SMTP server hostname                |
| `SMTP_PORT`     | No       | `587`           | SMTP server port                    |
| `SMTP_USERNAME` | Yes      | —               | SMTP authentication username        |
| `SMTP_PASSWORD` | Yes      | —               | SMTP authentication password        |
| `SMTP_FROM`     | Yes      | —               | Sender email address for OTP emails |
| `PORT`          | No       | `4000`          | Server port                         |

### 4. Start the Backend

```bash
cd server
go mod tidy
go run cmd/server/main.go
```

The server runs on `http://localhost:4000`. A GraphQL Playground is available at the root URL.

### 5. Start the Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## API Reference

### GraphQL (`POST /graphql`)

**Queries:**

- `me` — Get the authenticated user's profile.
- `getJournals(sortBy: SortOrder)` — List all journals (NEWEST_FIRST, OLDEST_FIRST, ALPHABETICAL).
- `getJournal(id: ID!)` — Get a single journal by ID.

**Mutations:**

- `signup(...)` — Register a new user (sends OTP email).
- `login(email: String!)` — Request login OTP.
- `verifyOTP(email: String!, otp: String!)` — Verify OTP and receive JWT + user.
- `createJournal(input: JournalInput!)` — Create a journal (auto-extracts AI metrics).
- `updateJournal(id: ID!, input: JournalInput!)` — Update a journal (re-extracts AI metrics).
- `deleteJournal(id: ID!)` — Delete a journal.
- `updateUser(input: UpdateUserInput!)` — Update profile fields.
- `requestEmailChange(newEmail: String!)` — Start email change (sends OTP to new email).
- `confirmEmailChange(newEmail: String!, otp: String!)` — Confirm email change with OTP.

### REST — AI/RAG (`/api/rag/*`, requires Bearer token)

| Endpoint             | Method | Body                                               | Description                                      |
| -------------------- | ------ | -------------------------------------------------- | ------------------------------------------------ |
| `/api/rag/chat`      | POST   | `{ "query": "..." }`                               | Chat with your journals using RAG                |
| `/api/rag/summary`   | POST   | `{ "period": "weekly\|monthly\|yearly" }`          | Get a journal summary for a time period          |
| `/api/rag/pattern`   | POST   | —                                                  | Analyze behavioral patterns (last 30 days)       |
| `/api/rag/mood`      | POST   | `{ "period": "7d\|14d\|30d\|3m\|6m\|1y\|3y\|5y" }` | Get mood timeline data points                    |
| `/api/rag/insights`  | POST   | —                                                  | Get overall mental health condition and triggers |
| `/api/rag/assistant` | POST   | `{ "input": "..." }`                               | Get writing suggestions                          |

### REST — Media

| Endpoint            | Method | Body                                  | Description                            |
| ------------------- | ------ | ------------------------------------- | -------------------------------------- |
| `/api/media/upload` | POST   | `multipart/form-data` (field: `file`) | Upload an image (jpeg, png, gif, webp) |

## Usage

1. Open `http://localhost:5173` in your browser.
2. Sign up with your email — you'll receive a 6-digit OTP.
3. Enter the OTP to complete registration and log in.
4. Create journal entries — the AI automatically extracts mood, anxiety, sleep, and emotional metrics.
5. Visit the **Dashboard** to see your mental health trends, insights, and journaling streak.
6. Use the **Chat** page to ask questions about your past entries.
7. Check **Summaries & Patterns** on the dashboard for periodic recaps.
