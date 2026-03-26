# ✅ GOG SYNTAX FIX - COMPLETE

## Issue
The `gog` CLI uses `-a` (account) NOT `--profile`. All scripts have been updated.

---

## 🔧 CHANGES MADE

### Updated Files:
- ✅ `pipeline.sh` - Changed `GOOGLE_PROFILE` → `GOOGLE_ACCOUNT`, updated all `gog` commands
- ✅ `CRON_SCHEDULE.md` - Updated inbox-zero-helper command
- ✅ `QA_REPORT.md` - Updated security audit references
- ✅ `STATUS.md` - Updated blocking instructions
- ✅ `README.md` - Updated all documentation

### Correct Syntax Now:

**OLD (incorrect):**
```bash
gog --profile inerys gmail send ...
```

**NEW (correct):**
```bash
gog -a florian@inerys.com gmail send ...
```

---

## 🚀 NEXT STEP: AUTHENTICATE FLORIAN'S ACCOUNT

### Run This Command:
```bash
gog auth add florian@inerys.com
```

**What This Does:**
- Opens a browser window
- Prompts for Google login (Florian's account)
- Requests OAuth permissions for Gmail/Sheets
- Stores refresh token securely in keyring

**Takes**: 2 minutes

---

## 📋 AFTER AUTHENTICATION

Once Florian's account is authenticated, you can:

### 1. Test the Pipeline (Dry Run)
```bash
cd ~/.openclaw/workspace/agents/inerys-agent
./pipeline.sh test@example.com --company "Test Brand" --niche "Beauty" --dry-run
```

### 2. View Authenticated Accounts
```bash
gog auth list
```

### 3. Check Auth Status
```bash
gog auth status
```

---

## 📝 WHAT CHANGED IN SCRIPTS

### pipeline.sh
```bash
# Before:
GOOGLE_PROFILE="inerys"
gog --profile "$GOOGLE_PROFILE" sheets append ...

# After:
GOOGLE_ACCOUNT="florian@inerys.com"
gog -a "$GOOGLE_ACCOUNT" sheets append ...
```

### All Documentation
Updated references from `--profile inerys` → `-a florian@inerys.com`

---

## ✅ VERIFICATION

To verify the fix worked:
```bash
# After running `gog auth add florian@inerys.com`
gog -a florian@inerys.com gmail search "subject:test" --dry-run
```

If this works without errors, authentication is successful!

---

**Ready to authenticate!** 🎯

Run: `gog auth add florian@inerys.com`
