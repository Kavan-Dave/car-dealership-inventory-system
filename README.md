# 🚗 Apex Motors — Car Dealership Inventory System

> A full-stack, test-driven Car Dealership Inventory System built with Node.js, Express, MongoDB, and React. Designed to demonstrate API development, role-based access control, TDD practices, and a premium SPA user experience.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Test Report](#test-report)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)

---

## Project Overview

**Apex Motors** is a full-stack inventory management system for a car dealership. It supports two user roles:

- **Admin** — Full CRUD access. Can add, edit, restock, and delete vehicle listings.
- **Salesperson** — Can browse the inventory, search/filter vehicles, and process customer purchase orders.

The system enforces JWT-based authentication, real-time inventory synchronization (via polling), and strict role-based authorization on all sensitive API endpoints.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | Persistent database & ODM |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **Jest + Supertest** | Unit & integration testing |
| **dotenvx** | Secure environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + Vite 8** | SPA framework & build tool |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notification system |

---

## Features

### 🔐 Authentication
- User registration and login with JWT tokens
- Persistent sessions via `localStorage`
- Protected routes — unauthenticated users are redirected to login
- Role-aware UI — Admin controls only visible to admin accounts

### 🚘 Inventory Management (Admin)
- Add new vehicle listings with full validation (make, model, year, price, mileage, color, fuel type, transmission, category, quantity)
- Edit existing vehicle details
- Restock a vehicle (increments quantity; auto-resets status to Available)
- Delete vehicles with confirmation dialog
- Real-time stats bar: Total Listings / Available / Sold

### 🛒 Sales Dashboard (Salesperson)
- Browse the full vehicle catalog with live status badges
- Search and filter by make, model, category, min/max price
- Purchase a vehicle — decrements stock; disables button and shows "Sold Out" at quantity 0
- Auto-refresh every 5 seconds to stay in sync across sessions
- Purchase confirmation modal before committing a transaction

### 🎨 UI/UX
- Premium dark navbar with role-aware navigation links
- Gradient vehicle cards with category-specific color schemes
- Loading skeleton cards during data fetch
- Animated transitions and hover micro-interactions
- Fully responsive layout (mobile → widescreen desktop)
- Toast notifications for all actions

---

## System Architecture

```
car-dealership-inventory-system/
├── backend/
│   └── src/
│       ├── config/           # Database connection
│       ├── controllers/      # Business logic (auth, vehicles)
│       ├── middleware/        # JWT auth, role authorization, validation
│       ├── models/           # Mongoose schemas (User, Vehicle)
│       ├── routes/           # Express route definitions
│       ├── scripts/          # DB seed/reset utilities
│       └── tests/            # Jest test suites
│           ├── auth/         # register, login, profile, middleware
│           └── vehicle/      # CRUD, search, purchase, restock
├── frontend/
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── context/          # AuthContext (global auth state)
│       ├── hooks/            # useAuth hook
│       ├── layouts/          # MainLayout (navbar + footer)
│       ├── pages/            # LoginPage, RegisterPage, DashboardPage, AdminDashboardPage
│       ├── routes/           # ProtectedRoute, AdminRoute guards
│       └── services/         # vehicleService, authService (Axios API calls)
└── README.md
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- A running [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file (see Environment Variables section)
cp .env.example .env

# 4. Seed the admin account (first time only)
node src/scripts/seedAdmin.js

# 5. Start the development server
npm run dev
```

The backend API will start on **http://localhost:5000**.

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env

# 4. Start the development server
npm run dev
```

The frontend SPA will be served at **http://localhost:5173**.

---

## Environment Variables

### Backend — `backend/.env`

```env
MONGO_URI=mongodb://localhost:27017/car-dealership
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Reference

All vehicle endpoints require a valid `Authorization: Bearer <token>` header.

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/api/auth/profile` | ✅ | Get authenticated user profile |

#### `POST /api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@dealership.com",
  "password": "securepassword"
}
```

#### `POST /api/auth/login`
```json
{
  "email": "john@dealership.com",
  "password": "securepassword"
}
```

---

### Vehicle Endpoints

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `POST` | `/api/vehicles` | ✅ | Admin | Add a new vehicle |
| `GET` | `/api/vehicles` | ✅ | Any | Get all vehicles |
| `GET` | `/api/vehicles/search` | ✅ | Any | Search/filter vehicles |
| `GET` | `/api/vehicles/:id` | ✅ | Any | Get vehicle by ID |
| `PUT` | `/api/vehicles/:id` | ✅ | Admin | Update a vehicle |
| `DELETE` | `/api/vehicles/:id` | ✅ | Admin | Delete a vehicle |
| `POST` | `/api/vehicles/:id/purchase` | ✅ | Any | Purchase a vehicle |
| `POST` | `/api/vehicles/:id/restock` | ✅ | Admin | Restock a vehicle |

#### Search Query Parameters (`GET /api/vehicles/search`)
| Parameter | Type | Description |
|---|---|---|
| `make` | string | Filter by manufacturer (partial, case-insensitive) |
| `model` | string | Filter by model name (partial, case-insensitive) |
| `category` | string | Filter by category (e.g. Sedan, SUV) |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |

#### Vehicle Object Schema
```json
{
  "_id": "ObjectId",
  "make": "Toyota",
  "model": "Camry",
  "year": 2024,
  "price": 28000,
  "mileage": 0,
  "color": "Pearl White",
  "fuelType": "Petrol",
  "transmission": "Automatic",
  "category": "Sedan",
  "quantity": 5,
  "status": "Available",
  "createdAt": "ISO Date",
  "updatedAt": "ISO Date"
}
```

---

## Test Report

The backend has **12 test suites** covering **66 test cases** across all critical system paths.

```
Test Suites: 12 passed, 12 total
Tests:       66 passed, 66 total
Snapshots:   0 total
Time:        ~30s
```

### Test Coverage Breakdown

| Suite | File | Tests |
|---|---|---|
| Auth — Register | `auth/register.test.js` | Registration validation, duplicate email, success |
| Auth — Login | `auth/login.test.js` | Credentials validation, wrong password, success |
| Auth — Profile | `auth/profile.test.js` | Protected access, valid token |
| Auth — Middleware | `auth/authMiddleware.test.js` | Missing/invalid/expired tokens |
| Auth — Roles | `auth/authorizeRoles.test.js` | Admin-only access enforcement |
| Vehicle — Create | `vehicle/vehicleCreate.test.js` | Validation, admin-only, success |
| Vehicle — Read | `vehicle/vehicleRead.test.js` | Get all, get by ID, not found |
| Vehicle — Update | `vehicle/vehicleUpdate.test.js` | Admin-only, validation, success |
| Vehicle — Delete | `vehicle/vehicleDelete.test.js` | Admin-only, not found, success |
| Vehicle — Search | `vehicle/vehicleSearch.test.js` | make, model, category, price range |
| Vehicle — Purchase | `vehicle/vehiclePurchase.test.js` | Out-of-stock, success, decrement qty |
| Vehicle — Restock | `vehicle/vehicleRestock.test.js` | Admin-only, increment qty, status reset |

### Running Tests

```bash
cd backend
npm test
```

---

## Screenshots

> **Login Page** — Clean authentication form with a link to registration.

> **Salesperson Dashboard** — Full vehicle catalog with status badges, specs, search bar, and purchase actions.

> **Admin Control Panel** — Stats bar (Total / Available / Sold) with full vehicle management controls.

> **Add Vehicle Modal** — Wide, validated form for creating new inventory listings.

> **Purchase Confirmation** — Modal confirmation step before committing a purchase transaction.

---

## My AI Usage

### Tools Used

- **Antigravity (Google DeepMind)** — Primary AI coding assistant used throughout the project.

---

### How I Used AI

| Phase | Usage |
|---|---|
| **API Design** | Used AI to brainstorm and validate RESTful endpoint structures, HTTP status codes, and middleware patterns before implementation. |
| **Boilerplate Generation** | AI generated initial boilerplate for Express route files, Mongoose schemas, and React component skeletons which I then refined and integrated. |
| **Test Writing** | AI helped generate the initial structure of Jest/Supertest integration tests. I then reviewed, corrected, and expanded them to cover all edge cases. |
| **Debugging** | Used AI to diagnose issues such as the polling interval causing stale closure bugs, modal centering issues in Tailwind, and JWT token propagation errors in protected routes. |
| **Frontend Components** | AI generated portions of `VehicleCard`, `AdminVehicleCard`, `VehicleFormModal`, and `DashboardPage`. I implemented the business logic, state wiring, and API integration manually. |
| **Code Review** | AI performed a final code review pass to identify dead code (unused imports, orphaned handlers) and inconsistencies between frontend and backend. |

---

### My Reflection

Using AI as a co-pilot significantly accelerated the development of this project — particularly in the areas of boilerplate generation and test scaffolding. However, it was critical to **verify every AI output** before committing it. Several times, the AI generated code that was functionally correct but architecturally inconsistent with the existing patterns (e.g., it initially used the admin `PUT` route for salesperson reserve actions, creating a security regression that I caught and fixed by implementing a dedicated endpoint).

The most valuable use was in **debugging complex interactions** — particularly the real-time synchronization between the salesperson purchase action and the admin dashboard status update. The AI helped reason through the race condition and propose the polling solution.

AI did not replace my judgment — it amplified my velocity while I retained full ownership of architectural decisions, security boundaries, and the final implementation quality.

---

### Co-Authorship

All commits where AI assistance was used include the co-author trailer:

```
Co-authored-by: Antigravity <assistant@example.com>
```

---

## Default Admin Credentials

> ⚠️ For demonstration purposes only. Change before any production deployment.

| Field | Value |
|---|---|
| Email | `admin@dealership.com` |
| Password | `admin123` |

To seed or reset the admin account:

```bash
cd backend
node src/scripts/seedAdmin.js    # Create if not exists
node src/scripts/resetAdmin.js   # Force reset password
```

---

## License

This project was built as part of a TDD Kata assessment. All code is original work, augmented by AI tooling as described in the AI Usage section above.

---

<div align="center">
  <strong>Built with ❤️ by Kavan Dave</strong><br/>
  <em>Powered by Node.js · MongoDB · React · Tailwind CSS</em>
</div>
