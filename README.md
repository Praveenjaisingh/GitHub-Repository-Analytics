# 🚀 GitHub Repository Analytics

A full-stack **GitHub Repository Analytics Dashboard** — Node.js/Express backend, React frontend, PostgreSQL + Redis, GitHub OAuth, and Docker. Search any public GitHub repository and get contributors, commit activity, language breakdown, issues/PRs, releases, a computed **health score**, and exportable reports (PDF/CSV/JSON).

This implements the original spec end-to-end. A few notes on where it differs from the original plan are in **"Implementation notes"** at the bottom — read that before deploying.

---

## ✨ Features

- **Repository search** — keyword search, or jump straight to `owner/repo`
- **Overview** — stars, forks, watchers, open issues, license, branch, topics
- **Language breakdown** — byte distribution + percentage, pie chart
- **Contributors** — ranked by commit count, with avatars
- **Commit activity** — weekly commit chart (last 26 weeks)
- **Issues & Pull Requests** — open/closed/merged counts, labels, recent activity
- **Releases** — full release history + latest release
- **Health Score** — 0–100 score computed from commit activity, popularity, contributors, issue resolution, release frequency, documentation, and community engagement (see formula below)
- **Reports** — export the full analytics bundle as PDF, CSV, or JSON
- **Bookmarks** — signed-in users can save/remove favorite repositories
- **GitHub OAuth login** — required for bookmarks and for analyzing private repos you have access to
- **Caching** — Redis-backed response caching (falls back to in-memory automatically if Redis isn't running)
- **Swagger docs** — live at `/api-docs` on the backend
- **Dockerized** — one `docker compose up` for Postgres + Redis + backend + frontend

---

## 🏗 Tech Stack

**Backend:** Node.js, Express, JavaScript (not TypeScript — see notes), PostgreSQL, Sequelize ORM, ioredis, JWT, GitHub OAuth, Swagger, Winston, Jest + Supertest, PDFKit, json2csv

**Frontend:** React 18, Vite, Tailwind CSS, Recharts, React Query, React Router, Axios

**DevOps:** Docker, Docker Compose, Nginx (frontend static hosting + SPA routing), GitHub Actions CI, Vercel (serverless backend + static frontend), Supabase (managed Postgres)

---

## 📁 Project Structure

```text
github-repository-analytics/
├── backend/
│   ├── src/
│   │   ├── config/          # db, redis, logger, swagger
│   │   ├── controllers/
│   │   ├── middleware/      # auth (JWT), cache, error handler, rate limiter
│   │   ├── models/          # Sequelize models
│   │   ├── migrations/      # sequelize-cli migrations
│   │   ├── routes/
│   │   ├── services/        # githubService, healthScoreService, reportService, repositoryService
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── tests/
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/            # Home, RepositoryDetail, Bookmarks, OAuthCallback
│   │   ├── hooks/
│   │   ├── services/api.js
│   │   ├── contexts/AuthContext.jsx
│   │   └── layouts/MainLayout.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

---

## 🛣 API Endpoints

| Method | Endpoint                                  | Auth      | Description             |
| ------ | ------------------------------------------ | --------- | ------------------------ |
| GET    | `/api/repositories/search?q=`             | optional  | Search repositories      |
| GET    | `/api/repositories/:owner/:repo`          | optional  | Repository overview      |
| GET    | `/api/repositories/:owner/:repo/languages`| optional  | Language breakdown        |
| GET    | `/api/repositories/:owner/:repo/contributors`| optional | Contributors            |
| GET    | `/api/repositories/:owner/:repo/commits`  | optional  | Weekly commit activity   |
| GET    | `/api/repositories/:owner/:repo/issues`   | optional  | Issues                   |
| GET    | `/api/repositories/:owner/:repo/pulls`    | optional  | Pull requests             |
| GET    | `/api/repositories/:owner/:repo/releases` | optional  | Releases                 |
| GET    | `/api/repositories/:owner/:repo/activity` | optional  | Full aggregated analytics|
| GET    | `/api/repositories/:owner/:repo/health`   | optional  | Health score              |
| GET    | `/api/repositories/:owner/:repo/report?format=pdf\|csv\|json` | optional | Export report |
| GET    | `/api/bookmarks`                          | required  | List your bookmarks       |
| POST   | `/api/bookmarks`                          | required  | Bookmark `{owner, repo}`  |
| DELETE | `/api/bookmarks/:id`                      | required  | Remove a bookmark         |
| GET    | `/api/auth/github`                        | —         | Start GitHub OAuth login  |
| GET    | `/api/auth/github/callback`               | —         | OAuth redirect target     |
| GET    | `/api/auth/me`                            | required  | Current signed-in user    |

"optional" auth means logged-in users can also see analytics for private repos they have access to, via their own GitHub token.

---

## ⚙️ Setup

### 1. Create a GitHub OAuth App (only needed for login/bookmarks)

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:5000/api/auth/github/callback`

You'll get a Client ID and Client Secret for the env files below.

### 2. Run with Docker (recommended)

```bash
cp .env.example .env
# edit .env: set JWT_SECRET, and GITHUB_CLIENT_ID/SECRET if you want login

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API docs: http://localhost:5000/api-docs

### 3. Run locally without Docker

**Backend**
```bash
cd backend
cp .env.example .env      # fill in DB creds, JWT_SECRET, etc.
npm install
npm run migrate           # requires a running local Postgres
npm run dev                # http://localhost:5000
```

**Frontend**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

Redis and a GitHub OAuth app are optional for local dev — the app falls back to an in-memory cache and unauthenticated GitHub API calls (rate-limited to 60 req/hr; set `GITHUB_TOKEN` in `backend/.env` to raise that to 5,000/hr).

---

## ☁️ Deploying to Vercel + Supabase

This deploys as **two separate Vercel projects** from the same repo (one for `backend`, one for `frontend`), backed by a **Supabase** Postgres database. Redis is optional in production — without it the app just uses its in-memory cache fallback (fine for most usage; add Upstash Redis later if you want caching to persist across serverless invocations).

### 1. Create the Supabase project
1. Create a project at **https://supabase.com**.
2. Go to **Project Settings → Database → Connection string** and copy two URLs:
   - The **direct connection** (port `5432`) — used once, locally, to run migrations.
   - The **connection pooler** (port `6543`, "Transaction" mode) — used by the deployed app, since serverless functions open/close connections constantly and would otherwise exhaust Supabase's connection limit.

### 2. Run migrations against Supabase (from your machine, before deploying)
```bash
cd backend
cp .env.example .env
# paste the DIRECT (port 5432) Supabase URL into DATABASE_URL, set NODE_ENV=production
npm install
npm run migrate
```

### 3. Deploy the backend to Vercel
1. Import the repo into Vercel as a new project, with **Root Directory** set to `backend`.
2. Vercel will detect `backend/vercel.json` (routes all requests to `api/index.js`, the serverless wrapper around the Express app — no `app.listen()` needed there).
3. Set these Environment Variables in the Vercel project settings:
   - `DATABASE_URL` — the **pooler** URL (port 6543) this time
   - `DB_SSL=true`
   - `NODE_ENV=production`
   - `JWT_SECRET` — a long random string
   - `CLIENT_URL` — your frontend's Vercel URL (set after step 4; you can update this and redeploy)
   - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL` — see step 5
   - `GITHUB_TOKEN` — optional, raises unauthenticated GitHub API rate limits
   - `REDIS_URL` — optional (e.g. an Upstash Redis URL)
4. Deploy. Note the resulting URL, e.g. `https://your-backend.vercel.app`.

### 4. Deploy the frontend to Vercel
1. Import the same repo as a **second** Vercel project, with **Root Directory** set to `frontend`.
2. Vercel auto-detects Vite; `frontend/vercel.json` handles SPA rewrites so client-side routes don't 404 on refresh.
3. Set the environment variable:
   - `VITE_API_URL=https://your-backend.vercel.app/api`
4. Deploy. Note this URL too, e.g. `https://your-frontend.vercel.app`.

### 5. Wire up GitHub OAuth for production
In your GitHub OAuth App settings (or create a second, production-only OAuth App):
- Homepage URL: `https://your-frontend.vercel.app`
- Authorization callback URL: `https://your-backend.vercel.app/api/auth/github/callback`

Then set on the **backend** Vercel project:
- `GITHUB_CALLBACK_URL=https://your-backend.vercel.app/api/auth/github/callback`
- `CLIENT_URL=https://your-frontend.vercel.app`

Redeploy the backend after changing env vars (Vercel doesn't hot-reload them).

### Notes specific to this setup
- **Auto-sync is disabled in production** (`sequelize.sync()` only runs when `NODE_ENV=development`). Schema changes go through `npm run migrate`, run manually against Supabase — never automatically on a serverless cold start.
- **Use the pooler URL for the deployed app, the direct URL for migrations.** Mixing these up is the most common Supabase-on-serverless mistake.
- **Function timeouts**: `/activity`, `/health`, and `/report` fan out ~7 GitHub API calls in parallel. This normally finishes well within Vercel's default 10s (Hobby plan) function timeout, but very large repos may occasionally run close to it — the Pro plan raises this to 60s if needed.

---

## 🧪 Tests

```bash
cd backend
npm test
npm run test:coverage
```

---

## 📊 Health Score Formula

0–100 score, computed live from GitHub data (see `backend/src/services/healthScoreService.js`):

| Signal                | Weight |
| ---------------------- | ------ |
| Recent commit activity | 25     |
| Popularity (stars/forks)| 15     |
| Active contributors     | 15     |
| Issue resolution ratio  | 15     |
| Release frequency       | 10     |
| Documentation (description quality) | 10 |
| Community engagement (watchers) | 10 |

Score maps to a 1–5 star rating (★★★★★ = 90+, down to ★ below 35).

---

## 🛡 Security

JWT auth · Helmet · rate limiting · input validation (express-validator) · CORS · parameterized queries via Sequelize · secrets kept out of source control via `.env`

---

## 📜 License

MIT

---

## 📝 Implementation notes (read this)

The original README specified some things this build intentionally simplifies, to keep the app real and runnable rather than a shell of stubs:

- **JavaScript, not TypeScript.** You confirmed plain JS to match your existing code style, so the whole backend is JS + Sequelize rather than TS + Prisma.
- **Sequelize, not Prisma** — the original README offered either; Sequelize was used.
- **Redis is optional at runtime.** If `REDIS_URL` isn't reachable, caching transparently falls back to an in-memory Map so local dev doesn't require Docker. In `docker-compose.yml`, Redis is a real service.
- **"Historical Growth Tracking" is partially implemented.** Every time a repo's analytics are fetched, a row is written to `analytics_snapshots` — but there's no dedicated endpoint/chart for growth-over-time yet (it's in the original README's "Future Enhancements" list too).
- **GitHub OAuth is required only for**: bookmarks, and analyzing private repos you own/collaborate on. Public repo analytics work with zero login.
- The zip you originally uploaded contained an unrelated `yt-dlp`-based link downloader (not GitHub analytics) with a shell-injection vulnerability in `downloader.js`, plus a `.env` with real credentials. None of that code was reused; you should rotate those leaked credentials if they're still live.
