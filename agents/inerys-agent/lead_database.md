# LEAD DATABASE STRUCTURE

## Google Sheets CRM Schema

### Sheet: "Leads"
| Column | Field Name | Description | Example |
|--------|-----------|-------------|---------|
| A | company | Company/Brand name | Sephora, L'Occitane |
| B | contact_name | Primary contact person | Marc Dupont |
| C | email | Email address | m.dupont@sephora.fr |
| D | niche | Industry segment | Beauty, Food, Eco-brands |
| E | status | Lead status | New, Contacted, Replied, Closed |
| F | warm_cold | Temperature | Warm, Cold |
| G | first_contact | Date of first outreach | 2026-03-24 |
| H | last_contact | Date of last interaction | 2026-03-26 |
| G | follow_up_count | Number of follow-ups sent | 0, 1, 2, 3 |
| H | notes | Interaction history | "Interested in cosmetic pouches" |
| I | gmail_draft_id | Reference to Gmail draft | draft-123456789 |
| J | ghost_alert | Flag for 4-day follow-up | true/false |

## Lead Status Workflow

```
┌─────────┐     ┌──────────────┐     ┌─────────┐     ┌──────────┐
│  New    │ ──> │  Contacted   │ ──> │  Replied│ ──> │  Closed  │
└─────────┘     └──────────────┘     └─────────┘     └──────────┘
     │                                      │
     │                                      ▼
     │                               ┌──────────┐
     └───────────────────────────────│   Ghost  │
          (4 days no reply)           │ Follow-up│
                                      └──────────┘
```

## Status Definitions

### New
- Initial research completed
- Added to Google Sheets
- Awaiting first outreach email

### Contacted
- First email drafted and sent to Gmail
- Awaiting Florian's approval ("Send" command)
- Or awaiting prospect response

### Replied
- Prospect responded (any response)
- Move to active conversation phase
- Florian handles personally

### Closed
- Deal won (client converted)
- Deal lost (prospect not interested)
- On hold (prospect asked to follow up later)

## Temperature Classification

### Warm Leads
- Previously contacted by Florian
- Trade show connections
- Referrals from existing clients
- Website inquiries
- Requested information

### Cold Leads
- New research prospects
- LinkedIn outreach
- Industry directories
- Competitor customers

## Ghost Follow-Up Logic

**Trigger**: 4 days after sent email, no reply detected

**Action**:
1. Mark `ghost_alert = true` in Google Sheets
2. Auto-draft polite follow-up email
3. Send WhatsApp notification to Florian:
   ```
   👻 Ghost Alert: [Company]
   No reply in 4 days.
   Follow-up drafted in Gmail.
   Reply "Send" or "Tweak"
   ```

**Follow-up Email Template** (after 4 days):
```
Subject: Re: [Original Subject]

Bonjour [Name],

Je fais suite à mon dernier email concernant [project/topic].

Avez-vous eu un moment pour y réfléchir ? Je reste à votre disposition pour échanger sur vos besoins en [niche].

Bien à vous,
Florian
```

## Local Memory Storage

### File: `memory/leads.json`
```json
{
  "leads": [
    {
      "company": "Example Brand",
      "email": "contact@example.com",
      "niche": "Beauty",
      "status": "Contacted",
      "warm_cold": "Cold",
      "enrichment_data": {
        "website": "https://example.com",
        "description": "Premium beauty retailer",
        "products": ["cosmetics", "skincare"],
        "suggested_pitch": "Proteke cosmetic pouches with GRS certification"
      },
      "last_updated": "2026-03-24T20:00:00Z"
    }
  ],
  "stats": {
    "total_leads": 0,
    "warm_leads": 0,
    "cold_leads": 0,
    "contacted_this_week": 0,
    "conversion_rate": 0.0
  }
}
```

## Search Queries (for search-inerys-memory.sh)

### By Status
```bash
grep '"status": "New"' memory/leads.json
grep '"status": "Contacted"' memory/leads.json
```

### By Temperature
```bash
grep '"warm_cold": "Warm"' memory/leads.json
```

### By Niche
```bash
grep '"niche": "Beauty"' memory/leads.json
```

### Ghost Alerts
```bash
grep '"ghost_alert": true' memory/leads.json
```

---

*Created: 2026-03-24*
