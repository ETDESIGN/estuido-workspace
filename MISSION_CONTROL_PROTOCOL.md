# Mission Control Protocol - ALWAYS USE DASHBOARD

**Created:** 2026-03-28 06:35 HKT
**Purpose:** Ensure all sourcing activities go through Mission Control

---

## 🎯 Golden Rule

**ALWAYS use Mission Control (localhost:8501) for ALL sourcing activities**

Mission Control is the **single source of truth** for:
- Supplier database
- Customer requests (jobs)
- RFQ tracking
- Analytics
- Status updates

---

## ✅ Required Workflow

### For Supplier Research
1. Search web/find suppliers
2. **IMMEDIATELY add to Mission Control suppliers database**
3. Dashboard becomes source of truth
4. All future work references dashboard

### For Customer Requests
1. Receive request from customer
2. **Create job in Mission Control** (New Request page)
3. Dashboard tracks everything
4. RFQs sent through dashboard workflow

### For RFQ Management
1. Send RFQs
2. **Update supplier RFQ status** in dashboard
3. Track responses in dashboard
4. Create comparison matrix in dashboard

---

## 🚫 NEVER Bypass Mission Control

❌ **Don't:** Store supplier info only in memory/docs
❌ **Don't:** Send RFQs without tracking in dashboard
❌ **Don't:** Keep customer data outside dashboard
❌ **Don't**: Use external tools as primary storage

✅ **DO:** Always enter into Mission Control
✅ **DO:** Dashboard is source of truth
✅ **DO:** All data flows through dashboard
✅ **DO:** Refresh dashboard to see latest

---

## 📋 Current Status

### Suppliers in Mission Control
- **Total:** 8 suppliers
- **Real suppliers:** 3 (from web search)
  - A&S Power Technology (98% match)
  - Data Power Technology (92% match)
  - TOP Power (95% match)
- **Seed suppliers:** 5 (demo data)

### Jobs in Mission Control
- **Total:** 4 jobs
- job_001, job_002, job_003 (demo)
- job_004 (Battery Docs - REAL)

### RFQ Status
- **Sent:** 3 suppliers (Battery Docs project)
- **Awaiting responses:** All 3
- **Expected:** 3-5 days

---

## 🔄 Workflow Integration

```
Customer Request → Mission Control (New Request)
        ↓
   Search Suppliers → Mission Control (Suppliers page)
        ↓
    Send RFQs → Mission Control (Update RFQ status)
        ↓
  Get Quotes → Mission Control (Comparison matrix)
        ↓
 Present to Customer → Mission Control (Analytics)
```

**Everything flows through Mission Control.**

---

## 📊 Dashboard URLs

- **Dashboard:** http://localhost:8501
- **Suppliers Page:** http://localhost:8501 (click "🏭 Suppliers")
- **Requests Page:** http://localhost:8501 (click "📋 Requests")
- **Compare Page:** http://localhost:8501 (click "🔍 Compare")

---

**Protocol established: Mission Control is always the source of truth**

*Created: 2026-03-28 06:35 HKT*
*Purpose: Ensure proper workflow through Mission Control dashboard*
