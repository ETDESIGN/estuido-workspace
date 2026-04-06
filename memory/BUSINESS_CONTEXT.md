# E-Studio Business Context

## Company
- **Name:** E-Studio (Etia is president)
- **Business:** Sourcing agent — connects Chinese suppliers with international customers
- **Location:** Dongguan, China

## Business Flow
```
Customer sends RFQ → Etia/Derek source suppliers → Supplier quotes → 
Etia creates quotation FOR customer → Customer approves → Order → Manufacturing → Shipping
```

## Key Distinctions (CRITICAL)
| Document | Direction | Audience |
|----------|-----------|----------|
| **RFQ** (Request for Quotation) | E-Studio → Supplier | Suppliers |
| **Quotation** | E-Studio → Customer | Customers |

- NEVER confuse these. Quotation shows E-Studio's selling prices to the customer.
- RFQ asks suppliers for their best prices (and NEVER includes internal deadlines).

## Team
- **Etia** — President, final decision maker, communicates via WhatsApp (+8618566570937)
- **Derek** — General Manager, handles supplier negotiations
- **Inerys** — Team member

## Key Rules from Etia
1. Don't share internal pricing with suppliers (e.g., ~500 RMB dock benchmark)
2. Don't include production deadlines in RFQs (reveals urgency)
3. All quotations use EUR, EXW (Ex Works) Dongguan
4. Payment terms: 30% deposit, 70% before shipment
5. Dashboard must be on Vercel (customer-facing, publicly accessible)

## Current Projects
- **Project Spider:** Battery charging dock system (80 docks/yr + 1200 batteries/yr)
  - Customer: Osky
  - Suppliers: STW (95% match), Goochain (85% match)
  - Prototype deadline: April 15, 2026 (INTERNAL ONLY)
- **Customer Sourcing Dashboard:** Next.js app deployed to Vercel
