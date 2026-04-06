import { Stitch, StitchToolClient } from "@google/stitch-sdk";
import { writeFileSync } from "fs";

const client = new StitchToolClient({
  apiKey: process.env.STITCH_API_KEY,
  timeout: 300000,
});

const sdk = new Stitch(client);

async function run() {
  try {
    // Simple test first
    console.log("Creating project...");
    const project = await sdk.createProject("E-Studio v2");
    console.log("Project:", project.projectId || project.id);

    // Try one page with a shorter prompt
    console.log("\nGenerating landing page (short prompt)...");
    const screen = await project.generate(
      "Dark SaaS landing page for a sourcing platform called E-Studio. Navy background, blue accents. Hero section with headline and CTA buttons. Feature cards grid. Modern clean design."
    );
    console.log("Screen:", screen.id || screen.screenId);

    const html = await screen.getHtml();
    console.log("HTML:", html);

    if (html) {
      const resp = await fetch(html);
      const text = await resp.text();
      writeFileSync("scripts/stitch-landing.html", text);
      console.log("Saved! Size:", text.length);
    }

    const image = await screen.getImage();
    console.log("Image:", image);
  } catch (e) {
    console.error("Error:", e.message);
    console.error("Code:", e.code);
  }

  await client.close();
}

run();
