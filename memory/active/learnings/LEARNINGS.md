---
tags: gateway, config, testing, tasks, memory, error, learning, setup, fix
type: learning
priority: critical
status: active
created: 2026-03-28
---

# Learnings & Improvements

**Last Updated:** 2026-03-27 17:55 HKT

---

## [LRN-20260321-001] gateway_restart_mandatory

**Logged**: 2026-03-21T21:30:00Z
**Priority**: critical
**Status**: promoted
**Area**: config

### Summary
Gateway restart is mandatory after openclaw.json changes - changes don't take effect until restart

### Details
Updated `/home/e/.openclaw/openclaw.json` to add Discord token and subagent tool permissions, but changes didn't take effect. Required manual `openclaw gateway restart` command. This happened 3 times during session:
1. Discord token update (attempt 1)
2. Discord token update (attempt 2 after doctor)
3. Subagent tool permissions update

Each time, the config was saved correctly but wasn't active until gateway restart.

### Suggested Action
Add gateway restart to checklist after every openclaw.json edit. Consider automation:
```bash
# Add to .bashrc
alias gw-restart='openclaw gateway restart && echo "✅ Gateway restarted - config applied"'
```

### Metadata
- Source: error
- Related Files: /home/e/.openclaw/openclaw.json, /home/e/.openclaw/workspace/notes/DISCORD_CONFIG.md
- Tags: gateway, config, restart, openclaw
- Recurrence-Count: 3
- First-Seen: 2026-03-21T21:30:00Z
- Last-Seen: 2026-03-21T23:20:00Z
- See Also: LRN-20260321-002 (Discord config), LRN-20260321-003 (subagent tools)

### Promoted
- **SOUL.md** → System Integration Protocol (Rule 1: ALWAYS restart gateway)
- **TOOLS.md** → Discord section (restart required after config changes)
- **docs/SYSTEM_IMPROVEMENTS_2026-03-21.md** → Priority HIGH improvement

---

## [LRN-20260321-002] discord_config_documentation

**Logged**: 2026-03-21T23:00:00Z
**Priority**: high
**Status**: promoted
**Area**: config

### Summary
Discord bot configuration has been forgotten 3 times in 4 weeks - requires persistent documentation

### Details
Discord bot token and configuration:
- **Week 1:** Initial setup, token lost
- **Week 2:** Reconfigured, lost again
- **Week 3:** Reconfigured, lost again  
- **Week 4 (today):** Created `/home/e/.openclaw/workspace/notes/DISCORD_CONFIG.md` with full documentation

Root cause: No persistent storage of configuration details. Each time required re-discovery of token, permissions, and setup steps.

### Suggested Action
Always document service configurations immediately in notes/ directory. Use template format:
```markdown
# Service Name
**Configured:** YYYY-MM-DD
**Token:** [store here]
**Permissions:** [integer]
**Channels:** [list]
**Restart Required:** Yes/No
```

### Metadata
- Source: error
- Related Files: /home/e/.openclaw/workspace/notes/DISCORD_CONFIG.md, /home/e/.openclaw/openclaw.json
- Tags: discord, config, documentation, token
- Recurrence-Count: 3 (times lost)
- First-Seen: 2026-02-21T00:00:00Z
- Last-Seen: 2026-03-21T23:00:00Z
- Pattern-Key: document.service_config_immediately

### Promoted
- **TOOLS.md** → Discord Bot section (with "DON'T FORGET AGAIN!" warning)
- **notes/DISCORD_CONFIG.md** → Created comprehensive reference

---

## [LRN-20260321-003] npm_package_vs_binary_installation

**Logged**: 2026-03-21T23:45:00Z
**Priority**: medium
**Status**: promoted
**Area**: infra

### Summary
npm package name can be misleading - @googleworkspace/cli installs as `gws`, not `gog`

### Details
**Attempted:** Install gog CLI via npm
```bash
npm install -g @googleworkspace/cli
```
**Result:** Installed binary named `gws` (Google Workspace CLI), not `gog`

**Actual solution:** Download pre-built binary from GitHub releases
```bash
wget https://github.com/steipete/gogcli/releases/download/v0.12.0/gogcli_0.12.0_linux_amd64.tar.gz
tar -xzf gogcli_0.12.0_linux_amd64.tar.gz
sudo mv gog /usr/local/bin/
```

**Root cause:** Package name didn't match binary name. Assumed npm package was correct without verification.

### Suggested Action
Always verify binary names before npm installation. Have fallback plans:
1. Check package documentation for actual binary name
2. Download from releases if npm fails
3. Build from source if both fail

### Metadata
- Source: error
- Related Files: /usr/local/bin/gog, ~/.npm-global/bin/gws
- Tags: npm, installation, gog, google-workspace, binary
- First-Seen: 2026-03-21T23:45:00Z
- Last-Seen: 2026-03-21T23:45:00Z

