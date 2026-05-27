# ClarityHub Frontend Monorepo

This workspace now supports separate frontend deployments for:

- `@clarity/store` -> `frontend` (customer-facing e-commerce store)
- `@clarity/admin` -> `apps/admin` (admin dashboard app)

## Install

Run from this folder:

```bash
npm install
```

## Development

Run store app:

```bash
npm run dev:store
```

Run admin app:

```bash
npm run dev:admin
```

## Build

Build both apps:

```bash
npm run build
```

Build only store:

```bash
npm run build:store
```

Build only admin:

```bash
npm run build:admin
```

## Deployment

- Store deploy root: `frontend`
- Admin deploy root: `apps/admin`

Each app can be deployed independently with its own environment variables.
