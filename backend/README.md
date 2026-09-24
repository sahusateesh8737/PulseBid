# PulseBid Backend

This is the backend foundation for a multi-tenant, real-time auction platform.

## Setup Instructions

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd PulseBid/backend
   ```
2. **Setup Environment Variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. **Start Infrastructure (Postgres & Redis)**
   ```bash
   docker compose up -d
   ```
4. **Install Dependencies**
   ```bash
   npm install
   ```
5. **Run Database Migrations**
   Sets up the initial shared schema.
   ```bash
   npm run migrate
   ```
6. **Start the Development Server**
   ```bash
   npm run dev
   ```
7. **Verify Everything is Working**
   Visit [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health) to confirm the DB and Redis are connected and the app is healthy.

## Architecture & Module Ownership

The system is structured as modular components. 
- **Teammate 1 (Auth & Inventory):** 
  - `src/modules/auth/`
  - `src/modules/inventory/`
- **Teammate 2 (Auctions, Bidding, & WS):**
  - `src/modules/auctions/`
  - `src/modules/bids/`
  - `src/ws/`

### Shared Contracts

**Auth Middleware:**
The `authMiddleware.js` verifies the JWT and attaches a specific user object to `req`. Both teammates should code assuming this contract is fulfilled:
```javascript
req.user = { 
  userId: String,
  tenantId: String,
  role: String 
};
```

## API Documentation (Auth & Inventory)

### Authentication (`/api/v1/auth`)

| Method | Endpoint             | Body                                                                 | Response (Success) |
|--------|----------------------|----------------------------------------------------------------------|--------------------|
| POST   | `/signup/create-org` | `{ name, email, password, orgName, industry? }`                      | `{ accessToken, user }`, Sets `refreshToken` cookie |
| POST   | `/signup/join-org`   | `{ name, email, password, inviteCode }`                              | `{ accessToken, user }`, Sets `refreshToken` cookie |
| POST   | `/login`             | `{ email, password }`                                                | `{ accessToken, user }`, Sets `refreshToken` cookie |
| POST   | `/refresh`           | (Uses `refreshToken` cookie)                                         | `{ accessToken }` |
| POST   | `/logout`            | (Uses `refreshToken` cookie)                                         | Clears cookie |
| GET    | `/me`                | -                                                                    | `{ user }` |
| POST   | `/invites`           | `{ role_to_assign: "user", expiresInDays: 7 }` (Admin only)          | `{ code, expires_at }` |

### Inventory Management (`/api/v1/inventory`)

*Note: All inventory endpoints are strictly isolated by `tenantId` extracted from the JWT token.*

| Method | Endpoint                 | Body                                                                 | Response (Success) |
|--------|--------------------------|----------------------------------------------------------------------|--------------------|
| POST   | `/products`              | `{ name, description?, imageUrl?, startingPrice }`                   | Created product |
| GET    | `/products`              | Query: `?status=available&page=1&limit=20`                           | `{ products, page, limit }` |
| GET    | `/products/:id`          | -                                                                    | Single product |
| PUT    | `/products/:id`          | `{ name?, description?, imageUrl?, startingPrice?, status? }`        | Updated product |
| DELETE | `/products/:id`          | -                                                                    | Soft-deleted, archived status set |
| POST   | `/products/:id/seats`    | `{ count: 5 }`                                                       | Array of created seats |
| GET    | `/products/:id/seats`    | -                                                                    | Array of product seats |
