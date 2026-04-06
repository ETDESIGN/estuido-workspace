# Customer Sourcing Dashboard — Research Report
**Date:** 2026-03-31
**Status:** Draft — Brainstorm Phase
**Project:** Customer-Facing Sourcing & Quotation Dashboard

---

## 📦 PART 1: WHAT WE ALREADY HAVE

### Existing Codebases
| Project | Tech Stack | Location | Relevance |
|---------|-----------|----------|-----------|
| **Mission Control v2** | Next.js 16 + React 19 + Tailwind + Zustand + better-sqlite3 + Recharts + Radix UI | `/home/e/mission-control-new/` | ⭐ **HIGH** — proven dashboard architecture, can fork |
| **AionUI** | Electron + React + TypeScript | `/home/e/AionUi/` | Medium — chat interface, not dashboard |
| **Tandem Browser** | Node.js + HTTP API | `/home/e/tandem-browser/` | Low — browser tool |

### Mission Control v2 — What We Can Reuse
Already has:
- ✅ Next.js 16 with App Router (standalone output for Vercel)
- ✅ React 19 + TypeScript (strict)
- ✅ Tailwind CSS + Radix UI components
- ✅ Zustand state management
- ✅ better-sqlite3 (local database)
- ✅ Recharts (charts/graphs)
- ✅ next-intl (i18n — English + Chinese)
- ✅ Auth system (password-based)
- ✅ WebSocket support (real-time updates)
- ✅ Vercel deployment ready (`output: 'standalone'`)
- ✅ Full test setup (Vitest + Playwright)
- ✅ GitHub: `builderz-labs/mission-control`

### Existing Sourcing Workflow (from communication-protocol skill)
Already defined:
- ✅ RFQ templates (standard product, custom/OEM, follow-up, quote follow-up)
- ✅ Conversation state machine: new_contact → intro → RFQ → quote → negotiation → order
- ✅ Factory visit evaluation protocol
- ✅ Price negotiation rules
- ✅ Supplier deflection scripts (Chinese)

### Existing Integrations
- ✅ GitHub connected (multiple repos)
- ✅ Vercel deployment skills installed
- ✅ WhatsApp connected (agent messaging)
- ✅ Groq Whisper (voice transcription)

---

## 🌐 PART 2: COMPETITOR & BEST PRACTICE RESEARCH

### How Others Build This

**1. Procurement Dashboards (2026 standards):**
- Track KPIs: cost savings, supplier performance, cycle time, compliance
- Multi-entity dashboards with 360° visibility
- Supplier collaboration portals (catalog, pricing management)
- Real-time data integration from multiple sources
- [Source: knack.com, fanruan.com, superblocks.com]

**2. Customer Portal Patterns:**
- Secure login with role-based access (customer vs admin)
- Document/file upload with preview
- Real-time status tracking (RFQ → Quote → Negotiation → Order)
- Quote comparison and history
- Communication thread per request
- Mobile-responsive design

**3. Tech Stack Recommendations:**
- **Next.js + Supabase** — most popular combo for customer portals in 2026
- Supabase provides: Auth, Database (PostgreSQL), Storage (file uploads), Realtime
- **Alternative:** Next.js + SQLite (simpler, no external DB needed, already proven in Mission Control)

---

## 🏗️ PART 3: ARCHITECTURE PROPOSAL

### Option A: Fork Mission Control (RECOMMENDED)
**Start from Mission Control v2, strip agent features, add customer sourcing features.**

Pros:
- Proven architecture, already deployed
- Auth, i18n, theming already built
- SQLite + better-sqlite3 already integrated
- React 19 + Next.js 16 + Tailwind + Radix UI
- ~$0 hosting (Vercel free tier or self-hosted)

Cons:
- Need to strip OpenClaw agent features (sessions, agents, skills)
- Heavier than starting fresh

### Option B: Fresh Next.js + Supabase
**Build from scratch with Supabase backend.**

Pros:
- Clean slate, purpose-built
- Supabase handles auth, DB, storage, realtime
- PostgreSQL (more scalable than SQLite)
- Easy file upload with Supabase Storage

Cons:
- More work upfront
- Need to build UI components from scratch
- Supabase free tier has limits (500MB DB, 1GB storage)

### Option C: Next.js + SQLite (no external DB)
**Fresh build but use SQLite like Mission Control does.**

Pros:
- No external dependencies
- Full control over data
- Can export/migrate to PostgreSQL later

