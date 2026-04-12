# Encryption Architecture

> This document describes the cryptographic design of Morrigan's vault encryption system. It is a living document and will be updated as the implementation matures. **Independent review and critique is actively encouraged.**

---

## Goals

1. **Zero-knowledge** — the server never receives plaintext data or encryption keys under any circumstances
2. **Auditable** — every cryptographic decision references a published standard; nothing is invented here
3. **Forward-secure by default** — compromise of a key should not expose previously encrypted data
4. **Recoverable via threshold** — loss of the master key does not mean loss of data, if Shamir shares are configured
5. **Quantum-resistant** — all symmetric primitives use 256-bit keys, providing 128-bit post-quantum security margin

---

## Threat Model

### Threats we protect against

| Threat | Mitigation |
|---|---|
| Morrigan server compromise | Zero-knowledge: server only stores ciphertext |
| Morrigan staff malfeasance | Architecture makes access impossible without user key |
| Network interception (MITM) | TLS in transit; ciphertext even if TLS breaks |
| Compromised beneficiary account | Shamir threshold: one compromised share reveals nothing |
| Premature vault access | Dead man's switch with configurable delay |
| Brute-force on vault password | Argon2id KDF with high memory/time parameters |

### Threats we do NOT protect against

| Threat | Notes |
|---|---|
| Compromise of user's device | If the device is compromised before encryption, we can't help |
| Loss of all Shamir shares | Vault is irrecoverable — by design |
| Loss of master key file without shares | Irrecoverable — by design |
| Rubber-hose cryptanalysis | Out of scope |
| Quantum computers breaking AES-256 | 128-bit post-quantum margin — acceptable for the next ~20 years |

---

## Cryptographic Primitives

### Symmetric encryption

**Primary: XChaCha20-Poly1305**

- IETF RFC: [RFC 8439](https://www.rfc-editor.org/rfc/rfc8439) (base ChaCha20-Poly1305)
- Extension: XChaCha20 uses a 192-bit nonce (vs 96-bit), allowing safe random nonce generation
- libsodium function: `crypto_aead_xchacha20poly1305_ietf_encrypt`
- Key size: 256 bits (32 bytes)
- Nonce size: 192 bits (24 bytes) — safe for `randombytes_buf()` generation
- Authentication tag: 128 bits (16 bytes)

**Why XChaCha20 over AES-256-GCM:**
- 192-bit nonce eliminates nonce collision risk (catastrophic for GCM with short nonces)
- Constant-time in software — no timing side-channel via cache attacks
- Does not require hardware AES acceleration — performance is consistent across devices
- Both provide equivalent security levels for our purposes

**Secondary: AES-256-GCM** (available for compliance contexts)

- NIST: [FIPS 197](https://csrc.nist.gov/publications/detail/fips/197/final) + [SP 800-38D](https://csrc.nist.gov/publications/detail/sp/800-38d/final)
- libsodium function: `crypto_aead_aes256gcm_encrypt`
- Requires `crypto_aead_aes256gcm_is_available()` check — hardware AES-NI needed
- Key size: 256 bits; Nonce: 96 bits (must be generated carefully to avoid reuse)

### Key derivation

**Argon2id** — [RFC 9106](https://www.rfc-editor.org/rfc/rfc9106)

```
Parameters (subject to adjustment based on performance testing):
  Memory:      65536 KiB (64 MB)
  Iterations:  3
  Parallelism: 4
  Output:      32 bytes (256-bit master key)
  Salt:        16 bytes (random, stored alongside ciphertext)
```

Argon2id is the winner of the [Password Hashing Competition](https://password-hashing.net/) and is recommended by [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

### Secret sharing

**Shamir's Secret Sharing** over GF(2^8) — implemented via an audited third-party library.

- Candidate library: [secrets.js-grempe](https://github.com/grempe/secrets.js) or [shamir](https://github.com/dsprenkels/sss)
- The final library selection will be documented here after security review
- Shares are encoded as hex strings for portability
- Share format: `{threshold}-{total}-{index}-{share_hex}`

### Hashing / MACs

- Content addressing: SHA-256 for blob deduplication
- HMAC: HMAC-SHA256 for authenticated metadata
- Commitment schemes: SHA-512

---

## Key Hierarchy

```
Master Password (user-chosen)
        │
        ▼
  [Argon2id KDF]
        │
        ▼
  Master Key (256 bits)
        │
  ┌─────┴──────────────────────┐
  ▼                            ▼
Vault Key                 Auth Key
(encrypts content)    (authenticates metadata)
        │
  [Shamir split, optional]
        │
  ┌─────┴─────┬─────┬───── ...
  ▼           ▼     ▼
Share 1    Share 2  Share N
```

### Key file format

The key file downloaded by the user is a JSON object, base64-encoded:

```json
{
  "version": 1,
  "algorithm": "xchacha20poly1305",
  "kdf": "argon2id",
  "kdf_params": {
    "memory": 65536,
    "iterations": 3,
    "parallelism": 4,
    "salt": "<base64-encoded-salt>"
  },
  "vault_key": "<base64-encoded-encrypted-vault-key>",
  "created_at": "<ISO8601>"
}
```

The `vault_key` field contains the vault encryption key, encrypted under the Argon2id-derived master key. This allows the user to change their master password without re-encrypting all vault content (only the key wrapper is re-encrypted).

---

## Encryption Flow (per vault item)

```
Input: plaintext_bytes, vault_key

1. Generate nonce = randombytes_buf(24)  // 192 bits
2. ciphertext = xchacha20poly1305_encrypt(
     message    = plaintext_bytes,
     additional = item_metadata_hash,   // integrity check
     nonce      = nonce,
     key        = vault_key
   )
3. output = nonce || ciphertext         // prepend nonce for storage
4. Upload output to storage backend
5. Store item_metadata (encrypted separately under vault_key)
```

---

## Decryption Flow (for beneficiaries using Shamir)

```
Input: K shares from K-of-N beneficiaries

1. Collect K shares
2. Reconstruct master_key via Shamir interpolation
3. Derive vault_key from key file using reconstructed master_key
4. Download encrypted blobs from storage
5. Decrypt each item:
   nonce    = first 24 bytes of blob
   ciphertext = remaining bytes
   plaintext  = xchacha20poly1305_decrypt(ciphertext, nonce, vault_key)
```

---

## Open Questions

The following design decisions are not yet finalized and input is welcome:

1. **Key stretching on the share itself** — should each Shamir share be Argon2id-stretched before distribution? This adds brute-force resistance if a single share is leaked, at the cost of UX complexity.

2. **Online vs offline shares** — the current design allows one shard to be held by Morrigan (encrypted under account credentials). Is this appropriate, or should the sovereign tier require all shares to be offline?

3. **Key rotation** — the key file format (version field) allows for future key rotation. When and how rotation is triggered needs design work.

4. **Metadata encryption** — currently item metadata (filename, type, size) is proposed to be encrypted separately. The exact metadata schema and what to reveal vs conceal needs finalization.

5. **Post-quantum consideration** — Kyber/ML-KEM hybrid encryption may be worth evaluating for the key exchange layer as NIST standards finalize.

---

*Last updated: 2026-04-12 — v0.1.0*  
*Status: Design document — no implementation yet*
