import { Stitch, StitchToolClient } from "@google/stitch-sdk";
import { writeFileSync } from "fs";

const client = new StitchToolClient({
  apiKey: process.env.STITCH_API_KEY,
  timeout: 300000,
});

const sdk = new Stitch(client);

const PAGES = [
  {
    name: "customer-dashboard",
    prompt: `Dark-themed B2B sourcing dashboard. Deep navy background (#0F172A), card surfaces (#1E293B), primary blue (#3B82F6), accents in emerald (#10B981) and amber (#F59E0B). Clean Inter font. Top nav: E-Studio logo with factory icon, Dashboard (active), My Requests, Profile links, notification bell with red badge showing 3, user avatar Etia with E-Studio company, Sign out button. Below nav: Welcome section: Good morning, Etia from E-Studio. Below that, 4 KPI cards in a row with icons: Total Requests 12 (clipboard icon), Active 5 (orange spinning icon), In Production 3 (factory icon), Delivered 4 (green checkmark icon). Below: two-column grid. Left column 2/3 width: Recent Requests section with card list. Each card shows product name like USB-C Cable Assembly, supplier, Quoting status badge in yellow, 5,000 pcs quantity, date 2 days ago. Right column 1/3: Activity timeline with icons - clipboard (request created), dollar (quote received), arrow (status changed) with relative timestamps like 2h ago. Bottom: Request Pipeline horizontal stepper with circles: New(green check) -> Quoting(blue active, pulsing) -> Quoted -> Negotiating -> Ordered -> Shipped -> Delivered. Connected by lines. Professional modern SaaS dashboard aesthetic, good spacing, subtle borders.`
  },
  {
    name: "new-request-wizard",
    prompt: `Dark-themed B2B sourcing request creation wizard. Navy #0F172A background, #1E293B card surfaces, blue #3B82F6 primary buttons. Inter font. Back arrow with Back to requests text. Title: New Sourcing Request in bold large text. Subtitle: Tell us what you need. We will find the best suppliers for you. Step indicator: 3 circles connected by horizontal lines. Circle 1 green with checkmark, circle 2 blue filled (active), circle 3 gray. Labels: Basic Info, Specifications, Review and Submit. Form content for Step 2 Specifications: Info text: Add specific requirements. All fields optional. 2x2 grid of input fields: Material placeholder 304 stainless steel, Size/Dimensions placeholder 500ml 20cm x 10cm, Color placeholder Pantone 186C matte black, Packaging placeholder Individual box bulk carton. Full-width Certifications input: FDA CE ISO 9001 REACH. Textarea Additional Specifications. Textarea Internal Notes with note not visible to suppliers. Bottom bar: left Back outline button, right Continue blue filled button. Clean focused form, generous spacing.`
  },
  {
    name: "request-detail",
    prompt: `Dark-themed B2B sourcing request detail page. Navy #0F172A background, #1E293B cards, blue #3B82F6 accents. Inter font. Breadcrumb: Back to requests. Header: Large bold title Custom Stainless Steel Water Bottles. Below: Created March 15 2026, 5000 pcs, Consumer Electronics in gray. Right side: yellow Quoting status badge. Pipeline stepper: horizontal pill bar with stages New green check to Quoting blue active to Quoted gray to Negotiating gray to Ordered gray to Shipped gray to Delivered gray. Two-column layout: Left column wider: Description card, Specifications card with 3 metric tiles Quantity 5000 pcs Target Price 2.50 USD Category Consumer Electronics. Quotations card with 2 quotes: Quote 1 Shenzhen BestMfg 0.25 per unit MOQ 3000 15 days FOB Shenzhen TT 30/70. Quote 2 Dongguan QualityParts 0.29 per unit MOQ 2000 20 days Net 30 EXW Dongguan. Right column: Files card with upload area and file list. Activity card with vertical timeline. Professional premium design.`
  },
  {
    name: "quote-comparison",
    prompt: `Dark-themed B2B quote comparison page. Navy #0F172A background, #1E293B cards, blue #3B82F6 accents. Inter font. Header: Compare Quotes title, Custom Stainless Steel Water Bottles, 3 quotes received. Full-width comparison table with alternating subtle row colors. Columns: Attribute, Shenzhen BestMfg, Dongguan QualityParts, Guangzhou Premium Mfg. Rows: Unit Price 0.25 green best 0.29 0.27, MOQ 3000 2000 green lowest 5000, Lead Time 15 days 20 days 12 days green fastest, Payment Terms TT 30/70 Net 30 LC at sight, Shipping FOB Shenzhen EXW Dongguan FOB Guangzhou, Tooling Cost 3000 2500 green best 4000, Valid Until dates. Best values have subtle green background highlight. Bottom action bar: Download PDF outline button, Select Supplier blue button, Request Negotiation outline button. Clean data-dense table.`
  },
  {
    name: "landing-page",
    prompt: `Premium B2B sourcing platform landing page. Dark navy gradient background from #0F172A to #020617. Inter font. Top navigation bar: E-Studio logo on left, center links Features How it Works, right side Sign In text button and Get Started blue pill button. Hero section centered: Small green dot badge Trusted sourcing partner above. Large heading Your Sourcing on first line and Simplified on second line with blue gradient text. Subtitle in gray. Two CTA buttons: Start Sourcing arrow blue filled large, Sign In outline large. Trust stats bar: 4 columns 500+ Suppliers Vetted, 48h Avg Quote Time, 2M+ Orders Managed, 98% Client Satisfaction. Feature section: 3x2 grid of feature cards each with large emoji icon bold title description text. How it works section: 3 numbered steps Submit a Request Get Quotes Track and Receive. CTA section: Ready to streamline your sourcing heading. Footer. Apple-like premium quality generous whitespace.`
  }
];

async function run() {
  try {
    console.log("Creating Stitch project...");
    const project = await sdk.createProject("E-Studio Dashboard v2");
    console.log("Project:", project.projectId || project.id);

    for (const page of PAGES) {
      console.log(`\nGenerating ${page.name}...`);
      try {
        const screen = await project.generate(page.prompt);
        console.log(`  Screen ID: ${screen.id || screen.screenId}`);

        try {
          const html = await screen.getHtml();
          if (html) {
            console.log(`  HTML URL: ${html}`);
            const resp = await fetch(html);
            const htmlContent = await resp.text();
            const filename = `scripts/stitch-${page.name}.html`;
            writeFileSync(filename, htmlContent);
            console.log(`  Saved ${filename} (${htmlContent.length} bytes)`);
          }
        } catch (e) {
          console.log(`  HTML download failed: ${e.message}`);
        }

        try {
          const image = await screen.getImage();
          if (image) console.log(`  Image: ${image}`);
        } catch (e) {}

        console.log(`  DONE: ${page.name}`);
      } catch (e) {
        console.error(`  FAILED ${page.name}: ${e.message}`);
      }
    }

    console.log("\nAll pages generated!");
  } catch (e) {
    console.error("Fatal:", e.message);
  }

  await client.close();
}

run();
