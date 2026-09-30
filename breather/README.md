# 🌿 Breather — A Digital Space to Unwind

> A UI/UX-focused digital well-being platform for students and young adults.

---

## Overview

Breather provides immersive digital experiences that help users take short, meaningful breaks from academic pressure, routine fatigue, and daily stress. It is not a mental health diagnosis or counselling platform — it's a space to relax, create, and explore.

**Six core modules:**

| Module | Description |
|---|---|
| 🌿 Digital Garden | Drag-and-drop garden builder with day/night and weather modes |
| 🎨 Creative Studio | Canvas drawing with brushes, shapes, undo/redo, and creative prompts |
| 🌅 Escape Room | Immersive ambient environments with sound (Ocean, Forest, Rain…) |
| 🎮 Play Zone | Pressure-free mini-games: Bubble Pop, Falling Stars, Particles… |
| 🎵 Soundscape | Multi-track ambient audio mixer with saveable presets |
| 🛋️ Dream Room | Drag, resize, and decorate your own room in 2D |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Framer Motion, React Router v6, CSS Modules |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT, bcryptjs |
| Canvas | Canvas API, Web Audio API |

---

## Project Structure

```
breather/
├── client/               # React frontend
│   ├── src/
│   │   ├── assets/       # Images, sounds, icons
│   │   ├── components/   # Shared + module components
│   │   ├── pages/        # Route-level pages
│   │   ├── layouts/      # App shell layouts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # Axios service layer
│   │   ├── context/      # AuthContext, ThemeContext
│   │   ├── utils/        # Helpers, constants
│   │   └── styles/       # Global CSS, design tokens
│   └── vite.config.js
│
└── server/               # Express backend
    ├── controllers/      # Route handlers
    ├── models/           # Mongoose schemas
    ├── routes/           # Express routers
    ├── middleware/       # Auth, validation, error handling
    ├── config/           # DB connection
    ├── utils/            # Response helpers, seed
    └── server.js
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install server dependencies
cd breather/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env — set MONGO_URI and JWT_SECRET

# Client
cp client/.env.example client/.env
```

### 3. Seed Sample Data (optional)

```bash
cd server
npm run seed
```

This creates two sample accounts:
- `alex@breather.app` / `password123`
- `maya@breather.app` / `password123`

### 4. Start Development

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Modules
| Method | Endpoint | Description |
|---|---|---|
| GET/POST/PUT | `/api/garden` | Garden CRUD |
| GET/POST | `/api/creations` | Drawings |
| GET | `/api/environments` | Escape environments |
| GET/POST/PUT/DELETE | `/api/soundscapes` | Sound presets |
| GET/POST/PUT | `/api/rooms` | Dream room |
| GET/POST | `/api/preferences` | User preferences |

---

## Design System

| Token | Value |
|---|---|
| Primary | `#7DA7D9` |
| Secondary | `#A5C89F` |
| Accent | `#C7B8EA` |
| Background | `#F8F8F8` |
| Text | `#1F2937` |
| Heading font | Sora |
| Body font | Inter |

---

## Deployment

### Frontend (Vercel / Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend (Railway / Render)
Set environment variables and deploy the `server/` folder.

### MongoDB
Use MongoDB Atlas for production. Update `MONGO_URI` in your server environment.

---

## License

MIT — Built as an engineering major project by the Breather team.