### Promoted
- **notes/GOOGLE_WORKSPACE_CONFIG.md** → Installation journey documented
- **docs/SYSTEM_IMPROVEMENTS_2026-03-21.md** → Multiple installation paths principle

---

## [LRN-20260321-004] oauth_test_user_requirement

**Logged**: 2026-03-22T00:50:00Z
**Priority**: medium
**Status**: promoted
**Area**: config

### Summary
Google OAuth apps in "Testing" mode require explicit test user addition - blocks authorization

### Details
**Error:** "clawdbot has not completed the Google verification process. Access blocked: 403: access_denied"

**Root cause:** OAuth consent screen in "Testing" mode with no test users added

**Solution:** Added `caneles2hk@gmail.com` as test user in Google Cloud Console:
1. Go to OAuth Consent Screen
2. Scroll to "Test users"
3. Click "+ ADD USERS"
4. Add email address
5. Save

**Time impact:** ~20 minutes of debugging OAuth flow

### Suggested Action
When setting up Google OAuth:
- Always add test users immediately after creating OAuth credentials
- Document test user addition in setup checklist
- Expect this requirement - don't assume immediate access

### Metadata
- Source: error
- Related Files: /home/e/.openclaw/client_secret.json, ~/.config/gogcli/credentials.json
- Tags: oauth, google, authentication, testing, gog
- First-Seen: 2026-03-22T00:50:00Z
- Last-Seen: 2026-03-22T00:50:00Z

### Promoted
- **notes/GOOGLE_WORKSPACE_CONFIG.md** → OAuth setup steps documented
- **docs/SYSTEM_IMPROVEMENTS_2026-03-21.md** → OAuth verification hurdle noted

---

## [LRN-20260321-005] email_routing_strategy

**Logged**: 2026-03-22T01:00:00Z
**Priority**: high
**Status**: promoted
**Area**: workflow

### Summary
Separate AI workspace email from personal inbox - caneles2hk@gmail.com for AI operations, etiawork@gmail.com for personal communication

### Details
**Initial assumption:** Would use etiawork@gmail.com for everything
**Actual outcome:** E gifted caneles2hk@gmail.com as dedicated AI workspace

**Why this works:**
- **AI workspace (caneles2hk@gmail.com):** AI can read/write/organize without touching personal email
- **Personal inbox (etiawork@gmail.com):** E's private communications remain separate
- **When AI needs to email E:** Send to etiawork@gmail.com
- **When AI reads mail:** Check caneles2hk@gmail.com

**User intent vs. assumption:** Don't assume account usage - ask user to confirm

### Suggested Action
Document email routing strategy in SOUL.md and TOOLS.md:
```markdown
### System Integration Protocol
**Rule 4:** Use AI workspace (caneles2hk@gmail.com) for operations, personal (etiawork@gmail.com) for communication
```

### Metadata
- Source: user_feedback
- Related Files: /home/e/.openclaw/workspace/notes/GOOGLE_WORKSPACE_CONFIG.md
- Tags: email, routing, google-workspace, communication, separation
- First-Seen: 2026-03-22T01:00:00Z
- Last-Seen: 2026-03-22T01:00:00Z

### Promoted
- **SOUL.md** → System Integration Protocol (Rule 4)
- **TOOLS.md** → Google Workspace section (account usage explained)

---

## [LRN-20260321-006] subagent_tool_permissions

**Logged**: 2026-03-21T21:15:00Z
**Priority**: critical
**Status**: promoted
**Area**: config

### Summary
Subagents didn't have file I/O tools - only session management. Required openclaw.json update + gateway restart

### Details
**Problem:** CTO subagents couldn't create files or run shell commands
**Root cause:** `tools.subagents.tools.allow` in openclaw.json only included session tools
**Missing tools:** `read`, `write`, `edit`, `exec`, `memory_search`, `search`, `web_search`

**Fix applied:**
```json
"tools": {
  "subagents": {
    "tools": {
      "allow": [
        "sessions_spawn",
        "sessions_list",
        "sessions_send",
        "sessions_history",
        "read",      // NEW
        "write",     // NEW
        "edit",      // NEW
        "exec",      // NEW
        "memory_search",
        "search",
        "web_search"
      ]
    }
  }
}
```

**Verification:** Created test file `/home/e/.openclaw/workspace/test-cto-fix.txt` successfully

### Suggested Action
Add to subagent setup checklist:
1. Configure agent JSON files
2. Update openclaw.json tools.subagents.tools.allow
3. Restart gateway
4. Test file I/O with simple task

### Metadata
- Source: error
- Related Files: /home/e/.openclaw/openclaw.json, /home/e/.openclaw/workspace/agents/cto/agent/config.json
- Tags: subagent, tools, permissions, file-io, openclaw
- First-Seen: 2026-03-21T21:15:00Z
- Last-Seen: 2026-03-21T21:15:00Z

