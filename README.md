# HeritageGuesser

> A Vietnamese cultural heritage guessing game powered by AI, Street View, and NLP.

HeritageGuesser drops you into a Google Street View of a real Vietnamese UNESCO or national heritage site. Your mission: explore the surroundings, chat with **Toto** (your AI turtle guide), and guess the heritage's name and age. The closer you are, the more XP and rank points you earn. Compete on the global leaderboard and climb from Iron to Challenger.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Pages & Components](#pages--components)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Contributing Heritage Sites](#contributing-heritage-sites)

---

## Features

- **Street View Exploration** — Explore real Google Street View panoramas of Vietnamese heritage sites.
- **AI Chat Assistant (Toto)** — A Gemini-powered turtle character gives clues without spoiling the answer. Rules-bound to never reveal the heritage name or age.
- **NLP Answer Validation** — Multilingual sentence embeddings (MarianMT + SentenceTransformers) score your guesses even if spelled differently or in Vietnamese.
- **Ranked Mode** — 10-tier ranking system (Iron → Challenger) with win/loss-based progression and a 5-star progress bar per rank.
- **AI-Personalized Rounds** — Gemini analyses your last 30 games and recommends the next 3 heritage sites targeting your weak regions or preferred difficulty.
- **Study Mode** — Browse all heritage cards with search, filter, and region tags — no gameplay pressure.
- **Discover Mode** — Geocode any address to a Google Street View for free exploration.
- **Bilingual UI** — Full English / Vietnamese toggle across all pages.
- **Leaderboard** — Top 20 players with podium display and rank tiers.
- **Secure Auth** — JWT access + refresh tokens stored in httpOnly cookies. Bcrypt password hashing. Google OAuth via Supabase with profile picture sync. Accounts created via Google are blocked from password login with a clear error message.
- **Community Contributions** — Authenticated users can submit new heritage sites via Google Maps URL. Gemini auto-generates cultural metadata (description, era, region, difficulty). Submissions enter a pending review queue before going live.

---

## Tech Stack

| Layer      | Technology                                                                    |
| ---------- | ----------------------------------------------------------------------------- |
| Frontend   | React 19, Vite 7, TailwindCSS 4, Framer Motion, React Router DOM 7            |
| Maps       | Google Maps JavaScript API, React Google Maps API, Leaflet                    |
| Backend    | Node.js, Express 5, MySQL2, JWT, bcrypt, Helmet                               |
| Auth       | Supabase (Google OAuth), JWT httpOnly cookies, Passport.js                    |
| AI / NLP   | Google Gemini 2.5 Flash (chat + personalization), FastAPI (NLP server)        |
| NLP Models | MarianMT (Vi→En translation), Sentence-Transformers (multilingual embeddings) |
| Database   | MySQL                                                                         |

---

## File Structure

