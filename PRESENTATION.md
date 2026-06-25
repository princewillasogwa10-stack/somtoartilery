# SOMTO ATELIER — Full-Stack Web Application

## Presentation Summary

---

## 1. What We Built

A **full-stack web application** for an art gallery called **SOMTO ATELIER** — a platform where users can browse artwork, create accounts, and send inquiries to the gallery owner.

**Tech Stack:**
- **Frontend:** React 19 + Vite
- **Backend:** Node.js + Express
- **Storage:** JSON file-based (no database required)
- **Authentication:** JWT (JSON Web Tokens) + bcrypt password hashing
- **Email:** Resend API for email notifications
- **Styling:** Custom CSS with design tokens

---

## 2. Architecture Overview

```
┌──────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser    │  ───►   │  Vite Server │  ───►   │   Express   │
│  (React App) │  ◄───   │  (port 5173) │  ◄───   │  (port 3001)│
└──────────────┘         └──────────────┘         └──────┬──────┘
                                                          │
                                              ┌───────────┴───────────┐
                                              │   JSON File Storage   │
                                              │  ├─ users.json        │
                                              │  └─ submissions.json  │
                                              └───────────────────────┘
```

The frontend and backend run on **different ports** during development. Vite proxies `/api` requests to Express, so the browser sees them as same-origin requests.

---

## 3. Frontend Features

| Feature | Component | Description |
|---|---|---|
| Product Collection | `Collection` | Artwork grid with filter tabs |
| User Auth | `Auth` | Login / Register form |
| Inquiry Bag | `InquiryBag` | Slide-in cart for artwork selection |
| Contact Form | `Visit` | Protected form for sending inquiries |
| Navigation | `Header` | Nav bar with auth state awareness |

**All components live in a single file:** `src/App.jsx`

---

## 4. Backend API Endpoints

| Method | Endpoint | Auth Required | Purpose |
|---|---|---|---|
| `POST` | `/api/register` | No | Create account (name, email, password) |
| `POST` | `/api/login` | No | Sign in, returns JWT token |
| `GET` | `/api/me` | Yes | Verify current session |
| `POST` | `/api/inquiry` | Yes | Submit inquiry form |
| `GET` | `/api/submissions` | No | View all form submissions |
| `GET` | `/api/users` | No | View registered accounts |

---

## 5. Authentication Flow

```
User registers → Server hashes password with bcrypt
              → Creates JWT token (expires in 7 days)
              → Saves user to users.json
              → Returns token to frontend
              
Frontend stores token in localStorage
              → Sends token as "Authorization: Bearer <token>" header
              → Server verifies token on protected routes
              
User clicks Log out → Frontend clears localStorage
                    → No more authenticated requests
```

**Why JWT?** Stateless — the server doesn't need to store sessions. The token itself carries the user identity.

---

## 6. Inquiry Flow (Protected)

```
Only logged-in users can submit inquiries

1. User browses collection, adds artworks to inquiry bag
2. Fills contact form (interest, works)
3. Frontend sends POST /api/inquiry with Bearer token
4. Server extracts user info (name, email) from the JWT
5. Saves inquiry to submissions.json
6. Sends email notification via Resend API to gallery owner
7. Returns success message to user
```

**Why extract user info from JWT?** The user doesn't have to re-type their name and email — it's already in their token.

---

## 7. Email Integration (Resend)

```
Inquiry submitted
    ↓
Server calls Resend SDK
    ↓
Resend sends email to princewillasogwa10@gmail.com
    ↓
Email contains: Name, Email, Interest, Selected works
```

**Why Resend?** Simple API, generous free tier (100 emails/day), no SMTP configuration needed. Just one API key.

---

## 8. Data Storage (JSON Files)

Instead of a traditional database, data is stored in **JSON files**:

| File | Stores |
|---|---|
| `users.json` | Registered accounts (hashed passwords) |
| `submissions.json` | Form inquiry records |

**Read/Write pattern:**
```
1. readFileSync → parse JSON → array
2. Push new entry → array
3. writeFileSync → stringify → file
```

**Why JSON?** Zero configuration, portable, human-readable. Suitable for small-scale applications. Can be swapped for PostgreSQL/MongoDB later without changing the API logic.

---

## 9. Security Measures

| Measure | Implementation |
|---|---|
| Password storage | bcrypt with 10 salt rounds |
| Authentication | JWT with 7-day expiry |
| Protected routes | Auth middleware checks Bearer token |
| Input validation | Server validates required fields |
| Hidden credentials | `.env` file with API keys (gitignored) |
| No plain-text storage | Passwords never logged or exposed |

---

## 10. How to Run

```bash
# Install dependencies (both frontend and backend)
npm install
cd server && npm install && cd ..

# Start both servers (frontend + backend)
npm run dev

# Frontend: http://127.0.0.1:5173
# Backend:  http://localhost:3001
```

One command starts both servers using `concurrently`.

---

## 11. Key Files

| File | Lines | Purpose |
|---|---|---|
| `src/App.jsx` | ~500 | All React components |
| `src/styles.css` | ~750 | All styling |
| `server/index.js` | ~140 | All API routes |
| `server/.env` | 2 | API keys config |
| `vite.config.js` | 11 | Proxy configuration |

---

## 12. Summary

| Aspect | Detail |
|---|---|
| **Frontend** | React 19, Vite, Custom CSS |
| **Backend** | Node.js, Express |
| **Auth** | JWT + bcrypt |
| **Storage** | JSON files |
| **Email** | Resend API |
| **Total files** | ~10 source files |
| **Code volume** | ~1,400 lines total |

## Built with:
- React 19
- Vite
- Express
- bcryptjs
- jsonwebtoken
- Resend
- dotenv
