# Dead Man's Switch — Design Document

> This document describes the design of Morrigan's posthumous access mechanism. It covers the full state machine, security considerations, edge cases, and the rationale behind every configurable parameter.

---

## Why a dead man's switch?

The fundamental challenge of digital estate planning is **proof of incapacity without collaboration from the incapacitated party**.

Traditional estate law solves this with a death certificate and a named executor. Digital estates have no equivalent. We need a mechanism that:

1. Can be triggered by a third party (the beneficiary)
2. Requires confirmation from the vault owner that they are still alive
3. Tolerates false positives (illness, travel, communication breakdown)
4. Confirms true positives (actual death or incapacity) with high confidence
5. Is cryptographically secure — cannot be gamed by a malicious beneficiary

---

## The state machine

```
                         ┌─────────────────────────────┐
                         │         IDLE                 │
                         │  (user is active, normal)    │
                         └──────────────┬───────────────┘
                                        │
                              Beneficiary triggers
                              access request
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │       PENDING_CONFIRM        │
                         │  User receives daily emails  │
                         │  "Confirm you're OK"         │
                         └──────┬────────────┬──────────┘
                                │            │
                         User confirms    N days pass
                         (clicks link)    with no response
                                │            │
                                ▼            ▼
                    ┌────────────┐   ┌───────────────────┐
                    │  COOLDOWN  │   │   ACCESS_GRANTED   │
                    │  (30 days) │   │  Beneficiaries     │
                    │  before    │   │  can reconstruct   │
                    │  re-trigger│   │  vault key         │
                    └────────────┘   └───────────────────┘
```

---

## Parameters

### Configurable by the user

| Parameter | Default | Range | Notes |
|---|---|---|---|
| `check_in_window_days` | 14 | 7–365 | Number of days before access is granted |
| `cooldown_days` | 30 | 7–365 | Days before a dismissed request can be re-triggered |
| `notification_email` | account email | — | Where "Confirm you're OK" emails are sent |
| `backup_notification_sms` | none | optional | SMS backup via Twilio |
| `notify_on_trigger` | true | bool | Whether to notify user when request is triggered |

### System-level (not configurable)

| Parameter | Value | Reason |
|---|---|---|
| Email send frequency | Daily | Less than daily risks missing urgent response; more than daily is spam |
| Email retry on failure | 3 attempts, 6h spacing | Handles transient email delivery failures |
| Cooldown resets trigger count | No | Repeated triggering shouldn't deplete the protection |

---

## Security considerations

### False positive mitigation

The most important property of the DMS is tolerance of false positives. We do not want to grant vault access because someone was on a 2-week hiking trip without cell service.

Mitigations:
1. **Minimum window of 7 days** — no "instant" release is possible
2. **Daily confirmation emails** — a single missed email is not enough
3. **Multiple notification channels** — email + optional SMS backup
4. **User-configurable window** — high-security users choose 30+ days
5. **Cooldown after dismissal** — prevents rapid repeated triggering

### False negative mitigation

The system must also actually grant access when the owner is genuinely gone. Mitigations:
1. **No confirmation required to grant access** — inaction is the trigger, not action
2. **Transparent audit log** — beneficiaries can see when emails were sent and not responded to
3. **Redundant email sending** — multiple delivery attempts before counting a day as "no response"

### Malicious beneficiary scenarios

| Scenario | Protection |
|---|---|
| Beneficiary triggers request while owner is healthy | Owner receives immediate notification; one click dismisses |
| Beneficiary intercepts and deletes notification emails | User must have control of their own inbox; DMARC/SPF protects against impersonation |
| Beneficiary reconstructs vault with insufficient shares | Shamir threshold prevents reconstruction without K shares |
| Beneficiary changes the window after triggering | Window is locked once a request is active; only the vault owner can modify it |

### Morrigan staff access

Morrigan staff **cannot** short-circuit the dead man's switch to grant access. The switch mechanism controls *when beneficiaries are notified* — but the vault decryption requires the Shamir shares, which Morrigan does not hold in sufficient quantity.

Even if a Morrigan administrator manually set the state to `ACCESS_GRANTED` in the database, beneficiaries could at most reconstruct the key if they already had K shares. If they don't have K shares, the data is still inaccessible.

---

## Email design

The confirmation email must:
- Be unambiguous — the user must understand exactly what they're confirming
- Be actionable in one click — no login required
- Communicate urgency without causing distress
- Work in any email client (plain text fallback required)

### Subject line

```
[Morrigan] Someone is requesting access to your vault — please confirm you're OK
```

### Body (HTML version)

```
Hi,

Someone with access to your Morrigan vault has requested emergency access.

This is day [X] of [N]. If you do not respond, access will be granted on [DATE].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you are OK, click here to dismiss this request:

  [I'M OK — DISMISS THIS REQUEST]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you did not configure a Morrigan vault, or if this email is unexpected,
please contact security@morrigan.life immediately.

— The Morrigan system
```

### Plain text fallback

All emails include a plain text version with the dismissal link as a full URL.

---

## Database schema (draft)

```sql
CREATE TABLE dms_requests (
  id            TEXT PRIMARY KEY,      -- UUID v4
  vault_id      TEXT NOT NULL,         -- references vaults.id
  requested_by  TEXT NOT NULL,         -- beneficiary identifier (hashed email)
  triggered_at  TIMESTAMP NOT NULL,
  window_days   INTEGER NOT NULL,      -- user-configured window
  status        TEXT NOT NULL,         -- 'pending' | 'dismissed' | 'granted' | 'expired'
  dismissed_at  TIMESTAMP,
  granted_at    TIMESTAMP,
  cooldown_until TIMESTAMP
);

CREATE TABLE dms_checkins (
  id            TEXT PRIMARY KEY,
  request_id    TEXT NOT NULL REFERENCES dms_requests(id),
  day_number    INTEGER NOT NULL,      -- 1 = first email, N = last
  sent_at       TIMESTAMP NOT NULL,
  delivered     BOOLEAN DEFAULT NULL,  -- null = unknown
  responded_at  TIMESTAMP              -- null = no response
);
```

---

## Edge cases to handle

| Edge case | Current thinking |
|---|---|
| User dies during the cooldown period | Cooldown is reset by explicit user action. If user dies mid-cooldown, beneficiary waits for cooldown to expire, then re-triggers. |
| Multiple beneficiaries trigger simultaneously | Only one active request per vault at a time. Second trigger is queued or deduplicated. |
| Email address changes during active request | User is required to reconfirm email change; old address continues receiving DMS emails until confirmed. |
| User deletes their account mid-request | Account deletion is blocked if a DMS request is active. User must dismiss or modify first. |
| Vault owner incapacitated but alive | The window acts as the protection — medical situations should recover before 14/30 days |
| Legal challenge to vault access | Out of scope for v1. Documented as a known limitation. |

---

*Last updated: 2026-04-12 — v0.1.0*  
*Status: Design document — no implementation yet*
