# Task: Upgrade Mission Control Dashboard to Latest Version

## Objective
Upgrade the Mission Control dashboard at localhost:4001 to the latest version from GitHub, then verify all functionality works properly.

## Context
- **Current Location:** `/home/e/mission-control-new`
- **Current Version:** 1.3.0
- **Target URL:** http://localhost:4001
- **GitHub Repo:** https://github.com/builderz-labs/mission-control

## Requirements

### Phase 1: Upgrade
1. Check for latest version on GitHub
2. Pull latest code or clone fresh
3. Install dependencies
4. Build/start the service on port 4001

### Phase 2: Verification
Test all core functionality:
- [ ] Dashboard loads without errors
- [ ] Navigation works (all menu items)
- [ ] Data displays correctly (sessions, agents, costs)
- [ ] API endpoints respond
- [ ] No console errors

### Phase 3: Report
- New version number
- All features tested (pass/fail)
- Any issues found

## Instructions
1. Run dev server: `cd /home/e/mission-control-new && PORT=4001 pnpm dev`
2. Test all features manually or via script
3. Report results

## Status
- **Assigned:** CTO
- **Priority:** HIGH
- **Due:** Today