```
HeritageGuesser/
├── BackEnd/
│   ├── Config/
│   │   └── db.js                       # MySQL connection pool
│   ├── Controllers/
│   │   ├── authController.js                 # Register, login, logout, token refresh, get player
│   │   ├── chatController.js                 # Toto AI chat (Gemini)
│   │   ├── contributeLocationController.js   # Submit / list community heritage contributions
│   │   ├── DiscoverController.js             # Google Geocoding for Street View discovery
│   │   ├── heritageCheck.js                  # Forwards guess to NLP server for scoring
│   │   ├── historyController.js              # Record game results in player_history
│   │   ├── LeaderboardController.js          # Top 20 players query
│   │   ├── locationController.js             # Get all / random heritage locations
│   │   ├── personalizeController.js          # Gemini-powered location recommendations
│   │   └── playerController.js               # Update player level and rank
│   ├── Middleware/
│   │   ├── errorHandler.js                   # Global Express error handler
│   │   └── verifyPlayer.js                   # JWT authentication middleware
│   ├── Routes/
│   │   ├── authRoutes.js                     # /register /login /logout /player /refresh-token
│   │   ├── chatRoutes.js                     # /chat
│   │   ├── contributeLocationRoutes.js        # /contribute
│   │   ├── discoverRoutes.js                 # /discover/search
│   │   ├── heritageRoutes.js                 # /heritage/check
│   │   ├── historyRoutes.js                  # /player/history
│   │   ├── LeaderboardRoutes.js              # /leaderboard
│   │   ├── locationRoutes.js                 # /locations /locations/random
│   │   ├── PersonalizeRoutes.js              # /personalize/next-set
│   │   └── playerRoutes.js                   # /player/update-level /player/update-rank
│   ├── server.js                       # Express entry point (port 8081)
│   ├── package.json
│   └── .env                            # Backend secrets (see Environment Variables)
│
├── FrontEnd/
│   ├── public/
│   │   ├── banner2.mp4                       # Homepage hero background video (no audio)
│   │   ├── intro.mp4                         # Loading screen cinematic video (with audio)
│   │   ├── banner.png
│   │   ├── VietnamCastle.png
│   │   └── vietnammap.png
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Animations/
│   │   │   │   ├── FullScreenTransition.jsx  # Full-screen loading overlay
│   │   │   │   └── PageWrapper.jsx           # Framer Motion page transitions
│   │   │   ├── Contribute/
│   │   │   │   └── ContributeHeritage.jsx    # Community heritage submission & history
│   │   │   ├── Discover/
│   │   │   │   └── Discover.jsx              # Geocoding + Street View explorer
│   │   │   ├── Game/
│   │   │   │   └── Game.jsx                  # Core gameplay (Street View + guessing + chat)
│   │   │   ├── Homepage/
│   │   │   │   └── Homepage.jsx              # Landing page with top 2 leaderboard preview
│   │   │   ├── Leaderboard/
│   │   │   │   └── Leaderboard.jsx           # Full leaderboard with podium
│   │   │   ├── MultiplePlayer/               # (Planned: multiplayer mode)
│   │   │   ├── Rank/
│   │   │   │   ├── Rank.jsx                  # Player rank dashboard + progress bar
│   │   │   │   └── RankPlay.jsx              # Ranked match game mode
│   │   │   ├── Sidebar/
│   │   │   │   └── Sidebar.jsx               # Mobile hamburger menu
│   │   │   ├── Study/
│   │   │   │   └── Studypage.jsx             # Heritage card browser with search/filter
│   │   │   ├── Tutorial/
│   │   │   │   └── Tutorial.jsx              # Step-by-step onboarding guide
│   │   │   ├── UI/
│   │   │   │   └── AuthToast.jsx             # Toast notification component
│   │   │   ├── AuthCallback.jsx              # Google OAuth redirect handler (Supabase → app JWT)
│   │   │   ├── LoadingScreen.jsx             # Cinematic intro screen shown once per session
│   │   │   ├── Login.jsx                     # Login form
│   │   │   ├── Navbar.jsx                    # Fixed top navigation bar
│   │   │   └── Register.jsx                  # Registration form
│   │   ├── Config/
│   │   │   └── supabase.js                   # Supabase client initialisation
│   │   ├── Context/
│   │   │   ├── authContext.jsx               # Global auth state (user, token, avatar)
│   │   │   ├── languageContext.jsx            # i18n language toggle context
│   │   │   └── ProtectedRoute.jsx            # Route guard for authenticated routes
│   │   ├── translations.js                   # English / Vietnamese string map
│   │   ├── App.jsx                           # Root router with all routes
│   │   ├── main.jsx                          # Vite entry, wraps app in providers
│   │   └── index.css                         # Global styles + Tailwind directives
│   ├── vite.config.js                        # Vite: React plugin, Tailwind, /api proxy
│   ├── package.json
│   ├── index.html
│   └── .env                                  # Frontend env vars (VITE_ prefix)
│
├── nlp/
│   ├── main.py                               # FastAPI server (port 8000)
│   ├── routers/
│   │   └── heritage.py                       # POST /heritage/check — NLP scoring
│   ├── .env                                  # NLP database credentials
│   └── venv/                                 # Python virtual environment
│
└── .gitignore
```

---

## Pages & Components

### Loading Screen (first visit only)

A full-screen cinematic intro that plays `intro.mp4` with sound on first visit. Features a 7-second animated progress bar, bouncing loading dots, and a **Skip** button that appears once the bar completes. Auto-dismisses after 12 seconds. Shown only once per browser session — navigating back to the homepage skips it.

### Homepage (`/`)

Landing page with a looping `banner2.mp4` hero video (muted), app description, and a preview of the top 2 leaderboard players. Entry point for new and returning users.

### Game (`/game`)

The core experience:

