#!/usr/bin/env python3
"""
1688.com Automation with Manual CAPTCHA Assist
Created: 2026-03-29
Purpose: Automate 1688.com with user help for CAPTCHA
"""

import asyncio
import json
import time
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

class Supplier1688WithAssist:
    """Scrape 1688.com with user CAPTCHA assistance"""

    def __init__(self):
        self.base_url = "https://1688.com"
        self.suppliers = []
        self.search_terms = [
            "充电宝租赁柜",
            "共享充电宝",
            "18650电池充电站",
            "弹针充电 dock",
            "电池充电柜"
        ]

    async def search_with_assist(self, search_term: str):
        """Search with user assistance for CAPTCHA"""
        print(f"🔍 Searching: {search_term}")

        async with async_playwright() as p:
            # Launch browser (HEADFUL so user can see and help with CAPTCHA)
            browser = await p.chromium.launch(headless=False)
            page = await browser.new_page()

            try:
                # Navigate to 1688.com
                print(f"  🌐 Navigating to 1688.com...")
                await page.goto(self.base_url, timeout=60000)

                print(f"  ⏸️  PAUSED: Please complete CAPTCHA if present")
                print(f"  ⏸️  Press Enter in terminal when ready to continue...")
                input()  # Wait for user to press Enter

                print(f"  ✅ Resuming...")

                # Wait a bit for page to fully load after CAPTCHA
                await asyncio.sleep(3)

                # Find and use search box
                search_selectors = [
                    'input[placeholder*="搜索"]',
                    'input[name="keywords"]',
                    '#key',
                    '.search-input',
                    'input[data-spm="search"]'
                ]

                search_box = None
                for selector in search_selectors:
                    try:
                        search_box = await page.wait_for_selector(selector, timeout=5000)
                        if search_box:
                            print(f"  ✅ Found search box with: {selector}")
                            break
                    except:
                        continue

                if not search_box:
                    print(f"  ❌ Could not find search box")
                    return []

                # Input search term
                print(f"  ⌨️  Entering: {search_term}")
                await search_box.fill(search_term)
                await asyncio.sleep(1)

                # Submit search
                await search_box.press("Enter")
                print(f"  🎯 Search submitted...")
                await asyncio.sleep(5)

                # Extract suppliers
                print(f"  📊 Extracting suppliers...")
                suppliers = await self.extract_suppliers_from_page(page)
                print(f"  ✅ Found {len(suppliers)} suppliers")

                # Ask if user wants to search more pages
                more = input("  ❓ Search more pages? (y/n): ")
                if more.lower() == 'y':
                    page_num = 2
                    while page_num <= 5:
                        try:
                            next_button = await page.wait_for_selector('a.next:not(.disabled)', timeout=3000)
                            if next_button:
                                await next_button.click()
                                await asyncio.sleep(3)
                                more_suppliers = await self.extract_suppliers_from_page(page)
                                suppliers.extend(more_suppliers)
                                print(f"     Page {page_num}: {len(more_suppliers)} suppliers")

                                more = input(f"     ❓ Continue to page {page_num + 1}? (y/n): ")
                                if more.lower() != 'y':
                                    break
                                page_num += 1
                            else:
                                break
                        except:
                            break

                return suppliers

            except Exception as e:
                print(f"  ❌ Error: {e}")
                import traceback
                traceback.print_exc()
                return []

            finally:
                print(f"  ⏸️  Search complete. Press Enter to close browser...")
                input()  # Wait for user to review
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
                '.offer-card',
                '.item',
                '.offer'
            ]

            for selector in supplier_selectors:
                try:
                    elements = await page.query_selector_all(selector)
                    if elements and len(elements) > 0:
                        print(f"     Found {len(elements)} elements with: {selector}")

                        for idx, element in enumerate(elements):
                            if idx > 20:  # Limit to first 20
                                break
                            supplier = await self.extract_supplier_info(element)
                            if supplier:
                                suppliers.append(supplier)

                        if len(suppliers) > 0:
                            break

                except Exception as e:
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
                '.company-name',
                '.offer-title'
            ]

            name = "N/A"
            for selector in name_selectors:
                try:
                    name_elem = await element.query_selector(selector)
                    if name_elem:
                        name = await name_elem.inner_text()
                        name = name.strip()
                        if name and len(name) > 2 and name != "N/A":
                            break
                except:
                    continue

            # Try to extract price
            price_selectors = [
                '.price',
                '.offer-price',
                '.value',
                '.price-value'
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
                '.address',
                '.company-address'
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
            if name and name != "N/A" and len(name) > 2:
                return {
                    'company_name': name,
                    'price': price,
                    'location': location,
                    'scraped_at': datetime.now().isoformat()
                }

        except Exception as e:
            pass

        return None

    async def run_with_assist(self):
        """Run all searches with user assistance"""
        print("🚀 1688.com Supplier Search with CAPTCHA Assist")
        print("=" * 60)
        print()
        print("📋 Instructions:")
        print("  1. Browser will open (headful - you can see it)")
        print("  2. Complete CAPTCHA when prompted")
        print("  3. Press Enter in terminal to continue")
        print("  4. Script will search and extract suppliers")
        print("  5. You can review before closing browser")
        print()
        input("Press Enter to start...")
        print()

        all_suppliers = []

        for idx, term in enumerate(self.search_terms, 1):
            print(f"\n🔍 Search {idx}/{len(self.search_terms)}: {term}")
            suppliers = await self.search_with_assist(term)
            all_suppliers.extend(suppliers)

            if idx < len(self.search_terms):
                cont = input(f"\n❓ Continue to next search term? (y/n): ")
                if cont.lower() != 'y':
                    break

        # Remove duplicates
        unique_suppliers = self.deduplicate_suppliers(all_suppliers)

        print()
        print(f"📊 TOTAL UNIQUE SUPPLIERS: {len(unique_suppliers)}")

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
        output_file = output_dir / 'suppliers_1688_assisted.json'

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(suppliers, f, indent=2, ensure_ascii=False)

        print(f"✅ Results saved to: {output_file}")

async def main():
    """Main execution"""
    scraper = Supplier1688WithAssist()
    await scraper.run_with_assist()

if __name__ == "__main__":
    asyncio.run(main())
