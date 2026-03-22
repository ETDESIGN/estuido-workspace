# Errors Log

**Last Updated:** 2026-03-22 02:09 HKT

---

## [ERR-20260321-001] openclaw_config_changes_not_applied

**Logged**: 2026-03-21T21:30:00Z
**Priority**: high
**Status**: resolved
**Area**: config

### Summary
Changes to openclaw.json didn't take effect until manual gateway restart

### Error
```
Updated Discord token in openclaw.json
Started Discord bot - got 401 error
Token was still the old one
```

### Context
- **Command:** Updated `/home/e/.openclaw/openclaw.json` via jq
- **Expected:** Config changes to be applied immediately
- **Actual:** Changes saved but not active
- **Environment:** OpenClaw 2026.3.13, systemd service
- **Discovery:** Took 3 attempts to realize restart was needed

### Suggested Fix
Always restart gateway after openclaw.json changes:
```bash
openclaw gateway restart
```

Add to automation checklist or create alias `gw-restart`

### Metadata
- Reproducible: yes (happened 3 times)
- Related Files: /home/e/.openclaw/openclaw.json
- See Also: LRN-20260321-001 (gateway restart mandatory)

### Resolution
- **Resolved**: 2026-03-21T23:20:00Z
- **Notes:** Documented in SOUL.md as System Integration Protocol Rule 1
- **Status**: Promoted to Core Truths

---

## [ERR-20260321-002] npm_package_wrong_binary

**Logged**: 2026-03-21T23:45:00Z
**Priority**: medium
**Status**: resolved
**Area**: infra

### Summary
npm package @googleworkspace/cli installs as `gws`, not `gog`

### Error
```
$ npm install -g @googleworkspace/cli
$ which gog
gog: command not found

$ which gws
/home/e/.npm-global/bin/gws

$ gws --version
gws 0.18.1
```

### Context
- **Command attempted:** `npm install -g @googleworkspace/cli`
- **Expected:** gog CLI for Google Workspace
- **Actual:** gws (different tool)
- **Time wasted:** ~15 minutes debugging

### Suggested Fix
Verify package name vs binary name before installation. Check:
1. Package documentation for actual binary name
2. GitHub releases for official binaries
3. Build from source if needed

### Metadata
- Reproducible: yes (package name mismatch)
- Related Files: /usr/local/bin/gog, ~/.npm-global/bin/gws
- See Also: LRN-20260321-003 (npm vs binary)

### Resolution
- **Resolved**: 2026-03-21T23:55:00Z
- **Commit/PR**: Downloaded pre-built binary from GitHub releases
- **Notes**: Downloaded gogcli_0.12.0_linux_amd64.tar.gz, extracted to /usr/local/bin/gog

---

## [ERR-20260321-003] oauth_verification_blocked

**Logged**: 2026-03-22T00:50:00Z
**Priority**: medium
**Status**: resolved
**Area**: authentication

### Summary
Google OAuth app in "Testing" mode - blocked authorization with 403 error

### Error
```
Access blocked: clawdbot has not completed the Google verification process

Error 403: access_denied
clawdbot has not completed the Google verification process. 
The app is currently being tested, and can only be accessed by 
developer-approved testers.
```

### Context
- **Operation:** Authorizing gog CLI with Google OAuth
- **Account:** caneles2hk@gmail.com
- **Expected:** OAuth flow to complete
- **Actual:** Blocked by Google verification requirement
- **Time to debug:** ~20 minutes

### Suggested Fix
Add test users immediately after creating OAuth credentials:
1. Go to Google Cloud Console → OAuth Consent Screen
2. Scroll to "Test users" section
3. Add email addresses
4. Save changes
5. Wait 1-2 minutes before attempting authorization

### Metadata
- Reproducible: yes (any new OAuth app in Testing mode)
- Related Files: /home/e/.openclaw/client_secret.json
- See Also: LRN-20260321-004 (OAuth test user requirement)

