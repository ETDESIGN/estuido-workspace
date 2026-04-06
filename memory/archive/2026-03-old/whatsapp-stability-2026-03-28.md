# WhatsApp Stability Log - 2026-03-27/28

**Pattern**: Recurring 499 disconnect loop, ~60 second cycle

| # | Started (HKT) | Ended (HKT) | Duration | Notes |
|---|---------------|-------------|----------|-------|
| 1 | Mar 27 04:16 | Mar 27 09:48 | ~5.5 hrs | Status 428→408→499. E reported broken replies at 04:28 |
| 2 | Mar 27 16:33 | Mar 27 17:39 | ~1 hr | Status 499 |
| 3 | Mar 28 01:56 | (ongoing) | 10+ min | Status 499, same pattern |

**Observations**:
- Loops happen roughly every 6-8 hours
- Always 499 status (previously saw 428 and 408)
- Auto-reconnect works but connection dies within ~60s
- Gap between loops: stable period of 1-7 hours
- This is likely a Baileys session/auth issue, not transient network

**Recommended fix (needs E)**:
1. Gateway restart: `systemctl --user restart openclaw-gateway`
2. If persists: Delete WhatsApp session data + re-authenticate
3. If still failing: Possible WhatsApp rate-limit or account flag
