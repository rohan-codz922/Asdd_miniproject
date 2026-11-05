# ShopNext – DevOps Pipeline

> Mini Project | Subject: DevOps | Branch: `devops-pipeline`

---

## Architecture Overview

```
Developer's machine
        │
        │  git push → main / PR
        ▼
┌───────────────────────────────────────────────────────────────┐
│                   GitHub Actions (CI/CD)                      │
│                                                               │
│  Job 1: build-test          Job 2: docker-release             │
│  ─────────────────          ──────────────────────            │
│  npm ci                     docker build (multi-stage)        │
│  npm run lint       ──►     docker push → ghcr.io             │
│  npm test                   tags: :sha + :latest              │
│  npm run build                       │                        │
│                                      ▼                        │
│                             Job 3: deploy                     │
│                             ──────────────                    │
│                             curl POST → Render deploy hook    │
└───────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │   Render (production)    │
                        │   pulls ghcr.io:latest   │
                        │   runs on port 3000      │
                        └─────────────────────────┘
                                      │
                              /api/health ◄──── UptimeRobot (every 5 min)
                                      │
                              Sentry (optional) ◄── runtime errors
```

---

## Pipeline Stages

### Stage 1 – Code Quality (lint + test + build)

**What it does:** Every push or pull request to `main` triggers this job.
It enforces code quality gates before anything reaches production.

| Step | Command | Purpose |
|------|---------|---------|
| Install | `npm ci` | Reproducible install from `package-lock.json` |
| Lint | `npm run lint` | ESLint via `next lint`; fails on any error |
| Test | `npm test` | 16 Jest + RTL tests; fails if any test fails |
| Build | `npm run build` | TypeScript compile + Next.js production build |

### Stage 2 – Docker Build & Publish

**What it does:** Only on a direct push to `main` (not PRs), after Stage 1 passes.
Builds a minimal Docker image and publishes it to GitHub Container Registry (GHCR).

The Dockerfile uses **three stages**:
1. `deps` – install production deps only (`npm ci --omit=dev`)
2. `builder` – install all deps, run `next build` with `output: standalone`
3. `runner` – copy only `.next/standalone` + static + public into a fresh Alpine image

The final image is ~150 MB instead of ~1 GB because `standalone` output includes
only the Node.js files needed to run the server — no dev dependencies.

`NEXT_PUBLIC_*` variables are accepted as Docker build args so they are baked into
the client bundle at build time without being committed to source code.

### Stage 3 – Deploy to Render

**What it does:** After the Docker image is published, one `curl POST` request to
Render's deploy hook URL triggers Render to pull the new `latest` image and restart
the service. No SSH, no Kubernetes — just a webhook.

### Health Check

`GET /api/health` returns `{ "status": "ok" }` with HTTP 200.
Used by:
- **UptimeRobot** to check availability every 5 minutes
- **Docker** can use this as a `HEALTHCHECK` command

### Monitoring – Sentry (optional)

Sentry initialises only if `NEXT_PUBLIC_SENTRY_DSN` is set (see `instrumentation.ts`).
When enabled it captures unhandled exceptions and performance traces.

---

## Local Development Commands

```bash
# Install dependencies
npm install

# Start dev server (hot reload on http://localhost:3000)
npm run dev

# Lint the codebase
npm run lint

# Run all tests (Jest + React Testing Library)
npm test

# Production build (also validates TypeScript)
npm run build

# Start production server locally (after build)
npm run start
```

### Docker Locally

> Requires Docker Desktop to be running.

```bash
# Build the image
docker build -t shopnext:local .

# Run the container
docker run -p 3000:3000 shopnext:local

# Pass NEXT_PUBLIC_* vars at build time
docker build \
  --build-arg NEXT_PUBLIC_SENTRY_DSN=https://... \
  -t shopnext:local .

# Open http://localhost:3000
```

---

## Enabling Sentry (optional)

```bash
# 1. Install the SDK
npm install @sentry/nextjs

# 2. Set the DSN environment variable
#    - Locally: add to .env.local
#    NEXT_PUBLIC_SENTRY_DSN=https://xxxx@oyyy.ingest.sentry.io/zzzz

# 3. Uncomment the init() calls in instrumentation.ts

# 4. Add NEXT_PUBLIC_SENTRY_DSN as a GitHub Secret (see checklist below)
```

---

## UptimeRobot Setup

1. Create a free account at **uptimerobot.com**
2. Click **Add New Monitor**
3. Settings:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `ShopNext Health`
   - URL: `https://<your-render-domain>/api/health`
   - Monitoring Interval: **5 minutes**
4. Add an email alert contact
5. Save — UptimeRobot will ping `/api/health` every 5 minutes and email you if it goes down

---

## Manual Steps Checklist

The following steps **cannot be automated** and must be done manually.

### A. GitHub Repository Settings

- [ ] Go to your repo → **Settings → Actions → General**
  - Set "Workflow permissions" → **Read and write permissions**
  - Check **Allow GitHub Actions to create and approve pull requests**
- [ ] Go to **Settings → Packages**
  - After the first workflow run, find the `asdd-miniproject` package
  - Change visibility to **Public** (so Render can pull the image without auth)

### B. GitHub Secrets

Go to **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|-------------|-------|
| `RENDER_DEPLOY_HOOK_URL` | The deploy hook URL from your Render service (see Step D) |
| `NEXT_PUBLIC_SENTRY_DSN` | Your Sentry DSN (only if using Sentry) |

### C. Push the devops-pipeline branch to GitHub

```bash
# Rename local master to main to match GitHub default
git branch -m master main

# Push both branches
git push -u origin main
git push -u origin devops-pipeline

# Open a Pull Request from devops-pipeline → main on GitHub
# The CI pipeline will run automatically on the PR
# Merge the PR to trigger docker-release and deploy
```

### D. Render Service Setup

1. Sign up at **render.com** (free tier available)
2. Click **New → Web Service**
3. Choose **Deploy an existing image**
4. Image URL: `ghcr.io/rohan-codz922/asdd_miniproject:latest`
   *(exact lowercase, matches your GitHub username and repo name)*
5. Set:
   - Name: `shopnext`
   - Region: Singapore (closest to India)
   - Port: `3000`
6. Under **Deploy Settings** → copy the **Deploy Hook URL**
7. Paste it into the GitHub secret `RENDER_DEPLOY_HOOK_URL`
8. Add any runtime environment variables your app needs (e.g. `NODE_ENV=production`)
9. Click **Create Web Service**

### E. UptimeRobot

- [ ] Follow the UptimeRobot Setup section above
- [ ] Monitor URL: `https://<your-render-subdomain>.onrender.com/api/health`

---

## Environment Variables Reference

| Variable | Where used | Required? | Notes |
|----------|-----------|-----------|-------|
| `NODE_ENV` | Runtime | Yes (auto) | Set to `production` by Dockerfile |
| `PORT` | Runtime | Yes (auto) | Set to `3000` by Dockerfile |
| `NEXT_PUBLIC_SENTRY_DSN` | Build-time + runtime | No | Enables Sentry if set |
| `RENDER_DEPLOY_HOOK_URL` | GitHub Actions secret | Yes (for deploy) | Never commit this |