1. Fetches 3 random heritage locations from the backend.
2. Loads Google Street View at the heritage site coordinates.
3. Player explores freely and enters a name + age guess.
4. Chat sidebar lets the player ask **Toto** for hints at any time.
5. On submit, the guess is sent to the NLP backend for similarity scoring.
6. Score (0–5 stars per category) is displayed; XP and rank are updated.
7. Gemini recommends the next personalized round automatically.

### RankPlay (`/game/rank`)

Full-screen ranked mode. Same gameplay as `/game` but every result impacts the player's rank tier and progress stars.

### Rank (`/rank`)

Player profile page showing:

- Current rank tier (Iron → Challenger) with a badge icon.
- 5-star progress bar within the current tier.
- Level, total XP, and game history summary.

### Leaderboard (`/leaderboard`)

Global rankings. Top 3 players displayed on a gold/silver/bronze podium. Remaining players listed in a scrollable table with their rank tier, level, and username.

### Study (`/study`)

Heritage card browser with no guessing pressure. Browse all sites with their region, type, era, difficulty, and description. Supports text search and region/type filters for learning before playing.

### Discover (`/explore`)

Type any address or landmark into a search bar. The app geocodes it via Google Maps and opens a Street View at those coordinates for free exploration. Rate-limited to 4 searches per user per day.

### Tutorial (`/tutorial`)

Step-by-step onboarding walkthrough explaining how to play, how scoring works, and how to use Toto. Available in both English and Vietnamese.

### Contribute (`/contribute`)

Community heritage submission portal. Authenticated users can:

- Submit a new heritage site by name + Google Maps URL. Coordinates are extracted automatically.
- Optionally add a cultural description; Gemini fills in any missing metadata (era, region, difficulty, aliases).
- Track all their past submissions with live status badges: **Pending**, **Approved**, or **Declined**.

### Login (`/login`) & Register (`/register`)

Auth forms with client-side validation, error toasts via `AuthToast`, and redirect to the homepage on success.

### Navbar & Sidebar

- **Navbar** — Fixed top bar with logo, page links, and language toggle (EN/VI).
- **Sidebar** — Collapsible hamburger menu for mobile navigation.

---

## API Endpoints

**Backend base URL:** `http://localhost:8081/api`  
**NLP base URL:** `http://localhost:8000`

### Authentication

| Method | Endpoint         | Auth | Description                                                                          |
| ------ | ---------------- | ---- | ------------------------------------------------------------------------------------ |
| `POST` | `/register`      | No   | Create account. Body: `{ name, email, password }`                                                                          |
| `POST` | `/login`         | No   | Log in. Body: `{ email, password }`. Sets httpOnly cookies. Returns error if account is Google-only (no password set).     |
| `GET`  | `/logout`        | No   | Clear auth cookies.                                                                                                         |
| `POST` | `/refresh-token` | No   | Generate new access token using refresh cookie.                                                                             |
| `GET`  | `/player`        | Yes  | Return current user `{ id, name, email, level, rank, rank_progress, avatar_url }`.                                         |
| `POST` | `/auth/google`   | No   | Body: `{ access_token }` (Supabase token). Verifies with Supabase, finds/creates MySQL user, syncs avatar, sets cookies.  |

### Locations

| Method | Endpoint                    | Auth | Description                                          |
| ------ | --------------------------- | ---- | ---------------------------------------------------- |
| `GET`  | `/locations`                | No   | Return all heritage sites with computed `years_old`. |
| `GET`  | `/locations/random?count=3` | No   | Return N random locations (max 20, default 3).       |

### Heritage Check

| Method | Endpoint          | Auth | Description                                                                                             |
| ------ | ----------------- | ---- | ------------------------------------------------------------------------------------------------------- |
| `POST` | `/heritage/check` | No   | Body: `{ answer, locationId }`. Forwards to NLP server. Returns location data + similarity score (0–1). |

### Chat

| Method | Endpoint | Auth | Description                                                                                |
| ------ | -------- | ---- | ------------------------------------------------------------------------------------------ |
| `POST` | `/chat`  | Yes  | Body: `{ message, locationId? }`. Returns Toto AI response. Will never reveal name or age. |

### Leaderboard

| Method | Endpoint       | Auth | Description                                             |
| ------ | -------------- | ---- | ------------------------------------------------------- |
| `GET`  | `/leaderboard` | No   | Top 20 players ordered by rank → rank_progress → level. |

