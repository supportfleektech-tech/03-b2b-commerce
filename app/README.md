# B2B Commerce — App

Kenya-first B2B commerce & ordering. Next.js 15 + TypeScript + Prisma + PostgreSQL.

## Quick start
```bash
cd app
cp .env.example .env
# adjust DATABASE_URL to postgresql://postgres:postgres@localhost:5433/b2b_commerce_dev
docker start kenya254-pg
docker exec kenya254-pg psql -U postgres -c "CREATE DATABASE b2b_commerce_dev;"
npm install
npx prisma migrate dev
npm run db:seed
npm run dev    # http://localhost:7312
```
Demo org: `00000000-0000-0000-0000-000000000003`, user `buyer@demo.co.ke`.

## Tests
`npm run typecheck && npm test && npm run build && npx tsx scripts/smoke.ts` (dev server running)