Cons:
- No built-in auth (need to implement)
- No built-in file storage (need S3/Cloudflare R2)
- No realtime (need to implement WebSocket)

### 🎯 RECOMMENDATION: **Option A — Fork Mission Control**

It already has 80% of the infrastructure. We strip the agent stuff, add sourcing features. Fastest path to a working product.

---

## 📋 PART 4: FEATURE LIST

### P0 — Must Have (MVP)
| # | Feature | Description |
|---|---------|-------------|
| 1 | **Customer Login** | Secure auth (email/password or magic link) |
| 2 | **Request List** | Table/cards showing all sourcing requests with status |
| 3 | **Request Detail** | Full view of one request with timeline |
| 4 | **Quotation View** | See quotes (price breakdown, terms, delivery) |
| 5 | **File Viewer** | View uploaded images, PDFs, documents |
| 6 | **Status Tracker** | Visual pipeline: RFQ → Quoting → Negotiation → Ordered → Shipped |
| 7 | **Admin Panel** | E-Studio team manages requests, uploads quotes, updates status |

### P1 — Should Have
| # | Feature | Description |
|---|---------|-------------|
| 8 | **File Upload** | Customer uploads reference images, specs, docs |
| 9 | **Quote Comparison** | Side-by-side comparison of multiple supplier quotes |
| 10 | **Notification** | Email/WhatsApp when status changes |
| 11 | **Chinese + English** | Bilingual interface (already in Mission Control!) |
| 12 | **Mobile Responsive** | Full mobile experience |

### P2 — Nice to Have
| # | Feature | Description |
|---|---------|-------------|
| 13 | **Chat Thread** | In-app messaging per request |
| 14 | **Factory Reports** | View factory visit evaluation results |
| 15 | **Dashboard Analytics** | Charts: avg lead time, cost savings, supplier scores |
| 16 | **Export** | Download quotes as PDF |
| 17 | **Dark Mode** | Already in Mission Control |

---

## 🗄️ PART 5: DATA MODEL

### Core Tables

```
customers
├── id (UUID)
├── email (unique)
├── name
├── company
├── phone
├── password_hash
├── role (customer | admin)
├── created_at
└── last_login

requests
├── id (UUID)
├── customer_id → customers.id
├── title
├── description (markdown)
├── product_category
├── specifications (JSON)
├── quantity
├── target_price (nullable)
├── status (new | quoting | quoted | negotiating | ordered | shipped | delivered | closed)
├── priority (low | normal | high | urgent)
├── created_at
├── updated_at
└── assigned_admin → customers.id (nullable)

quotes
├── id (UUID)
├── request_id → requests.id
├── supplier_name
├── unit_price
├── total_price
├── currency (CNY | USD)
├── moq
├── lead_time_days
├── payment_terms
├── valid_until
├── notes (markdown)
├── status (draft | sent | accepted | rejected | expired)
├── created_at
└── updated_at

files
├── id (UUID)
├── request_id → requests.id (nullable)
├── quote_id → quotes.id (nullable)
├── filename
├── mime_type
├── size_bytes
├── storage_path
├── uploaded_by → customers.id
├── category (reference | specification | quote_document | factory_report | other)
├── created_at
└── description

activity_log
├── id (UUID)
├── request_id → requests.id
├── actor_id → customers.id
├── action (created | updated | status_changed | quote_added | file_uploaded | comment_added)
├── details (JSON)
└── created_at
```

---

## 🔗 PART 6: PIPELINE INTEGRATION

### How It Connects to Existing Workflow

```
CURRENT (WhatsApp-based):
Etia ←→ Suppliers ←→ Derek ←→ Customers

FUTURE (Dashboard-powered):
Customer → Dashboard → Request → Etia/Derek assigns suppliers → Suppliers quote
                    → Dashboard shows quotes → Customer views → Negotiates → Order
```

### Data Flow
1. Customer creates request via dashboard (or Etia creates on their behalf)
2. Etia/Derek receives notification → assigns to suppliers via WhatsApp
3. Derek/Negotiator collects quotes → uploads to dashboard
4. Customer sees quotes on dashboard → provides feedback
5. Negotiation happens → order confirmed
6. Status updates pushed to dashboard in real-time

### Agent Integration
- **Derek Negotiator** can auto-update request status via API
- **Planner agent** can create tasks from new customer requests
- **Deployer** handles deployment of the dashboard itself

---

## 💰 PART 7: COST ANALYSIS

### Hosting Options

