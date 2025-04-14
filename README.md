This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.


# Deployment/Dev notes

Docker:
```bash
docker compose build --no-cache
docker compose logs backend
docker compose up --no-cache
docker compose down
```
In frontend:
```bash
npm run dev
NODE_OPTIONS='--inspect' npm run dev
DEBUG=* npm run dev
```

In backend:
```bash
npm start
```
Postgres:
```bash
psql -h localhost -p 5432 -U user -d vhsdb -W -c "CREATE DATABASE my_app_db;"

psql -h localhost -p 5432 -U user -d vhsdb -W -c "\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) UNIQUE NOT NULL,\n  email VARCHAR(100) UNIQUE NOT NULL,\n  password VARCHAR(255) NOT NULL,\n  created_at TIMESTAMP DEFAULT NOW()\n);"
```
Interactive
```bash

 psql -U user -h localhost -d vhsdb

vhsdb=# CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


```

Clean cache
Client-side:
```bash
cd ~/sites/vhs && npm cache clean --force
cd ~/sites/vhs/frontend && npm cache clean --force
cd ~/sites/vhs/backend && npm cache clean --force

cd ~/sites/vhs/frontend &&  rm -rf frontend/.next
```

Server-side:
docker-compose exec frontend rm -rf node_modules/.cache
