<div align="center">
  <img src="client/public/apple-touch-icon.png" width="120" alt="Mind Mate Logo" />
  <h1>Mind Mate</h1>
</div>

Mind Mate is a personal journaling application designed to help you track your thoughts, analyze your mood, and gain insights into your life through AI-powered analysis.

## Overview

This project is a full-stack application leveraging modern web technologies and local LLMs (Large Language Models) to provide a private and intelligent journaling experience. It uses Retrieval-Augmented Generation (RAG) to allow you to chat with your past journal entries and generate meaningful summaries.

## System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend (Client)"]
        UI[React UI]
        State[State Management]
        API_Client[API Client]
        
        UI --> State
        State --> API_Client
    end

    subgraph Server ["Backend (Server)"]
        Router[Gin Router / Middleware]
        
        subgraph Handlers
            AuthH[Auth Handler]
            RagH[RAG Handler]
            JournalH[Journal Handler]
        end
        
        subgraph Services
            AuthS[Auth Service]
            RagS[RAG Service]
        end
        
        subgraph Repositories
            UserR[User Repo]
            JournalR[Journal Repo]
            VectorR[Vector Extensions]
        end

        Router --> AuthH & RagH & JournalH
        AuthH --> AuthS --> UserR
        RagH --> RagS
        JournalH --> JournalR
        RagS --> VectorR & JournalR
    end

    subgraph Infrastructure ["Infrastructure & External"]
        DB[(PostgreSQL + pgvector)]
        Ollama[Ollama (Local LLM)]
    end

    API_Client -->|REST / GraphQL| Router
    
    UserR & JournalR & VectorR -->|SQL Queries| DB
    RagS -->|Generate Embeddings / Chat| Ollama
    
    linkStyle default stroke-width:2px,fill:none,stroke:#333;
```

## Tech Stack

### Frontend
-   **React**: UI library for building interactive interfaces.
-   **TypeScript**: Static typing for better code quality.
-   **Vite**: Fast build tool and development server.
-   **Material UI**: Component library for a polished look and feel.

### Backend
-   **Go (Golang)**: High-performance backend language.
-   **Gin**: Web framework for building REST APIs.
-   **GORM**: ORM library for database interactions.
-   **GraphQL**: API query language (for specific features).

### Database & AI
-   **PostgreSQL**: Primary relational database.
-   **pgvector**: Vector similarity search extension for Postgres.
-   **Ollama**: Local LLM runner.
-   **LangChainGo**: Framework for building LLM applications in Go.

## RAG Features (AI)

The application integrates Ollama to provide advanced AI capabilities securely on your local machine:

1.  **Context-Aware Chat**: Ask questions about your past entries (e.g., "What did I learn last week?").
2.  **Summaries**: Generate concise weekly, monthly, and yearly recaps of your journals.
3.  **Pattern Recognition**: Identify recurring behavioral patterns and themes in your writing.
4.  **Mood Analysis**: Analyze emotional trends and understand what triggers different moods.
5.  **Writing Assistant**: Get real-time suggestions to help expand your thoughts when you are stuck.

## Prerequisites

Before running the application, ensure you have the following installed:

-   **Go** (version 1.22 or higher)
-   **Node.js** (version 18 or higher)
-   **PostgreSQL** (must support extensions)
-   **Ollama**

## Getting Started

### 1. Setup Ollama

Install Ollama and pull the necessary models:

```bash
ollama pull nomic-embed-text
ollama pull gemma:2b  # Or 'phi3' / 'llama3' depending on your hardware
```

### 2. Database Setup

Create a PostgreSQL database. The application will automatically handle migrations, including enabling the `vector` extension.

Ensure your `.env` file in the `server` directory has the correct database connection string.

### 3. Backend Setup

Navigate to the server directory and start the application:

```bash
cd server
go mod tidy
go run cmd/server/main.go
```

The server runs on `http://localhost:4000`.

### 4. Frontend Setup

Navigate to the client directory, install dependencies, and start the development server:

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Usage

1.  Open the application in your browser.
2.  Sign up or log in.
3.  Create a journal entry. The system will automatically generate an embedding for it.
4.  Navigate to the **Chat** page to interact with the AI features.