### Player

| Method | Endpoint               | Auth | Description                                                                    |
| ------ | ---------------------- | ---- | ------------------------------------------------------------------------------ |
| `POST` | `/player/update-level` | Yes  | Body: `{ levelGain }`. Add XP to player.                                       |
| `POST` | `/player/update-rank`  | Yes  | Body: `{ levelGain, result }`. `result`: `"win"` or `"loss"`.                  |
| `POST` | `/player/history/`     | Yes  | Body: `{ locationId, score, nameScore, ageScore, difficulty }`. Record a game. |

### Discover

| Method | Endpoint                     | Auth | Description                                                             |
| ------ | ---------------------------- | ---- | ----------------------------------------------------------------------- |
| `GET`  | `/discover/search?query=Hue` | No   | Geocode address via Google Maps API. Rate-limited: 4 requests/user/day. |

### Personalization

| Method | Endpoint                | Auth | Description                                                                          |
| ------ | ----------------------- | ---- | ------------------------------------------------------------------------------------ |
| `GET`  | `/personalize/next-set` | Yes  | Returns 3 AI-recommended location IDs based on player's last 30 games. Cached 5 min. |

### Contributions

| Method | Endpoint      | Auth | Description                                                                                                                     |
| ------ | ------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/contribute` | Yes  | Body: `{ name, mapsUrl, userDescription? }`. Extracts coordinates from Maps URL, calls Gemini for metadata, saves as `pending`. |
| `GET`  | `/contribute` | Yes  | Returns all submissions made by the authenticated user, ordered by date descending.                                             |

### NLP Server (internal)

| Method | Endpoint          | Description                                                                                                                                             |
| ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/heritage/check` | Body: `{ answer, location_name, aliases }`. Translates Vietnamese input via MarianMT, then returns cosine similarity score via multilingual embeddings. |

---

## Database Schema

**Database name:** `heritagedb`

### `Users`

```sql
CREATE TABLE users (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password      VARCHAR(255) NULL,                          -- bcrypt hash; NULL for Google-only accounts
  google_id     VARCHAR(100) UNIQUE NULL,                   -- Google OAuth subject ID (Supabase user ID)
  avatar_url    TEXT NULL,                                  -- Google profile picture URL; synced on every Google login
  level         INT NOT NULL DEFAULT 0 CHECK (level >= 0),
  `rank`        INT NOT NULL DEFAULT 1 CHECK (`rank` BETWEEN 1 AND 10),   -- 1–10 (see tier table)
  rank_progress INT NOT NULL DEFAULT 0 CHECK (rank_progress BETWEEN 0 AND 5)
);
```

> **Migration** — if upgrading an existing database:
> ```sql
> ALTER TABLE users
>   ADD COLUMN google_id VARCHAR(100) UNIQUE NULL,
>   ADD COLUMN avatar_url TEXT NULL,
>   MODIFY COLUMN password VARCHAR(255) NULL;
> ```

### `locations`

```sql
CREATE TABLE locations (
  id          INT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  region      VARCHAR(100),           -- 'North' | 'Central' | 'South'
  built_year  INT,
  difficulty  INT,                    -- 1 (easy) → 5 (hard)
  lat         DECIMAL(10, 8),
  lng         DECIMAL(11, 8),
  description TEXT,
  aliases     VARCHAR(500),           -- comma-separated alternate names
  era         VARCHAR(100),
  type        VARCHAR(50),            -- 'Cultural' | 'Natural' | 'Mixed'
  imageUrl    TEXT
);
```

### `player_history`

```sql
CREATE TABLE player_history (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  location_id INT NOT NULL,
  score       INT,
  name_score  INT,                    -- name similarity (0–5)
  age_score   INT,
  difficulty  INT,
  date_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES Users(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);
```

### `contribute_location`

