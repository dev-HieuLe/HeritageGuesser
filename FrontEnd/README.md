# HeritageGuesser — Frontend

React 19 + Vite 7 frontend for the Heritage Guessr application.

## Tech

- **React 19** with React Router DOM 7
- **Vite 7** (dev server on port 5173, `/api` proxied to backend port 8081)
- **TailwindCSS 4** for styling
- **Framer Motion** for page transitions
- **Three.js / @react-three/fiber / @pixiv/three-vrm** for the 3D VRM avatar
- **Leaflet** for mini-maps
- **Supabase JS** for Google OAuth

## Setup

```bash
cp .env.example .env   # fill in VITE_ vars
npm install
npm run dev
```

## Environment Variables

```env
VITE_API_BASE_URL=/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_BACKEND_URL=http://localhost:8081
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Routes

| Path          | Component           | Description                                |
| ------------- | ------------------- | ------------------------------------------ |
| `/`           | Homepage            | Landing page with leaderboard preview      |
| `/game`       | Game                | Core gameplay (Street View + guessing)     |
| `/game/rank`  | RankPlay            | Ranked mode gameplay                       |
| `/rank`       | Rank                | Player rank dashboard                      |
| `/leaderboard`| Leaderboard         | Global top 20 players                      |
| `/study`      | Studypage           | Heritage card browser                      |
| `/study/:id`  | LessonDetail        | Heritage lesson with XP rewards            |
| `/explore`    | Discover            | Free Street View explorer                  |
| `/shop`       | Shop                | XP reward merchandise shop                 |
| `/settings`   | Settings            | Account management                         |
| `/tutorial`   | Tutorial            | Onboarding guide (EN/VI)                   |
| `/contribute` | ContributeHeritage  | Community heritage submissions             |
| `/login`      | Login               | Login form                                 |
| `/register`   | Register            | Registration form                          |
| `/auth/callback` | AuthCallback     | Google OAuth redirect handler              |

See the [root README](../README.md) for full project documentation.