| Option | Cost | Pros | Cons |
|--------|------|------|------|
| **Vercel Free** | $0 | Easy deploy, CDN, auto-SSL | 100GB bandwidth, limited serverless functions |
| **Vercel Pro** | $20/mo | More bandwidth, analytics | Still limited for file storage |
| **Self-hosted** | $0 (own server) | Full control, unlimited | Need to manage, no CDN |
| **Railway** | $5/mo | Easy deploy, persistent storage | Smaller free tier |

### File Storage
| Option | Free Tier | Best For |
|--------|-----------|----------|
| **Cloudflare R2** | 10GB storage, 10M reads/mo | Best free tier |
| **Supabase Storage** | 1GB | Easy if using Supabase |
| **Local filesystem** | Unlimited (disk space) | Self-hosted only |

### Database
| Option | Free Tier | Best For |
|--------|-----------|----------|
| **SQLite** (local) | Free | Self-hosted, simple, already proven |
| **Supabase (PostgreSQL)** | 500MB | SaaS, easy scaling |
| **Turso** (libSQL) | 9GB | Serverless SQLite |

### 🎯 RECOMMENDED STACK (Total: $0/mo)
- **Hosting:** Self-hosted on existing server or Vercel free tier
- **Database:** SQLite (already in Mission Control)
- **File Storage:** Local filesystem or Cloudflare R2 (10GB free)
- **Auth:** Custom JWT (already in Mission Control)

---

## 📋 PART 8: IMPLEMENTATION PLAN

### Phase 1: Foundation (Days 1-2)
- [ ] Fork Mission Control → strip agent features
- [ ] Set up database schema (customers, requests, quotes, files)
- [ ] Build customer auth (login/register)
- [ ] Build admin auth (E-Studio team)
- [ ] Basic layout: customer view vs admin view

### Phase 2: Customer Features (Days 3-5)
- [ ] Request list page (table with filters)
- [ ] Request detail page (timeline, files, quotes)
- [ ] File upload & viewer (images, PDFs)
- [ ] Status tracker (visual pipeline)
- [ ] Quote view (price breakdown, terms)

### Phase 3: Admin Features (Days 6-7)
- [ ] Admin request management (create, update, assign)
- [ ] Quote upload (from supplier negotiations)
- [ ] Status updates (drag-drop pipeline)
- [ ] Customer list management

### Phase 4: Polish (Days 8-10)
- [ ] Notification system (email/WhatsApp)
- [ ] Mobile responsive refinement
- [ ] Bilingual (EN/ZH) content
- [ ] Dashboard analytics charts
- [ ] PDF export for quotes

### Dev Team Assignment
| Ticket | Agent | Est. Time |
|--------|-------|-----------|
| Fork + strip MC | cto | 2h |
| DB schema + auth | backend-coder | 3h |
| Customer pages | frontend-coder | 6h |
| Admin pages | frontend-coder | 4h |
| API endpoints | backend-coder | 4h |
| File upload/storage | backend-coder | 2h |
| Polish + i18n | frontend-coder | 3h |
| QA + testing | qa | 4h |
| Deployment | deployer | 1h |

---

## ❓ OPEN QUESTIONS (Need Etia's Input)

1. **Fork or fresh build?** Recommend forking Mission Control v2 — agree?
2. **Hosting preference?** Self-hosted on current server vs Vercel?
3. **Customer auth method?** Email/password, magic link, or something else?
4. **Multi-customer?** One dashboard for all customers (isolated by login) or white-label per customer?
5. **Real-time updates?** WebSocket (instant) or just refresh (simpler)?
6. **File size limits?** What's the max file size customers should be able to upload?
7. **Who creates requests?** Customers directly, or Etia/Derek only?
8. **WhatsApp integration?** Should status updates also send WhatsApp messages to customers?

---

*Research complete. Ready for brainstorm and architecture decisions.*

---

## ✅ DECISIONS LOCKED IN (2026-03-31 01:00 HKT)

| # | Question | Decision |
|---|----------|----------|
| 1 | Fork or fresh? | **Fork Mission Control v2** |
| 2 | Hosting? | **Vercel** |
| 3 | Customer auth? | **Email + password** |
| 4 | Multi-customer? | **White-label, per customer** |
| 5 | Real-time? | **Refresh only** (WebSocket later) |
| 6 | File size limit? | **None for now** |
| 7 | Who creates requests? | **Both customers AND team** |
| 8 | WhatsApp notifications? | **Optional toggle, not default** |

## Status: BUILD STARTED
