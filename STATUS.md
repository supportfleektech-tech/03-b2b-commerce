# B2B Commerce — Status

## Completed
- [x] Multi-tenant kernel + RBAC + audit + api_keys
- [x] Vendors, products, price lists, purchase orders (DRAFT→SENT→APPROVED→RECEIVED→RECONCILED/CANCELLED)
- [x] Mobile-first UI (dashboard, vendors, products, POs)
- [x] Prisma migration + seed + tests
- [x] Rate-limited, correlated API surface (`src/server/modules/http.ts`)
- [x] Dockerfile + Compose + CI
- [x] Smoke under `scripts/smoke.ts`; passes locally

## Next
- Receiving + reconciliation flows
- Supplier credit terms + dunning
- Catalog export / supplier portal