```sql
CREATE TABLE contribute_location (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  lat         DECIMAL(10, 8) NOT NULL,
  lng         DECIMAL(11, 8) NOT NULL,
  user_id     INT NOT NULL,
  built_year  INT,
  aliases     VARCHAR(500),
  region      VARCHAR(100),
  era         VARCHAR(100),
  difficulty  INT CHECK (difficulty BETWEEN 1 AND 3),
  status      ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Rank Tiers

| `rank` value | Tier        |
| ------------ | ----------- |
| 1            | Iron        |
| 2            | Bronze      |
| 3            | Silver      |
| 4            | Gold        |
| 5            | Platinum    |
| 6            | Emerald     |
| 7            | Diamond     |
| 8            | Master      |
| 9            | Grandmaster |
| 10           | Challenger  |

Win → +1 progress star. Loss → −1 progress star. Reach 5 stars → promote. Drop below 0 → demote.

---

## Environment Variables

Copy and fill in each `.env` file. **Never commit `.env` files — they are gitignored.**

### `BackEnd/.env`

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=heritagedb

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GEMINI_API_KEY=your_gemini_api_key

# Google OAuth (via Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# NLP microservice
API_BASE_URL=http://localhost:8000

# App
NODE_ENV=development
PORT=8081
BACKEND_URL=http://localhost:8081
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_WWW=https://www.yourdomain.com
```

### `FrontEnd/.env`

```env
VITE_API_BASE_URL=/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_BACKEND_URL=http://localhost:8081

# Supabase (Google OAuth)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### `nlp/.env`

```env
DB_USER=root
DB_PASS=your_db_password
DB_HOST=localhost
DB_NAME=heritagedb
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+
- Python 3.10+
- Google Cloud project with **Maps JavaScript API** and **Geocoding API** enabled
- Google **Gemini API** key

### 1. Database

```bash
mysql -u root -p
CREATE DATABASE heritagedb;
# Import your schema and seed data
```

### 2. Backend

```bash
cd BackEnd
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on port 8081
```

### 3. NLP Server

```bash
cd nlp
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your values
python3 -m uvicorn main:app --reload --port 8000
```

### 4. Frontend

```bash
cd FrontEnd
cp .env.example .env   # fill in your values
npm install
npm run dev            # starts on port 5173, proxies /api → port 8081
```

### 5. Open the app

Navigate to `http://localhost:5173`

---

## Contributing Heritage Sites

Any logged-in user can expand the game's archive directly from the `/contribute` page.

1. **Find** the heritage site on [Google Maps](https://maps.google.com) and navigate to its Street View.
2. **Copy** the full URL from the browser address bar — it must contain `@lat,lng` coordinates.
3. **Submit** the URL and site name via the form. Optionally add a cultural description.
4. **Gemini** auto-generates the era, region, difficulty, and aliases.
5. **Wait for review** — curators approve or decline each submission. Status is visible on your contributions panel.

---

## Contact

For questions, collaboration inquiries, or feedback about Heritage Guessr:

**Le Trung Hieu** — Lead Developer & Project Author  
Delta Global School, Hanoi, Vietnam  
Email: [lthieu@stu.dgs.org.vn](mailto:lthieu@stu.dgs.org.vn)

This project was conceived and built at **Delta Global School (DGS)** as part of an initiative to preserve and promote Vietnamese cultural heritage through technology. Heritage Guessr is currently being piloted at Delta Global School and Luong Van Can High School, reaching over 600 students.

---

## License & Ownership

Copyright © 2025 Le Trung Hieu and the Heritage Guessr Team. All rights reserved.

All source code, design, written content, AI logic, and associated assets in this repository were created and are owned by **Le Trung Hieu** and contributors of the Heritage Guessr project, developed at **Delta Global School, Ho Chi Minh City, Vietnam**.

### Terms of Use

- **Personal / educational use** — You may view and study this codebase for personal learning or educational purposes.
- **No redistribution** — You may not copy, republish, sell, or distribute this code or any derivative of it without explicit written permission from the author.
- **No commercial use** — This project may not be used for commercial purposes without prior written consent.
- **No cloning or rebranding** — Creating competing products or services substantially derived from this codebase is prohibited.
- **Attribution required** — Any permitted use must include clear attribution to the original project and author.

### Third-Party Services

This project integrates third-party APIs and libraries, each subject to their own terms:

- [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms)
- [Google Gemini API Terms](https://ai.google.dev/gemini-api/terms)
- [Hugging Face Terms of Service](https://huggingface.co/terms-of-service)

### Disclaimer

Heritage Guessr is provided as-is for educational and cultural promotion purposes. The authors make no warranty regarding accuracy of historical data. Heritage information is sourced from verified databases and cross-referenced where possible, but users should consult official sources for academic or professional use.

---

_Lan tỏa, kết nối và gìn giữ — Spread, connect, and preserve._
