# 🤖 Genymotion Automation Implementation Plan

**Project:** 1688.com Supplier Search Automation
**Technology:** Genymotion Android Emulator
**Date:** 2026-03-28 18:55 HKT
**Goal:** Automate supplier search and data extraction from 1688.com

---

## 🎯 System Architecture

```
OpenClaw Gateway
    ↓
Python Automation Script
    ↓
Genymotion Emulator (Android 11-13)
    ↓
1688.com Android App
    ↓
Supplier Data Extraction
    ↓
Database/CSV Export
```

---

## 📋 Phase 1: Genymotion Setup (Day 1)

### **1.1 Installation Options**

**Option A: Genymotion Cloud** (Easiest)
- Website: https://www.genymotion.com
- Sign up for account
- Launch cloud device
- Access via API
- No local installation needed

**Option B: Genymotion Desktop** (Local)
- Download: https://www.genymotion.com/product-desktop/
- Install on Linux system
- Create virtual Android device
- Run locally

**Option C: Genymotion SaaS** (Professional)
- Cloud-based Android devices
- API access (FlintAPI)
- CI/CD integration
- Scalable

**Recommended:** Start with **Genymotion Desktop** (free trial available)

---

### **1.2 Device Configuration**

**Android Version:** 11 or 12 (stable)
**Device Type:** Pixel 5 or Samsung Galaxy S21
**RAM:** 4096 MB
**Storage:** 8 GB
**Features:**
- Google Play Store access
- ADB enabled
- Screen recording capability

---

### **1.3 Installation Steps**

```bash
# 1. Download Genymotion
wget https://dl.genymotion.com/releases/genymotion-3.2.1-linux.tar.gz

# 2. Extract
tar -xzf genymotion-3.2.1-linux.tar.gz

# 3. Run
./genymotion/genymotion

# 4. Create account or sign in

# 5. Download device image (Android 11/12)

# 6. Launch device
```

---

## 📱 Phase 2: 1688.com App Installation (Day 1)

### **2.1 Download 1688.com App**

**From Device:**
1. Open Google Play Store (on Genymotion)
2. Search: "1688" or "阿里巴巴"
3. Install: 1688.com app (com.alibaba.wireless)
4. Open app and login (if you have account)

**Alternative (ADB):**
```bash
# Download APK from APKPure or similar
wget https://apkpure.com/1688/com.alibaba.wireless/download

# Install via ADB
adb install 1688.apk

# Launch app
adb shell am start -n com.alibaba.wireless/.ui.MainActivity
```

---

## 🤖 Phase 3: Automation Script Development (Day 2-3)

### **3.1 Control Options**

**Option A: ADB (Android Debug Bridge)**
```python
import subprocess

class GenymotionController:
    def __init__(self):
        self.device_id = "localhost:5555"
    
    def tap(self, x, y):
        subprocess.run(["adb", "shell", "input", "tap", str(x), str(y)])
    
    def input_text(self, text):
        subprocess.run(["adb", "shell", "input", "text", text])
    
    def swipe(self, x1, y1, x2, y2):
        subprocess.run(["adb", "shell", "input", "swipe", str(x1), str(y1), str(x2), str(y2)])
    
    def screenshot(self, filename):
        subprocess.run(["adb", "shell", "screencap", "-p", "/sdcard/screen.png"])
        subprocess.run(["adb", "pull", "/sdcard/screen.png", filename])
    
    def get_xml_layout(self):
        result = subprocess.run(["adb", "shell", "uiautomator", "dump"], capture_output=True)
        return result.stdout
```

**Option B: Appium (Mobile Automation)**
```python
from appium import webdriver

capabilities = {
    'platformName': 'Android',
    'deviceName': 'Genymotion',
    'automationName': 'UiAutomator2',
    'app': '/path/to/1688.apk',
    'udid': 'localhost:5555'
}

driver = webdriver.Remote('http://localhost:4723/wd/hub', capabilities)

# Search and extract
search_box = driver.find_element_by_id("search_input")
search_box.send_keys("充电宝租赁柜")

search_button = driver.find_element_by_id("search_button")
search_button.click()

# Extract results
suppliers = driver.find_elements_by_class_name("supplier_card")
for supplier in suppliers:
    name = supplier.find_element_by_class_name("name").text
    contact = supplier.find_element_by_class_name("contact").text
    # Save to database
```

**Option C: UIAutomator2 (Android Native)**
```python
import xml.etree.ElementTree as ET

class SupplierScraper:
    def extract_suppliers(self):
        # Get current screen XML
        xml = self.controller.get_xml_layout()
        root = ET.fromstring(xml)
        
        # Find supplier elements
        suppliers = []
        for node in root.iter():
            if 'supplier' in node.attrib.get('resource-id', ''):
                name = node.find('.//*[@resource-id="name"]')
                contact = node.find('.//*[@resource-id="contact"]')
                suppliers.append({
                    'name': name.text if name is not None else '',
                    'contact': contact.text if contact is not None else ''
                })
        
        return suppliers
```

---

## 🔍 Phase 4: Search Automation (Day 3-4)

### **4.1 Search Process**

