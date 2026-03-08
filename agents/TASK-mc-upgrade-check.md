# TASK: Bi-Weekly Mission Control Upgrade Check

**Assigned to:** Warren (COO)
**Frequency:** Every 2 weeks
**Purpose:** Check for new versions of builderz-labs/mission-control and notify GM if upgrades available

## Steps

1. Check for new releases:
   ```bash
   cd /home/e/.openclaw/workspace/mission-control
   git fetch --tags
   git describe --tags --abbrev=0
   ```

2. Compare with current version in `package.json`:
   ```bash
   cat package.json | grep '"version"'
   ```

3. If new version available:
   - Note the version number and release notes
   - Notify GM (Dereck) with: version number, key changes, recommended action
   - Create a task for upgrade if significant

4. Log to `memory/2026-03-03.md`:
   - Date of check
   - Current version
   - Latest available version
   - Status (up-to-date / upgrade available)

## Notes

- Run this check every 2 weeks
- Best time: Saturday morning (HK timezone morning for E)
- If no new releases, no notification needed

**Created:** 2026-03-03