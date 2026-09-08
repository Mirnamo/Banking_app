# FinFlow Banking Sandbox

A polished full-stack banking operations demo built to show product design, API development, persistent state, business-rule validation, and responsive frontend engineering.

> **Portfolio safety:** FinFlow uses synthetic people, accounts, transactions, and balances. It never requests real bank credentials, personal identity data, or payment information and does not provide financial services.

## What works

- Demo authentication with an HTTP-only session cookie
- Persistent, isolated demo sessions backed by Netlify Blobs
- Account balances and searchable transaction history
- Internal and fictional-recipient transfers
- Server-side amount, account, and overdraft validation
- Editable monthly budgets and progress tracking
- Cash-flow analytics and responsive dashboard UI
- One-click reset to the original synthetic dataset
- Automated tests for core financial-domain rules

## Architecture

| Layer | Technology | Responsibility |
|---|---|---|
| Client | React, Vite, Recharts | Dashboard, workflows, filtering, visualization |
| API | Netlify Functions | Authentication, validation, transfers, budgets |
| Persistence | Netlify Blobs | Per-session sandbox state |
| Quality | Node test runner | Transfer and budget rule tests |

## Run locally

```bash
cd finflow
npm install
npm run dev
```

Use `demo@finflow.dev` and `finflow2026` on the login screen.

```bash
npm test
npm run build
```

## Repository map

- `finflow/` — current portfolio-ready application
- `sky/` — preserved original integration prototype for historical reference; it is not used by the production build

## Deployment

The root `netlify.toml` configures the Vite build, serverless functions, API routing, and SPA fallback. Connect this repository to Netlify and deploy from the repository root.

## License

This repository is provided as a portfolio demonstration. All brand names, customers, account numbers, and transaction records shown in the app are fictional.
