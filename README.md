# ✦ Luna Accessories — Haute Joaillerie & Modern E-Commerce Platform

A luxurious, full-stack e-commerce experience migrated to **Next.js 16** with a high-performance **Python FastAPI backend**, featuring secure PBKDF2/JWT authentication, persistent active cart syncing, and comprehensive cart checkout history snapshots.

---

## ✨ Features & Enhancements

### 💎 Modern Luxury Frontend (Next.js 16 + React 19 + Tailwind CSS)
- **Atelier Editorial Design**: Warm neutral palette (`#FAF8F5`, `#1C1917`, champagne gold `#B8976C`), Cormorant Garamond serif headings, and refined typography.
- **Dynamic Catalog & Filtering**:
  - Filter by piece category (Earrings, Necklaces, Bracelets, Rings, or All).
  - Live real-time search with clear buttons.
  - Sorting by Most Popular / Bestsellers, Price (Low to High, High to Low), Highest Rated, and New Arrivals.
  - Interactive Wishlist heart toggle with dedicated wishlist view.
- **Product Quick View**: High-definition zoom modal with materials breakdown, certifications, and direct quantity selector.
- **Slide-out Cart Side Panel**:
  - Real-time quantity increment/decrement and item removal.
  - Free shipping progress meter (Unlock complimentary express shipping on orders over ₹2,000).
  - Promo code discounts (e.g. `LUNA10` for 10% off).
  - Order subtotal, shipping fee, discount breakdown, and grand total.
- **Permanent Cart & Order History Drawer**:
  - View all past saved carts and completed order records.
  - Order numbers (e.g., `LUNA-2026-8841`), timestamp, order status badge (*Confirmed*, *Delivered*).
  - Item thumbnails, quantities, price snapshots, and delivery address.
  - 1-Click "Reorder Items" button to re-populate the cart from past history.
- **Authentication Modal**:
  - Sign in and Registration with PBKDF2 password hashing & JWT tokens.
  - **1-Click Demo Login** button pre-configured with customer profile and existing cart history for instant evaluation.

### 🐍 Python Backend Service (FastAPI + SQLite + JWT)
- **High-Performance Architecture**: Clean RESTful architecture built with FastAPI, Pydantic, and SQLite with Foreign Key cascade integrity.
- **Authentication & Security**:
  - 100,000 iteration PBKDF2-SHA256 password hashing with unique cryptographic salt.
  - Signed HS256 JWT access tokens.
- **Cart & Order History Endpoints**:
  - `POST /api/auth/register` & `POST /api/auth/login` & `GET /api/auth/me`
  - `GET /api/products` (supports `category`, `search`, `sort_by`)
  - `GET /api/cart` (reads active user cart or calculates guest totals)
  - `POST /api/cart/add` & `PUT /api/cart/update` & `DELETE /api/cart/item/{id}` & `DELETE /api/cart/clear`
  - `POST /api/cart/sync` (merges guest cart items into authenticated user account upon login)
  - `POST /api/checkout` (converts active cart into a permanent order history record and clears active cart)
  - `GET /api/cart/history` (fetches past carts and itemized snapshots)
  - Interactive Swagger API docs at `http://127.0.0.1:8000/docs`

---

## 🚀 Quick Start Guide

### Option 1: Run Both with the All-In-One Script
From the project root:
```bash
./start.sh
```
Or:
```bash
npm run dev
```

### Option 2: Run Frontend and Backend Separately

**1. Start the Python Backend**:
```bash
cd backend
./run.sh
# Running at http://127.0.0.1:8000 (Swagger docs at http://127.0.0.1:8000/docs)
```

**2. Start the Next.js Frontend**:
```bash
cd frontend
npm run dev
# Running at http://localhost:3000
```

---

## 👤 Pre-Seeded Demo Account
To quickly test authenticated cart history without manual registration:
- **Email**: `demo@luna.com`
- **Password**: `luna123`
*(Or simply click the **"1-Click Sign In"** button in the sign-in modal)*

