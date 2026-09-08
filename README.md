# FinFlow — Banking Operations Dashboard

A full-stack financial dashboard for connecting accounts, viewing balances and transactions, and initiating transfers through sandbox integrations.

> Portfolio project only. This application is not a bank and must not be used with real financial credentials or production funds.

## What it demonstrates

- Next.js and TypeScript application architecture
- Authentication and server-side data access with Appwrite
- Plaid sandbox account linking and transaction retrieval
- Dwolla sandbox customer and transfer workflows
- Responsive dashboard UI and reusable components
- Secure configuration through environment variables

## Security

Secrets are never committed. Copy `sky/.env.example` to `sky/.env` and insert sandbox-only credentials. If a secret is ever committed, revoke it immediately and scrub it from Git history.

## Local setup

```bash
git clone https://github.com/Mirnamo/Banking_app.git
cd Banking_app/sky
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `sky/.env.example` for the required keys. Use Appwrite, Plaid, and Dwolla sandbox projects for local development.

## Quality checks

```bash
npm run lint
npm run build
```

## Responsible use

No real customer data belongs in this repository. Screenshots and demos should use synthetic accounts and transactions only.

## License

MIT
