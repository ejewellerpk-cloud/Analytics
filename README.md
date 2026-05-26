# Shopperzz Analytics Dashboard

Professional React analytics for **Shopperzz** Laravel ecommerce — live intelligence tracking + store commerce data.

## Stack

- React 19 + Vite 8
- Tailwind CSS 4 + shadcn-style UI (Radix)
- TanStack Query · Axios · ApexCharts · Framer Motion · Lucide

## Quick start

```bash
cd analytics
npm install
cp .env.example .env
# VITE_API_URL, VITE_LICENSE_KEY (same as server VITE_API_KEY)
npm run dev
```

Open **http://localhost:5174**

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Laravel shop URL (e.g. `https://ejeweller.pk`) |
| `VITE_LICENSE_KEY` | Same as server `VITE_API_KEY` |
| `VITE_ECHO_ENABLED` | Laravel Echo (future) |

## Live API endpoints

All routes require Sanctum login + `x-api-key` on auth; intelligence routes use bearer token.

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/login` | Login |
| `GET /api/admin/intelligence/sites` | Analytics sites |
| `GET /api/admin/intelligence/overview` | KPIs |
| `GET /api/admin/intelligence/daily-series` | Daily trend charts |
| `GET /api/admin/intelligence/realtime` | Live visitors & pages |
| `GET /api/admin/intelligence/funnel` | Conversion funnel |
| `GET /api/admin/intelligence/sources` | Traffic sources |
| `GET /api/admin/intelligence/products` | Top viewed products |
| `GET /api/admin/intelligence/export` | CSV report download |
| `GET /api/admin/intelligence/settings` | Tracking / keys |
| `GET /api/admin/intelligence/roles` | Roles & user counts |
| `GET /api/admin/intelligence/commerce/*` | Orders, sales, customers, stock |

**Deploy:** After updating `shopperzz`, run on server: `php artisan route:clear`

## Enterprise intelligence (new)

See [`docs/ENTERPRISE_INTELLIGENCE.md`](docs/ENTERPRISE_INTELLIGENCE.md) for full architecture.

| Route | Status |
|-------|--------|
| `/heatmaps` | Working (click/scroll aggregation) |
| `/ai-insights` | Working (rule engine + cron) |
| `/session-replay` | Sessions list (player Phase 2) |
| `/marketing/recovery`, `/customers/journey`, etc. | Schema + API stubs (UI Phase 4+) |

Backend: `POST /api/analytics/v1/collect/behavior` + `GET /api/admin/intelligence/enterprise/*`

Storefront: `public/analytics/intelligence-tracker.js`

```bash
php artisan migrate
php artisan analytics:generate-insights
php artisan queue:work --queue=analytics
```

## Pages (all live data)

| Route | Data source |
|-------|-------------|
| `/` | Overview + daily series + funnel + sources + commerce totals |
| `/live` | Realtime + recent orders |
| `/orders` | Order statistics, sales summary, funnel |
| `/products` | Product views + best sellers + low stock |
| `/customers` | Top customers + hourly activity |
| `/marketing` | Traffic sources + conversion |
| `/funnels` | Funnel API |
| `/reports` | Export CSV + live snapshots |
| `/integrations` | Intelligence settings |
| `/roles` | Spatie roles |
| `/settings/*` | Environment, profile, API info |

## Production build

```bash
npm run build
npm run preview
```

Deploy `dist/` to static hosting. Set `VITE_API_URL` and `VITE_LICENSE_KEY` for production.
