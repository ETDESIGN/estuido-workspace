# Sourcing Agent Mission Control Dashboard
## Technical Specification

**Date:** 2026-03-27  
**Developer:** CTO Agent  
**Tech Stack:** Streamlit (Python)  
**Status:** In Development  
**Deploy:** http://localhost:8501

---

## 🎯 OBJECTIVE

Build a beautiful, intuitive Mission Control dashboard for the Sourcing Agent. User (Etia) can:
- Submit sourcing requests
- View supplier matches
- Compare quotes
- Approve/reject decisions
- Access all data

---

## 📋 REQUIREMENTS

### Functional Requirements

**FR1: New Sourcing Request**
- User can submit new sourcing request
- Form captures: project name, type, quantity, material, tolerance, timeline
- User can upload drawing (PDF/Image)
- System creates job file in `customers/` directory
- User receives confirmation

**FR2: View Requests**
- User can view all sourcing requests
- Display status (In Progress, RFQ Sent, Awaiting Approval, Complete)
- User can view job details
- User can approve/reject RFQs
- User can search/filter requests

**FR3: Supplier Database**
- User can browse all suppliers
- User can search by name, specialty, location
- User can filter by rating, capabilities
- User can view supplier dossier
- User can add to favorites

**FR4: Analytics**
- Display key metrics (total requests, active jobs, supplier count)
- Show simple charts (requests over time, supplier ratings)
- Display cost savings statistics

---

## 🛠️ TECHNICAL SPECIFICATION

### Technology Stack

**Framework:** Streamlit 1.28+  
**Language:** Python 3.10+  
**Data Storage:** JSON files (suppliers), Markdown files (customers)  
**Charts:** Matplotlib or Plotly  
**Deployment:** Local development server

### Dependencies

\`\`\`txt
streamlit>=1.28.0
pandas>=2.0.0
plotly>=5.14.0
Pillow>=10.0.0
\`\`\`

---

## 🎨 DESIGN SPECIFICATION

### Color Scheme

**Status Colors:**
- Green (Success): Complete, Approved
- Yellow (Warning): In Progress, Pending
- Red (Urgent): Rejected, Blocked
- Blue (Info): New, Information

### Components

**Metric Card:** \`st.metric()\`
**Status Badge:** \`st.status()\`
**Progress Bar:** \`st.progress()\`
**File Upload:** \`st.file_uploader()\`

---

## 📄 PAGE SPECIFICATIONS

### Page 1: New Request

**Purpose:** Submit new sourcing request

**Form Fields:**
- \`project_name\`: Text (required)
- \`product_type\`: Select (CNC Machining, Plastic Molding, PCB/PCBA, Assembly)
- \`quantity\`: Number (min: 1, default: 100)
- \`material\`: Text (e.g., "Aluminum 6061-T6")
- \`tolerance\`: Text (e.g., "±0.05mm")
- \`timeline\`: Date (default: +30 days)
- \`description\`: Textarea
- \`drawing\`: File uploader (PDF, PNG, JPG)

---

## ✅ ACCEPTANCE CRITERIA

### Must Have (MVP)

- [ ] Dashboard runs on localhost:8501
- [ ] All 4 pages accessible
- [ ] Can submit new request
- [ ] Creates job file correctly
- [ ] Can view list of requests
- [ ] Can view list of suppliers
- [ ] Shows basic metrics
- [ ] No critical errors

---

**Status:** Ready for development  
**Developer:** CTO Agent  
**Due:** Tonight (2-3 hours)
