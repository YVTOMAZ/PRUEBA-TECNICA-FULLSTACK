# Crypto App - Fullstack Technical Test

Fullstack web application built with **Vue 3**, **Node.js (Express)** and **MongoDB**.
Displays user profiles and real-time cryptocurrency data consumed from the [CoinPaprika](https://api.coinpaprika.com/) public API.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started (Local)](#getting-started-local)
- [Getting Started (Docker)](#getting-started-docker)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Environment Variables](#environment-variables)

---

## Tech Stack

| Layer     | Technology                                               |
|-----------|----------------------------------------------------------|
| Frontend  | Vue 3, TypeScript, Pinia, Vue Router 4, Axios, Vite     |
| Backend   | Node.js 20, Express 4, TypeScript, Mongoose, JWT, Zod   |
| Database  | MongoDB 7 (NoSQL)                                        |
| API Docs  | Swagger (swagger-jsdoc + swagger-ui-express)             |
| Tests     | Jest + Supertest (backend), Vitest + Vue Test Utils (frontend), Cypress (E2E) |
| Crypto API| CoinPaprika (free, no API key required)                  |
| Docker    | docker-compose with MongoDB, Backend and Frontend/Nginx  |

---

## Prerequisites

- Node.js >= 18
- MongoDB >= 6 (or use Docker)
- npm >= 9

---

## Getting Started (Local)

### 1. Clone the repository

```bash
git clone https://github.com/YVTOMAZ/PRUEBA-T-CNICA-FULLSTACK.git
cd PRUEBA-T-CNICA-FULLSTACK
```

### 2. Start MongoDB

Make sure MongoDB is running locally on port 27017, or start it with Docker:

```bash
docker run -d -p 27017:27017 --name mongo mongo:latest
```

### 3. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API will start on `http://localhost:4000`.
Swagger documentation will be available at `http://localhost:4000/api/docs`.

### 4. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The application will start on `http://localhost:5173`.

---

## Getting Started (Docker)

To run the entire application with Docker Compose (MongoDB + Backend + Frontend):

```bash
cp .env.example .env
docker compose up --build -d
```

| Service     | URL                          |
|-------------|------------------------------|
| Application | http://localhost              |
| API         | http://localhost/api          |
| Swagger     | http://localhost/api/docs     |

To stop the services:

```bash
docker compose down
```

---

## Running Tests

### Backend - Unit and Integration Tests (Jest + Supertest)

```bash
cd backend
npm test
```

Runs 21 tests covering:
- Authentication: register, login, validation, error handling
- User: profile CRUD, avatar upload, authorization
- Crypto: listing, search, pagination, detail endpoints

### Frontend - Component Unit Tests (Vitest + Vue Test Utils)

```bash
cd frontend
npm test
```

Runs 20 tests covering:
- CryptoCard: rendering, formatting, click events
- LoginForm: inputs, validation, submit events
- ProfileCard: user data display, avatar, edit events

### Frontend - E2E Tests (Cypress)

Requires both backend and frontend running locally.

```bash
cd frontend
npm run test:e2e        # headless mode
npm run test:e2e:open   # interactive mode
```

Covers:
- Authentication flow (register, login, logout, protected routes)
- Cryptocurrency listing (cards, search, pagination, detail modal)
- Profile management (view, edit, cancel)

---

## API Documentation

Full interactive API documentation with request/response examples is available via **Swagger UI**:

- Local: `http://localhost:4000/api/docs`
- Docker: `http://localhost/api/docs`

All endpoints are documented with request schemas, response schemas, and example values.

---

## API Endpoints

### Auth (Public)

| Method | Route                | Body                              | Response                |
|--------|----------------------|-----------------------------------|-------------------------|
| POST   | `/api/auth/register` | `{ name, email, password }`       | `{ token, user }`       |
| POST   | `/api/auth/login`    | `{ email, password }`             | `{ token, user }`       |

### User (JWT Required)

| Method | Route                  | Body / Content-Type                | Response                |
|--------|------------------------|------------------------------------|-------------------------|
| GET    | `/api/users/me`        | -                                  | `{ id, name, email, description, avatarUrl }` |
| PUT    | `/api/users/me`        | `{ name?, email?, description? }`  | `{ user }`              |
| POST   | `/api/users/me/avatar` | `multipart/form-data (avatar)`     | `{ avatarUrl }`         |

### Crypto (JWT Required)

| Method | Route              | Query Params                    | Response                          |
|--------|--------------------|---------------------------------|-----------------------------------|
| GET    | `/api/crypto`      | `search`, `page`, `limit`       | `{ data[], total, page, limit }`  |
| GET    | `/api/crypto/:id`  | -                               | `{ coin details }`                |

### Static Files

| Method | Route                     | Response         |
|--------|---------------------------|------------------|
| GET    | `/api/uploads/:filename`  | Image file       |
| GET    | `/api/health`             | `{ status: "ok" }` |

---

## Project Structure

```
PRUEBA-T-CNICA-FULLSTACK/
|-- docker-compose.yml
|-- .env.example
|-- README.md
|-- backend/
|   |-- Dockerfile
|   |-- package.json
|   |-- tsconfig.json
|   |-- jest.config.ts
|   +-- src/
|       |-- server.ts               # Entry point
|       |-- app.ts                  # Express configuration (no listen - testable)
|       |-- config/
|       |   |-- database.ts         # MongoDB connection
|       |   |-- env.ts              # Zod-validated environment variables
|       |   +-- swagger.ts          # OpenAPI spec configuration
|       |-- models/
|       |   +-- user.model.ts       # Mongoose schema + IUser interface
|       |-- controllers/
|       |   |-- auth.controller.ts
|       |   |-- user.controller.ts
|       |   +-- crypto.controller.ts
|       |-- services/
|       |   |-- auth.service.ts     # Register, login, JWT generation
|       |   |-- user.service.ts     # Profile CRUD, avatar management
|       |   +-- crypto.service.ts   # CoinPaprika integration + cache
|       |-- middleware/
|       |   |-- auth.middleware.ts   # JWT verification
|       |   |-- error.middleware.ts  # Centralized error handler
|       |   |-- upload.middleware.ts # Multer file upload
|       |   +-- validate.middleware.ts  # Zod schema validation
|       |-- routes/
|       |   |-- auth.routes.ts      # Swagger-annotated auth routes
|       |   |-- user.routes.ts      # Swagger-annotated user routes
|       |   +-- crypto.routes.ts    # Swagger-annotated crypto routes
|       |-- types/
|       |   +-- index.ts            # Shared TypeScript interfaces
|       +-- __tests__/
|           |-- auth.test.ts
|           |-- user.test.ts
|           +-- crypto.test.ts
|
+-- frontend/
    |-- Dockerfile
    |-- nginx.conf
    |-- package.json
    |-- vite.config.ts
    |-- vitest.config.ts
    |-- cypress.config.ts
    |-- index.html
    +-- src/
    |   |-- main.ts                 # App entry point (Pinia + Router)
    |   |-- App.vue                 # Root component with navbar
    |   |-- style.css               # Global styles (dark theme)
    |   |-- api/
    |   |   |-- index.ts            # Axios instance + JWT interceptor
    |   |   |-- auth.ts
    |   |   |-- user.ts
    |   |   +-- crypto.ts
    |   |-- router/
    |   |   +-- index.ts            # Routes + auth navigation guards
    |   |-- stores/
    |   |   |-- auth.ts             # JWT persistence in localStorage
    |   |   +-- crypto.ts           # Crypto list state + pagination
    |   |-- types/
    |   |   +-- index.ts            # Shared TypeScript interfaces
    |   |-- views/
    |   |   |-- LoginView.vue
    |   |   |-- RegisterView.vue
    |   |   |-- ProfileView.vue
    |   |   +-- CryptoListView.vue
    |   +-- components/
    |       |-- AppNavbar.vue
    |       |-- AppModal.vue
    |       |-- LoginForm.vue
    |       |-- RegisterForm.vue
    |       |-- ProfileCard.vue
    |       |-- ProfileEditForm.vue
    |       |-- AvatarUpload.vue
    |       |-- CryptoCard.vue
    |       |-- CryptoDetailModal.vue
    |       |-- CryptoSearchBar.vue
    |       +-- __tests__/
    |           |-- CryptoCard.test.ts
    |           |-- LoginForm.test.ts
    |           +-- ProfileCard.test.ts
    +-- cypress/
        |-- support/
        |   +-- e2e.ts              # Custom commands (register, login)
        +-- e2e/
            |-- auth.cy.ts
            |-- crypto.cy.ts
            +-- profile.cy.ts
```

---

## Architecture

### Backend: Controller - Service - Model

```
Request -> Route -> Middleware (auth, validate) -> Controller -> Service -> Model / External API
                                                                    |
Response <- Controller <- Service result <--------------------------+
```

- **Controller**: Receives the HTTP request, delegates to the service, returns JSON response.
- **Service**: Contains all business logic (password hashing, email uniqueness, CoinPaprika API calls with caching).
- **Model**: Mongoose schema with validation rules. Password excluded from JSON responses via `toJSON()`.
- **Middleware**: JWT verification, Zod input validation, centralized error handling (AppError class), Multer file upload.

The `app.ts` is separated from `server.ts` so that Supertest can import the Express app without binding to a port.

### Frontend: View - Store - API

- **Pinia auth store**: Token persisted in `localStorage`. The `isAuthenticated` getter drives navigation guards.
- **Axios interceptor**: Automatically injects `Authorization: Bearer <token>` on every request. On 401 responses, clears the token and redirects to `/login`.
- **Vue Router guard**: `beforeEach` hook checks `meta.requiresAuth` on protected routes (`/crypto`, `/profile`).
- **Components**: Single-responsibility, typed props and emits, Composition API with `<script setup>`.

### Crypto Data Flow

Cryptocurrency data is fetched from the CoinPaprika public API and cached in memory with a 5-minute TTL.
Data is not persisted in MongoDB since it represents external real-time market data.
The cache reduces the number of API calls while keeping data reasonably fresh.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable               | Default                                | Description                |
|------------------------|----------------------------------------|----------------------------|
| `PORT`                 | `4000`                                 | Server port                |
| `MONGODB_URI`          | `mongodb://localhost:27017/crypto-app` | MongoDB connection string  |
| `JWT_SECRET`           | `dev-secret-change-in-production`      | JWT signing secret         |
| `JWT_EXPIRES_IN`       | `7d`                                   | Token expiration time      |
| `COINPAPRIKA_BASE_URL` | `https://api.coinpaprika.com/v1`       | CoinPaprika API base URL   |

### Frontend (`frontend/.env`)

| Variable       | Default                     | Description      |
|----------------|-----------------------------|------------------|
| `VITE_API_URL` | `http://localhost:4000/api` | Backend API URL  |