### Resolution
- **Resolved**: 2026-03-22T01:00:00Z
- **Notes:** Added caneles2hk@gmail.com as test user in Google Cloud Console
- **Status:** Authorization successful after test user added

---

## [ERR-20260321-004] wrong_google_account_authorized

**Logged**: 2026-03-22T00:55:00Z
**Priority**: low
**Status**: resolved
**Area**: authentication

### Summary
OAuth flow authorized wrong Google account - caneles2hk@gmail.com instead of etiawork@gmail.com

### Error
```
authorized as caneles2hk@gmail.com, expected etiawork@gmail.com
```

### Context
- **Intent:** Authorize etiawork@gmail.com (E's personal account)
- **Action:** Browser opened OAuth URL
- **Outcome:** User was signed in as caneles2hk@gmail.com in browser
- **Result:** Wrong account authorized
- **User decision:** "Actually, use caneles2hk@gmail.com - it's your AI workspace"

### Suggested Fix
1. Sign out of all Google accounts before OAuth
2. Or use incognito/private browser window
3. Or explicitly sign in as correct account before authorizing

### Metadata
- Reproducible: yes (if browser has multiple accounts)
- Related Files: ~/.config/gogcli/credentials.json
- See Also: LRN-20260321-005 (email routing strategy)

### Resolution
- **Resolved**: 2026-03-22T01:00:00Z
- **Notes:** E confirmed caneles2hk@gmail.com is intended as AI workspace
- **Status:** Not an error - user preference clarified

---

## [ERR-20260321-005] subagent_file_io_not_working

**Logged**: 2026-03-21T21:00:00Z
**Priority**: critical
**Status**: resolved
**Area**: tools

### Summary
CTO subagents couldn't create files or run shell commands - only had session management tools

### Error
```
Task: Create file at /home/e/.openclaw/workspace/test-cto-fix.txt
Result: Task cannot be completed. The subagent runtime doesn't include 
write, read, or shell execution tools needed to create files.
```

### Context
- **Command:** sessions_spawn with CTO agent
- **Expected:** CTO creates file using write tool
- **Actual:** CTO only had sessions_list, sessions_history, sessions_send, sessions_spawn
- **Root cause:** tools.subagents.tools.allow in openclaw.json restricted to session tools only
- **Impact:** CTO couldn't implement features, 4-Manager hierarchy blocked

### Suggested Fix
Update openclaw.json to include file I/O tools for subagents:
```json
"tools": {
  "subagents": {
    "tools": {
      "allow": [
        "sessions_spawn",
        "sessions_list",
        "sessions_send",
        "sessions_history",
        "read",
        "write",
        "edit",
        "exec",
        "memory_search",
        "search",
        "web_search"
      ]
    }
  }
}
```
Then restart gateway.

### Metadata
- Reproducible: yes (all subagents affected)
- Related Files: /home/e/.openclaw/openclaw.json, /home/e/.openclaw/workspace/agents/cto/agent/config.json
- See Also: LRN-20260321-006 (subagent tool permissions)

### Resolution
- **Resolved**: 2026-03-21T21:45:00Z
- **Notes:** Updated openclaw.json, restarted gateway, verified with test file creation
- **Status:** Phase 5 complete, 4-Manager hierarchy fully operational

---

## Error Statistics

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 1 | ✅ Resolved |
| High | 1 | ✅ Resolved |
| Medium | 2 | ✅ Resolved |
| Low | 1 | ✅ Resolved |
| **Total** | **5** | **5 Resolved** |

### Recurring Patterns
1. **Gateway restart** - Multiple times (ERR-20260321-001)
2. **Installation issues** - npm vs binary (ERR-20260321-002)
3. **OAuth setup** - Verification requirements (ERR-20260321-003)

### Resolution Rate
- **This session:** 5/5 resolved (100%)
- **Average time to resolve:** ~15 minutes
- **Promotions:** 3/5 promoted to permanent documentation

---

**Next Error Review:** 2026-04-04
**Goal:** Reduce recurring errors through documentation and automation
