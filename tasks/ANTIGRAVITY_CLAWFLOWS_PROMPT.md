# Task: Install and Configure ClawFlows + ClawTeam Packs (Open Source)

**Assigned to:** antigravity
**Requested by:** E (via Dereck)
**Priority:** HIGH
**Context:** Previous installation attempts by Dereck failed. Need thorough research + proper implementation.

---

## 🎯 Mission Objectives

### Part 1: ClawFlows Installation
**Repository:** https://github.com/nikilster/clawflows
**What it is:** 100+ prebuilt OpenClaw workflows (email triage, morning briefings, smart home, meeting prep, etc.)

**Tasks:**
1. Research official documentation thoroughly
2. Install using the official installer OR manual setup if installer fails
3. Configure workflow scheduler (cron-based, checks every 15 min)
4. Enable the "Essentials Pack" (4 starter workflows)
5. Verify AGENTS.md is synced with available workflows
6. Test at least 2 workflows work correctly

### Part 2: ClawTeam Packs Installation (Open Source)
**Repository:** https://github.com/clawteam-packs
**What it is:** Pre-built AI agent configurations for OpenClaw (open source version, NOT paid)

**Tasks:**
1. Research the repository structure and available packs
2. Identify which packs are free/open source vs paid
3. Install open source agent packs
4. Configure each pack according to its documentation
5. Test each installed pack

### Part 3: System Verification
**Tasks:**
1. Restart OpenClaw gateway after all installations
2. Verify gateway starts without errors
3. Check that all workflows are recognized by agents
4. Test workflow execution (pick a simple one, run it)
5. Document what was installed and how to use it
6. Create rollback notes (how to uninstall if needed)

---

## 📋 Research Requirements (MANDATORY - Don't skip this!)

**Before installing anything, you MUST:**

1. **Read the official ClawFlows README**
   - curl: `https://raw.githubusercontent.com/nikilster/clawflows/main/README.md`
   - Understand: Architecture, dependencies, configuration

2. **Read the installer script**
   - curl: `https://raw.githubusercontent.com/nikilster/clawflows/main/system/install.sh`
   - Understand: What it does, where it puts files, what it modifies

3. **Explore ClawTeam Packs repository**
   - List all available packs
   - Identify which are open source
   - Read documentation for each pack you'll install

4. **Check for conflicts**
   - Are there existing workflows in the workspace?
   - Will this interfere with existing agents (Dereck, CTO, QA, Warren)?
   - Any PATH or dependency conflicts?

---

## 🛠️ Installation Steps (ClawFlows)

### Option A: Official Installer (Try First)
```bash
curl -fsSL https://raw.githubusercontent.com/nikilster/clawflows/main/system/install.sh | bash
```

### Option B: Manual Install (If Installer Fails)
```bash
# Clone to workspace
cd ~/.openclaw/workspace
git clone https://github.com/nikilster/clawflows.git

# Symlink CLI
ln -s ~/.openclaw/workspace/clawflows/system/clawflows ~/.local/bin/clawflows

# Ensure ~/.local/bin is in PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

# Install dependencies (check README for requirements)
# TODO: Research what's needed

# Configure cron scheduler
# TODO: Research what cron entries are needed
```

### Option C: Alternative Installer (If A and B Fail)
- Research community installation methods
- Check OpenClaw Discord/community for troubleshooting
- Document what failed and why

---

## 🛠️ Installation Steps (ClawTeam Packs - Open Source)

### Step 1: Explore Repository
```bash
# Clone temporarily to explore
cd /tmp
git clone https://github.com/clawteam-packs/

# List available packs
ls -la clawteam-packs/

# Read each pack's README
find clawteam-packs/ -name "README.md" -exec echo "=== {} ===" \; -exec cat {} \;
```

### Step 2: Identify Open Source Packs
- Look for: "Free", "Open Source", "Community" labels
- AVOID: Paid/commercial packs
- Document which packs you're installing

### Step 3: Install Each Pack
- Each pack may have different installation instructions
- Follow pack-specific documentation
- Configure as required

---

## ✅ Verification Checklist

Before reporting success, verify:

### ClawFlows
- [ ] `clawflows` command available in PATH
- [ ] `~/.openclaw/workspace/clawflows/` directory exists
- [ ] Cron entries created (check: `crontab -l`)
- [ ] AGENTS.md updated with workflow knowledge
- [ ] At least 1 workflow tested successfully
- [ ] `clawflows list` shows available workflows (if command exists)

