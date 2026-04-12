# API Reference

> The Morrigan API server has not yet been implemented. This directory will contain the full API reference once v0.3.0 is under development.

---

## Planned endpoints (draft)

### Authentication
- `POST /auth/magic-link` — request a magic link
- `GET  /auth/verify/:token` — verify magic link token
- `POST /auth/logout`

### Vaults
- `POST /vaults` — create a new vault
- `GET  /vaults/:id` — get vault metadata
- `DELETE /vaults/:id` — delete vault
- `GET  /vaults/:id/items` — list vault items (metadata only, encrypted)

### Vault items
- `POST   /vaults/:id/items` — upload encrypted item
- `GET    /vaults/:id/items/:itemId` — download encrypted item
- `DELETE /vaults/:id/items/:itemId` — delete item

### Beneficiaries
- `POST /vaults/:id/beneficiaries` — add beneficiary
- `DELETE /vaults/:id/beneficiaries/:email` — remove beneficiary
- `GET  /vaults/:id/beneficiaries` — list beneficiaries

### Dead man's switch
- `GET  /vaults/:id/dms` — get DMS configuration
- `PUT  /vaults/:id/dms` — update DMS configuration
- `POST /vaults/:id/dms/dismiss` — dismiss active request (vault owner)
- `POST /vaults/:id/dms/trigger` — trigger request (beneficiary)

### Shamir shares
- `POST /vaults/:id/shares` — create and distribute shares
- `GET  /vaults/:id/shares` — list share configuration (no share data)

---

*This document will be expanded into a full OpenAPI 3.0 specification as development progresses.*