### Promoted
- **AGENTS.md** → 4-Manager hierarchy documented
- **memory/2026-03-21-phase5-6-complete.md** → Phase 5 completion recorded

---

## [LRN-20260321-007] verify_before_claiming

**Logged**: 2026-03-21T21:35:00Z
**Priority**: medium
**Status**: pending
**Area**: workflow

### Summary
Always test and verify functionality before claiming it works - QMD lesson applied

### Details
**Past mistake:** Claimed QMD was working when it wasn't (E caught this error)
**Today's application:** After fixing CTO subagent tools, created test file to verify:
```bash
# Created test file
gog gmail send --to test@example.com
# Verified file exists before claiming success
ls -la /home/e/.openclaw/workspace/test-cto-fix.txt
```

**Result:** Caught that first attempt failed, required gateway restart

### Suggested Action
Add verification step to checklist:
1. Make change
2. Test with simple example
3. Verify output
4. THEN claim success

### Metadata
- Source: best_practice
- Related Files: /home/e/.openclaw/workspace/test-cto-fix.txt
- Tags: testing, verification, quality-assurance
- First-Seen: 2026-03-21T21:35:00Z
- Last-Seen: 2026-03-21T21:35:00Z
- Pattern-Key: simplify.test_before_claim
- Recurrence-Count: 1

### Promoted
- **SOUL.md** → Core Truths (already present: "Verify before claiming")

---

## [LRN-20260327-001] cto_activity_gap_pipeline_ownership

**Logged**: 2026-03-27T17:55:00Z
**Priority**: high
**Status**: pending
**Area**: workflow

### Summary
No CTO activity for 6 days (Mar 21–27) indicates lack of continuous pipeline ownership

### Details
**Timeline:**
- Mar 21, 21:30: Completed Feature 4, marked READY_FOR_QA
- Mar 22–27: No CTO activity or tasks queued
- Mar 27, 17:55: EOD review triggered, gap identified

**Root cause:** Task handoff without next-step planning
- Focused on QA completion (task done → stop)
- No proactive task queue management
- Relied on external direction instead of self-continuity
- Treated "READY_FOR_QA" as endpoint, not milestone

**Impact:**
- Architecture momentum lost
- No feature progression (Feature 5+)
- Development velocity dropped to zero
- CTO role passive, not driving

### Suggested Action
Implement continuous pipeline ownership protocol:
1. **After marking READY_FOR_QA:** Immediately queue next task
2. **Maintain 3-task lookahead:** (design → implement → verify)
3. **Daily self-review checklist:**
   - What's blocking the next feature?
   - Are tasks queued for the next 3 days?
   - What dependencies need resolution?
4. **Automated reminder:** 09:00 cron: "CTO: Check pipeline health, queue next task if empty"

### Metadata
- Source: retrospective
- Related Tasks: Feature 4 (complete), Feature 5+ (not started)
- Tags: cto, pipeline, ownership, continuity, gap
- First-Seen: 2026-03-27T17:55:00Z
- Last-Seen: 2026-03-27T17:55:00Z
- Gap-Duration: 6 days
- Pattern-Key: cto.maintain_pipeline_continuity
- Recurrence-Count: 1 (first gap detection)

### Promoted
- **CTO.md** → Add "Pipeline Ownership" section to responsibilities
- **SOUL.md** → Core Truth: "CTO role requires continuous pipeline ownership, not just individual task completion"

---

## Historical Session Summary (2026-03-21)

For detailed context on today's session, see:
- `/home/e/.openclaw/workspace/memory/2026-03-21-phase5-6-complete.md` (7.7KB)
- `/home/e/.openclaw/workspace/docs/SYSTEM_IMPROVEMENTS_2026-03-21.md` (6.6KB)

### Session Metrics
- **Duration:** ~4.5 hours
- **Cost:** ~$0.02 (well under $5/day budget)
- **Progress:** 83% → 100% operational capability
- **Systems Configured:** 2 major (Discord, Google Workspace)
- **Documentation Created:** 4 files, ~20KB of knowledge

### What Went Well
- ✅ Root cause analysis (subagent tools)
- ✅ Persistence (3 installation attempts for Gog)
- ✅ Documentation (comprehensive config docs)
- ✅ User communication (emailed iOS guide)
- ✅ Testing (verified CTO fix)

### What Didn't Go Well
- ❌ Gateway restarts (3 attempts needed)
- ❌ npm package confusion
- ❌ OAuth verification surprise
- ❌ Wrong account authorized first
- ❌ Discord config forgotten (3rd time)

### Key Patterns Emerging
1. **Document immediately** - Don't rely on memory
2. **Gateway restart is mandatory** - Not optional
3. **Multiple installation paths** - Always have fallbacks
4. **Verify before claiming** - Test then assert

---

**Next Review:** 2026-04-04
**Philosophy:** Small increments > Big rewrites
**Documentation:** If it's not written down, it didn't happen
