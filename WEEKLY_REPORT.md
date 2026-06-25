# SOMTO ATELIER — Weekly Progress Report

---

## Project Overview
Building a full-stack web application for an art gallery where users can browse artwork, create accounts, and send inquiries to the gallery owner.

---

## What Was Done This Week

### 1. Backend Setup (Node.js + Express)
- Created an Express server that handles all API requests
- Server runs on port 3001 alongside the frontend on port 5173
- Vite proxy configured to forward `/api` requests from frontend to backend

### 2. User Authentication System
- **Registration endpoint** (`POST /api/register`): Users sign up with name, email, password
- **Login endpoint** (`POST /api/login`): Existing users sign in
- **JWT tokens**: Users receive a token on login that proves their identity for 7 days
- **Password security**: All passwords are scrambled (hashed) using bcrypt before storage
- **Protected routes**: Certain features (like submitting inquiries) require a valid token

### 3. Inquiry Management System
- **Submit inquiry** (`POST /api/inquiry`): Logged-in users can send inquiries about artworks
- User info (name, email) is pulled from their JWT token — no need to retype
- Data is saved to `submissions.json` for record-keeping
- A success message is returned to the user

### 4. Email Notification System
- Integrated **Resend API** to send email alerts when inquiries are submitted
- Gallery owner (`princewillasogwa10@gmail.com`) receives an email with:
  - Visitor's name and email
  - Their area of interest
  - Which artworks they selected
- Free tier: 100 emails per month at no cost

### 5. Data Storage (JSON Files)
Instead of installing a full database (MySQL, MongoDB, etc.), data is stored in simple JSON text files:
- `users.json` — all registered accounts
- `submissions.json` — all form inquiries
- Zero setup required, readable in any text editor

### 6. Frontend Integration
- **Auth component**: Login/Register forms with validation
- **Protected Collection**: "Add to inquiry" buttons only appear for logged-in users
- **Protected Visit form**: Contact form replaces with auth form if not logged in
- **Logout**: Users can sign out from the navigation bar
- **Session persistence**: Login survives page refreshes via localStorage

---

## Tech Stack Summary

| Technology | Purpose |
|---|---|
| **Node.js** | Server environment — runs JavaScript on the backend |
| **Express** | Web framework — handles routing, requests, responses |
| **JWT (jsonwebtoken)** | Authentication — issues and verifies user tokens |
| **bcryptjs** | Security — hashes passwords before storage |
| **Resend** | Email service — sends inquiry notifications |
| **dotenv** | Configuration — loads API keys from `.env` file |
| **JSON files** | Data storage — lightweight alternative to a database |

---

## API Endpoints Created

| Method | Endpoint | Auth Required | What It Does |
|---|---|---|---|
| POST | /api/register | No | Create a new account |
| POST | /api/login | No | Sign in, receive a token |
| GET | /api/me | Yes | Check if token is still valid |
| POST | /api/inquiry | Yes | Submit an inquiry form |
| GET | /api/submissions | No | View all submitted inquiries |
| GET | /api/users | No | View registered accounts |

---

## How the Flow Works

```
1. User visits site → browses artwork collection
2. User clicks "Sign in" → registers or logs in
3. User receives JWT token → stored in browser
4. User adds artworks to inquiry bag
5. User fills contact form → form sends token + data to server
6. Server verifies token → saves inquiry → sends email alert
7. Gallery owner receives email with visitor details
```

---

## Challenges & Solutions

| Challenge | Solution |
|---|---|
| React 19 clears form events after `await` | Saved form reference before async call |
| Google App Passwords too complex | Switched to Resend API (simpler setup) |
| Browser caching old code | Added `Cache-Control: no-store` header to Vite config |
| No database installed | Used JSON files — same CRUD pattern, zero setup |

---

## Next Steps

- Add admin dashboard to manage inquiries in-browser
- Add artwork management (add/remove products from admin panel)
- Deploy to production (e.g., Render, Vercel, or Railway)

---

*Report prepared for SOMTO ATELIER project presentation.*
