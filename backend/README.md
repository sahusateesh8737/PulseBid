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
