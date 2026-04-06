import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        print("Navigating to 1688.com...")
        await page.goto("https://1688.com", timeout=60000)
        
        print("Waiting 5 seconds for page load...")
        await asyncio.sleep(5)
        
        print("Taking screenshot...")
        await page.screenshot(path="/tmp/1688_homepage.png", full_page=True)
        
        print("Checking page title...")
        title = await page.title()
        print(f"Title: {title}")
        
        print("Getting page HTML...")
        html = await page.content()
        
        # Save HTML for inspection
        with open("/tmp/1688_page.html", "w") as f:
            f.write(html)
        
        print("✅ Screenshot and HTML saved")
        print("   Screenshot: /tmp/1688_homepage.png")
        print("   HTML: /tmp/1688_page.html")
        
        await browser.close()

asyncio.run(main())
