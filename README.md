# B2B Commerce & Ordering

**Portfolio lane:** FAST  
**Target time to first paid deployment:** 6–10 weeks to paid MVP; 12–16 weeks to production maturity

> Build a real, production-capable commercial product. Do not create demo-only flows, fake integrations, hard-coded records, placeholder APIs, or screenshot-level UI that cannot execute the underlying workflow.

## Mission
Wholesale/distributor storefronts, price lists by customer tier, RFQs, quotations, recurring orders, stock availability, delivery workflow, account statements and local payment collection.

## Commercial model
KSh 3,500–25,000/month; setup fees; transaction add-ons via licensed payment partners; branded portals.

## Dependencies / external gates
SME Business OS inventory/customers; delivery partner APIs; payment partner.

## Portfolio role
Builds on the same customer/product/order primitives and can become a high-retention vertical for distributors and importers.


## Definition of done
- Multi-tenant isolation is enforced server-side.
- Authentication, authorization, audit logging, rate limiting and error handling are production-grade.
- Primary customer workflow works end-to-end against real integrations or a documented partner sandbox.
- Data migrations are repeatable.
- Automated tests cover critical paths and failure cases.
- Observability, backups, rollback and incident procedures exist.
- Billing can charge a real customer.
- Production deployment is reproducible from a clean environment.
- Documentation is sufficient for a second engineer to operate the system.

## Build order
1. Validation and narrow ICP.
2. Domain model and tenant/security kernel.
3. Critical workflow.
4. Real integrations.
5. Billing + audit + notifications.
6. Hardening + observability.
7. Pilot with paid design partners.
8. General availability.

## Do not build yet
List non-essential features in `PRD.md` and explicitly defer them.
