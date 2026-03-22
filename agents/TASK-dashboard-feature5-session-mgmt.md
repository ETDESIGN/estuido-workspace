# Task: Dashboard Feature #5 - Session Management

## Objective
Implement session management features for the cost analytics dashboard.

## Location
- **Base:** `/home/e/.openclaw/workspace/dashboards/cost-analytics-v2/`
- **Dev Server:** http://localhost:5173
- **Prerequisite:** Feature 4 must PASS QA review

## Requirements

### 5.1 Session Detail Modal (HIGH)
**User Story:** As a user, I want to click on a session row to see detailed information in a modal dialog.

**Implementation:**
- [ ] Create `SessionDetailModal` component
- [ ] Modal should show:
  - Session ID and timestamp
  - Model used
  - Token counts (input/output/total)
  - Cost breakdown
  - Full message history (expandable)
  - Tags/labels (if tagged)
- [ ] Click anywhere on session row to open modal
- [ ] Close via X button, ESC key, or clicking outside
- [ ] Responsive design (mobile-friendly)

**Files to modify:**
- Create: `src/components/dashboard/SessionDetailModal.tsx`
- Modify: `src/app/page.tsx` (add click handler to session table)

### 5.2 Delete/Archive Old Sessions (MEDIUM)
**User Story:** As a user, I want to delete or archive old sessions I no longer need.

**Implementation:**
- [ ] Add "Delete" button to SessionDetailModal
- [ ] Add "Archive" button (soft delete, keeps in archive folder)
- [ ] Confirmation dialog before delete/archive
- [ ] Bulk actions: select multiple sessions → delete/archive all
- [ ] Archive folder: `/data/sessions/archived/`

**Files to modify:**
- Create: `src/components/dashboard/SessionActions.tsx`
- Create API route: `src/app/api/session/[id]/route.ts` (DELETE)
- Create API route: `src/app/api/session/[id]/archive/route.ts` (POST)

### 5.3 Session Tagging/Categorization (MEDIUM)
**User Story:** As a user, I want to tag sessions with labels for better organization.

**Implementation:**
- [ ] Tag input in SessionDetailModal
- [ ] Suggest existing tags (autocomplete)
- [ ] Tag badges visible on session row
- [ ] Filter sessions by tag
- [ ] Tag management page (create/edit/delete tags)

**Files to modify:**
- Create: `src/components/dashboard/TagManager.tsx`
- Create: `src/components/dashboard/TagBadge.tsx`
- Modify: `src/app/page.tsx` (add tag filter to filters panel)
- Update data schema: Add `tags: string[]` to session objects

### 5.4 Search Within Session Messages (LOW)
**User Story:** As a user, I want to search for specific text within session message history.

**Implementation:**
- [ ] Search box in SessionDetailModal
- [ ] Highlight matching text in messages
- [ ] Navigate between matches (next/prev)
- [ ] Show match count (e.g., "3/15")

**Files to modify:**
- Create: `src/components/dashboard/SessionSearch.tsx`
- Modify: `SessionDetailModal.tsx` (integrate search)

## Technical Requirements

### State Management
- Use existing state patterns (no new libraries)
- Tags stored in session objects: `tags: string[]`
- Archived sessions: move to `/data/sessions/archived/[id].json`

### API Routes
- `DELETE /api/session/[id]` - Permanently delete session
- `POST /api/session/[id]/archive` - Soft delete (move to archive)
- `PATCH /api/session/[id]/tags` - Update session tags

### UI/UX
- Consistent with existing dashboard design
- Loading states for async operations
- Error handling with user-friendly messages
- Toast notifications for actions (use existing Toast component)

## Testing Checklist
- [ ] Modal opens/closes correctly
- [ ] Delete/archive operations work
- [ ] Tags can be added/removed
- [ ] Search highlights and navigates matches
- [ ] No TypeScript errors
- [ ] Dev server running at http://localhost:5173
- [ ] Responsive on mobile

## Acceptance Criteria
- [ ] All 4 sub-features working
- [ ] Dev server running for GM review
- [ ] No console errors
- [ ] QA review PASSED

---

**Assigned To:** CTO (KiloCode CLI with free models)
**Priority:** MEDIUM (after Feature 4 QA passes)
**Estimated Time:** 30-45 minutes

---

**GM Notes:**
- Use GLM-5 or MiniMax free tier via KiloCode CLI
- Work continuously, report each sub-feature completion
- Run `npm run dev` before reporting complete
- Update TASK-dashboard-batch2.md with progress
