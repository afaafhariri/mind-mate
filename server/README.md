# MindMate Server

Node.js Backend for MindMate.

## Setup

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Configure Environment Variables:
    Copy `.env.example` to `.env` and fill in the details.

    ```bash
    cp .env.example .env
    ```

3.  Run in Development Mode:

    ```bash
    npm run dev
    ```

4.  Build and Run:
    ```bash
    npm run build
    npm start
    ```

## API Endpoints

- `GET /`: Hello World
- `GET /health`: Health check
- `POST /auth/signup`: Register a new user
- `POST /auth/verify`: Verify OTP

## Database

Uses PostgreSQL. Ensure the database `mind_mate` (or as configured in `.env`) exists.
The application expects `users` and `otps` tables.