```python
class SupplierSearch:
    def __init__(self):
        self.controller = GenymotionController()
        self.search_terms = [
            "充电宝租赁柜",
            "共享充电宝",
            "18650电池充电站",
            "弹针充电 dock",
            "电池充电柜"
        ]
    
    def search_1688(self, term):
        # Launch app
        subprocess.run(["adb", "shell", "am", "start", "-n", "com.alibaba.wireless/.ui.MainActivity"])
        time.sleep(5)
        
        # Navigate to search
        self.controller.tap(500, 100)  # Search button location
        time.sleep(1)
        
        # Input search term
        self.controller.input_text(term)
        time.sleep(1)
        
        # Submit search
        self.controller.tap(800, 100)  # Submit button
        time.sleep(3)
        
        # Extract results
        suppliers = self.extract_suppliers_from_results()
        
        return suppliers
    
    def extract_suppliers_from_results(self):
        # Take screenshot for debugging
        self.controller.screenshot("search_results.png")
        
        # Get XML layout
        xml = self.controller.get_xml_layout()
        
        # Parse XML to extract supplier info
        suppliers = self.parse_supplier_xml(xml)
        
        return suppliers
```

---

## 📊 Phase 5: Data Extraction & Storage (Day 4)

### **5.1 Data Structure**

```python
@dataclass
class Supplier:
    company_name_cn: str
    company_name_en: str
    location: dict
    website: str
    url_1688: str
    contact_person: str
    wechat: str
    phone: str
    qq: str
    product_match: bool
    certifications: list
    capabilities: dict
    score: int
```

### **5.2 Save to Database**

```python
import json
from pathlib import Path

class SupplierDatabase:
    def __init__(self):
        self.db_path = Path.home() / '.openclaw' / 'workspace' / 'sourcing-agent' / 'suppliers'
    
    def save_supplier(self, supplier: dict):
        supplier_id = supplier['name_en'].lower().replace(' ', '_')
        filename = f"supplier_{supplier_id}.json"
        
        with open(self.db_path / filename, 'w') as f:
            json.dump(supplier, f, indent=2, ensure_ascii=False)
    
    def export_to_csv(self, suppliers: list):
        import pandas as pd
        df = pd.DataFrame(suppliers)
        df.to_csv('suppliers_1688.csv', index=False)
```

---

## 🚀 Phase 6: Integration & Testing (Day 5)

### **6.1 Full Workflow**

```python
def main():
    # 1. Start Genymotion device
    subprocess.run(["gmtool", "start", "pixel_5"])
    time.sleep(10)
    
    # 2. Connect ADB
    subprocess.run(["adb", "connect", "localhost:5555"])
    
    # 3. Initialize automation
    search = SupplierSearch()
    database = SupplierDatabase()
    
    # 4. Execute searches
    all_suppliers = []
    for term in search_terms:
        suppliers = search.search_1688(term)
        all_suppliers.extend(suppliers)
        time.sleep(5)  # Rate limiting
    
    # 5. Deduplicate
    unique_suppliers = deduplicate_suppliers(all_suppliers)
    
    # 6. Save to database
    for supplier in unique_suppliers:
        database.save_supplier(supplier)
    
    # 7. Export for review
    database.export_to_csv(unique_suppliers)
    
    print(f"✅ Found {len(unique_suppliers)} suppliers")
```

---

## 📝 Phase 7: Error Handling & Robustness (Day 5)

### **7.1 Common Issues**

**App Crashes:**
- Detect crash (logcat monitoring)
- Restart app automatically
- Continue search

**Network Issues:**
- Check connectivity
- Wait for network recovery
- Retry with exponential backoff

**Rate Limiting:**
- Add delays between searches
- Randomize timing
- Respect 1688.com limits

**Data Extraction Fails:**
- Take screenshots for debugging
- Log errors
- Fallback to manual extraction

---

## 📊 Implementation Timeline

| Day | Task | Status |
|-----|------|--------|
| 1 | Genymotion installation & setup | Pending |
| 1 | 1688.com app installation | Pending |
| 2 | ADB control script development | Pending |
| 2 | Basic search automation | Pending |
| 3 | Advanced data extraction | Pending |
| 3 | XML parsing and scraping | Pending |
| 4 | Database integration | Pending |
| 4 | CSV export functionality | Pending |
| 5 | Error handling & testing | Pending |
| 5 | Full workflow integration | Pending |

**Total:** 5 days

---

## 💰 Cost Analysis

**Genymotion:**
- Free trial: 30 days
- Personal: $99/year (after trial)
- Cloud: From $50/month

**Development:**
- Time: 5 days
- Your time: Setup and configuration
- My time: Script development

**Ongoing:**
- Near-zero after setup
- No API costs
- No per-query fees

---

## 🎯 Success Criteria

**Working System:**
- ✅ Genymotion launches automatically
- ✅ 1688.com app opens
- ✅ Search terms execute
- ✅ Supplier data extracted
- ✅ Data saved to database
- ✅ Export to CSV for review
- ✅ You verify before contact

**Target:** 10-20 qualified suppliers from 1688.com

---

## 📋 Next Steps

**Today:**
1. You approve this plan
2. I start Genymotion setup
3. Download and install 1688.com app
4. Test basic ADB control

**This Week:**
1. Develop automation scripts
2. Implement search automation
3. Test with real searches
4. Extract and organize data

**Next Week:**
1. Full automation running
2. Scheduled searches
3. Data pipeline in place
4. Ready for supplier contact

---

**Status:** ✅ PLAN READY - Awaiting your approval to start implementation

*Created: 2026-03-28 18:55 HKT*
*Technology: Genymotion + ADB/Appium*
*Project: 1688.com Supplier Search Automation*