### ClawTeam Packs
- [ ] All open source packs installed
- [ ] Each pack's configuration in place
- [ ] Agents can access pack features
- [ ] At least 1 pack feature tested

### System
- [ ] Gateway restart successful: `openclaw gateway restart`
- [ ] No errors in gateway logs
- [ ] Existing agents (Dereck, CTO, QA, Warren) still work
- [ ] No conflicts with existing workflows or skills

---

## 📝 Documentation Requirements

Create these files after installation:

### 1. `~/.openclaw/workspace/notes/CLAWFLOWS_INSTALLED.md`
```markdown
# ClawFlows Installation

**Date:** YYYY-MM-DD
**Installed by:** antigravity

## What Was Installed
- ClawFlows version: [check git log]
- Installation method: [installer/manual/alternative]
- Workflows enabled: [list them]

## Configuration
- Cron entries: [paste crontab -l output]
- PATH changes: [if any]
- Dependencies: [if any]

## Testing Results
- Workflow tested: [name]
- Result: [PASS/FAIL]
- Notes: [observations]

## Rollback Instructions
- Uninstall command: `clawflows uninstall` OR manual steps
- Files to remove: [list]
- Cron entries to remove: [list]
```

### 2. `~/.openclaw/workspace/notes/CLAWTEAM_PACKS_INSTALLED.md`
```markdown
# ClawTeam Packs Installation

**Date:** YYYY-MM-DD
**Installed by:** antigravity

## Packs Installed
1. [Pack Name] - [Purpose]
2. [Pack Name] - [Purpose]
...

## Configuration Per Pack
- [Pack 1]: [config details]
- [Pack 2]: [config details]
...

## Testing Results
- [Pack 1 feature]: [PASS/FAIL]
- [Pack 2 feature]: [PASS/FAIL]
...

## Rollback Instructions
- How to uninstall each pack
```

---

## 🚨 Troubleshooting Guidelines

### If Installer Fails
1. Check error message - what broke?
2. Check dependencies - is something missing?
3. Check permissions - can write to ~/.local/bin?
4. Try manual installation (Option B)
5. If all else fails - document what failed and why

### If Gateway Won't Start
1. Check OpenClaw logs: `openclaw gateway logs`
2. Did cron entries break something?
3. Did PATH changes conflict?
4. Rollback installation, restore backup

### If Workflows Not Recognized
1. Check AGENTS.md - was it updated?
2. Restart gateway again
3. Check ClawFlows cron is running
4. Read ClawFlows troubleshooting guide

---

## 🎯 Success Criteria

Report back with:

1. **Installation Summary**
   - What method worked (installer/manual/alternative)
   - What was installed (ClawFlows + which ClawTeam packs)
   - Any issues encountered and how they were resolved

2. **Verification Evidence**
   - Screenshot or text output of: `clawflows list` (or equivalent)
   - Screenshot or text output of: `crontab -l` (showing ClawFlows entries)
   - Screenshot or text output of: workflow test execution
   - Gateway status: `openclaw gateway status`

3. **Documentation Files**
   - `notes/CLAWFLOWS_INSTALLED.md` created
   - `notes/CLAWTEAM_PACKS_INSTALLED.md` created

4. **Rollback Plan**
   - Clear instructions on how to uninstall everything
   - List of all files/directories created
   - List of all cron entries added

---

## 📌 Important Notes

- **DO NOT skip research.** Read documentation first. Previous attempts failed because of rushing.
- **DO test thoroughly.** Don't report success until workflows actually run.
- **DO document everything.** If E needs to rollback, they need clear instructions.
- **DO ask for help if stuck.** Don't spin wheels - check OpenClaw Discord, GitHub issues, community.
- **DON'T modify existing agents** (Dereck, CTO, QA, Warren) unless ClawFlows specifically requires it.
- **DON'T install paid packs** from ClawTeam. Open source only.

---

## 🔗 Helpful Resources

- ClawFlows GitHub: https://github.com/nikilster/clawflows
- ClawTeam Packs: https://github.com/clawteam-packs
- OpenClaw Documentation: https://openclaw.dev (check URL)
- OpenClaw Discord: (check if available)

---

**Good luck. Take your time. Research first. Test thoroughly. Document clearly.**
