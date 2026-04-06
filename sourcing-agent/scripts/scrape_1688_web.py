#!/usr/bin/env python3
"""
1688.com Web Automation Script
Created: 2026-03-28
Purpose: Automate supplier search on 1688.com website
"""

import asyncio
import json
import time
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

class Supplier1688Scraper:
    """Scrape suppliers from 1688.com website"""

    def __init__(self):
        self.base_url = "https://1688.com"
        self.suppliers = []
        self.search_terms = [
            "充电宝租赁柜",
            "共享充电宝",
            "18650电池充电站",
            "弹针充电 dock",
            "电池充电柜",
            "锂电池租赁设备",
            "USB充电桩"
        ]

    async def search_suppliers(self, search_term: str, max_pages: int = 3):
        """Search for suppliers on 1688.com"""
        print(f"🔍 Searching: {search_term}")

        async with async_playwright() as p:
            # Launch browser (headless)
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            try:
                # Navigate to 1688.com
                print(f"  🌐 Navigating to 1688.com...")
                await page.goto(self.base_url, timeout=30000)
                await asyncio.sleep(2)

                # Find search box
                print(f"  🔍 Finding search box...")
                search_selectors = [
                    'input[placeholder*="搜索"]',
                    'input[name="keywords"]',
                    '#key',
                    '.search-input'
                ]

                search_box = None
                for selector in search_selectors:
                    try:
                        search_box = await page.wait_for_selector(selector, timeout=5000)
                        if search_box:
                            break
                    except:
                        continue

                if not search_box:
                    print(f"  ❌ Could not find search box")
                    return []

                # Input search term
                print(f"  ⌨️  Entering search term...")
                await search_box.fill(search_term)
                await asyncio.sleep(1)

                # Submit search
                print(f"  🎯 Submitting search...")
                await search_box.press("Enter")
                await asyncio.sleep(5)

                # Extract suppliers from multiple pages
                page_suppliers = []
                for page_num in range(1, max_pages + 1):
                    print(f"  📄 Scraping page {page_num}...")
                    suppliers = await self.extract_suppliers_from_page(page)
                    page_suppliers.extend(suppliers)
                    print(f"     Found {len(suppliers)} suppliers")

                    # Try to go to next page
                    if page_num < max_pages:
                        try:
                            next_button = await page.wait_for_selector('a.next:not(.disabled)', timeout=3000)
                            if next_button:
                                await next_button.click()
                                await asyncio.sleep(3)
                            else:
                                break
                        except:
                            break

                print(f"  ✅ Total suppliers found: {len(page_suppliers)}")
                return page_suppliers

            except Exception as e:
                print(f"  ❌ Error: {e}")
                return []

            finally:
                await browser.close()

    async def extract_suppliers_from_page(self, page):
        """Extract supplier information from current page"""
        suppliers = []

        try:
            # Take screenshot for debugging
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            await page.screenshot(path=f"/tmp/1688_search_{timestamp}.png")

            # Try different selectors for supplier cards
            supplier_selectors = [
                '.offer-item',
                '.sm-offer-item',
                '.sw-offer-item',
                '[data-product-list]',
                '.offer-card'
            ]

            for selector in supplier_selectors:
                try:
                    elements = await page.query_selector_all(selector)
                    if elements and len(elements) > 0:
                        print(f"     Found {len(elements)} elements with selector: {selector}")

                        for element in elements:
                            supplier = await self.extract_supplier_info(element)
                            if supplier:
                                suppliers.append(supplier)

                        if len(suppliers) > 0:
                            break

                except Exception as e:
                    print(f"     Error with selector {selector}: {e}")
                    continue

        except Exception as e:
            print(f"  ❌ Extraction error: {e}")

        return suppliers

    async def extract_supplier_info(self, element):
        """Extract information from a single supplier element"""
        try:
            # Try to extract company name
            name_selectors = [
                '.title a',
                '.offer-title a',
                'a[title]',
                'h4 a',
                '.company-name'
            ]

            name = "N/A"
            for selector in name_selectors:
                try:
                    name_elem = await element.query_selector(selector)
                    if name_elem:
                        name = await name_elem.inner_text()
                        name = name.strip()
                        if name and name != "N/A":
                            break
                except:
                    continue

            # Try to extract price
            price_selectors = [
                '.price',
                '.offer-price',
                '.value'
            ]

            price = "N/A"
            for selector in price_selectors:
                try:
                    price_elem = await element.query_selector(selector)
                    if price_elem:
                        price = await price_elem.inner_text()
                        price = price.strip()
                        if price:
                            break
                except:
                    continue

            # Try to extract location
            location_selectors = [
                '.location',
                '.offer-location',
                '.address'
            ]

            location = "N/A"
            for selector in location_selectors:
                try:
                    loc_elem = await element.query_selector(selector)
                    if loc_elem:
                        location = await loc_elem.inner_text()
                        location = location.strip()
                        if location:
                            break
                except:
                    continue

            # Only return if we got at least a name
            if name and name != "N/A":
                return {
                    'company_name': name,
                    'price': price,
                    'location': location,
                    'scraped_at': datetime.now().isoformat()
                }

        except Exception as e:
            print(f"  Error extracting supplier: {e}")

        return None

    async def run_all_searches(self):
        """Run all searches and save results"""
        print("🚀 Starting 1688.com supplier search automation")
        print("=" * 60)

        all_suppliers = []

        for term in self.search_terms:
            suppliers = await self.search_suppliers(term, max_pages=2)
            all_suppliers.extend(suppliers)

            # Rate limiting
            await asyncio.sleep(5)

        # Remove duplicates based on company name
        unique_suppliers = self.deduplicate_suppliers(all_suppliers)

        print()
        print(f"📊 TOTAL SUPPLIERS FOUND: {len(unique_suppliers)}")

        # Save to JSON
        self.save_suppliers(unique_suppliers)

        return unique_suppliers

    def deduplicate_suppliers(self, suppliers):
        """Remove duplicate suppliers based on company name"""
        seen = set()
        unique = []

        for supplier in suppliers:
            name = supplier.get('company_name', '')
            if name and name not in seen and name != "N/A":
                seen.add(name)
                unique.append(supplier)

        return unique

    def save_suppliers(self, suppliers):
        """Save suppliers to JSON file"""
        output_dir = Path.home() / '.openclaw' / 'workspace' / 'sourcing-agent'
        output_file = output_dir / 'suppliers_1688.json'

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(suppliers, f, indent=2, ensure_ascii=False)

        print(f"✅ Results saved to: {output_file}")

async def main():
    """Main execution"""
    scraper = Supplier1688Scraper()
    await scraper.run_all_searches()

if __name__ == "__main__":
    asyncio.run(main())
