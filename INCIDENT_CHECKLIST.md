# B2B Commerce — Incident Checklist
- [ ] `http://localhost:7312/api/v1/health` — check db=up
- [ ] Inspect recent structured logs; correlate via `x-correlation-id`
- [ ] `npx prisma migrate status` in `app/`
- [ ] Provider sandboxes reachable (adapter errors must be explicit, not silent)
- [ ] Roll back via git + rebuild; restore DB backup if necessary
- [ ] Notify stakeholders with ETA; write postmortem
