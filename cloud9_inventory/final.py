import os
import re
import time
import random
import json
import pandas as pd
from playwright.sync_api import sync_playwright

# Load PINCODES dynamically from pincodes.js
PINCODES_FILE = os.path.join(os.path.dirname(__file__), "pincodes.js")
PINCODES = []

if os.path.exists(PINCODES_FILE):
    with open(PINCODES_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        PINCODES = re.findall(r'\b\d{6}\b', content)

# if not PINCODES:
#     # Fallback default pincodes if pincodes.js is missing
#     PINCODES = ["400001", "400002", "400003", "400004", "400005"]
    print(len(PINCODES))
BATCH_SIZE = 5
COOLDOWN_DELAY = 120

def run_scraper():
    all_extracted_rows = []

    with sync_playwright() as p:
        # Launch browser in background (headless=False rakhoge toh screen pe browser dikhega)
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720}
        )
        page = context.new_page()

        print("[*] Instamart load ho raha hai fresh session create karne ke liye...")
        page.goto("https://instamart.in/", wait_until="networkidle")
        time.sleep(5)
        print("[OK] Fresh session & WAF challenge cleared automatically!")

        total = len(PINCODES)

        for idx, pincode in enumerate(PINCODES, start=1):
            print(f"\n[+] Processing Pincode ({idx}/{total}): {pincode}")

            try:
                # 1. Get Place ID via in-browser fetch (takes cookies automatically)
                place_res = page.evaluate("""
                    async (pin) => {
                        const res = await fetch(`https://instamart.in/api/instamart/maps/suggestions?input=${pin}`, {
                            headers: { 'Content-Type': 'application/json' }
                        });
                        return await res.json();
                    }
                """, pincode)

                place_id = place_res["data"][0]["place_id"]
                time.sleep(random.uniform(2, 4))

                # 2. Get Coordinates
                coord_res = page.evaluate("""
                    async (pid) => {
                        const res = await fetch(`https://instamart.in/api/instamart/maps/address-widgets/v2?place_id=${pid}`, {
                            headers: { 'Content-Type': 'application/json' }
                        });
                        return await res.json();
                    }
                """, place_id)

                addr = coord_res["data"]["address"]
                lat = addr["location"]["latitude"]
                lng = addr["location"]["longitude"]
                subtitle = addr.get("subtitle", "")
                time.sleep(random.uniform(2, 4))

                # 3. Get Store IDs
                store_payload = {
                    "data": {
                        "lat": lat,
                        "lng": lng,
                        "address": subtitle,
                        "addressId": "",
                        "annotation": subtitle,
                        "clientId": "INSTAMART-APP"
                    }
                }

                store_res = page.evaluate("""
                    async (payload) => {
                        const res = await fetch("https://instamart.in/api/instamart/home/select-location/v2", {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        return await res.json();
                    }
                """, store_payload)

                pod_list = store_res["data"]["configs"]["IM_PAGE_CONFIGS"]["configInfo"][0]["card"]["podDetailsList"]
                p_store = pod_list[0]["podId"]
                s_store = pod_list[1]["podId"] if len(pod_list) > 1 else p_store
                time.sleep(random.uniform(2, 4))

                # 4. Search Cloud9
                search_payload = {
                    "facets": [],
                    "sortAttribute": "",
                    "query": "cloud9",
                    "search_results_offset": "0",
                    "is_pre_search_tag": False,
                    "page_type": "INSTAMART_SEARCH_PAGE"
                }

                search_res = page.evaluate("""
                    async ({ p_store, s_store, payload }) => {
                        const url = `https://instamart.in/api/instamart/search/v2?offset=0&storeId=${p_store}&primaryStoreId=${p_store}&secondaryStoreId=${s_store}&ageConsent=false&layoutId=4987&voiceSearchTrackingId=`;
                        const res = await fetch(url, {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        return await res.json();
                    }
                """, {"p_store": p_store, "s_store": s_store, "payload": search_payload})

                # 5. Extract Cloud9 Items
                cards = search_res.get("data", {}).get("cards", [])
                for card_wrapper in cards:
                    widget = card_wrapper.get("card", {}).get("card", {})
                    if not widget:
                        continue
                    
                    widget_type = widget.get("@type", "")
                    items_list = []
                    if widget_type == 'type.googleapis.com/swiggy.gandalf.widgets.v2.GridWidget':
                        items_list = widget.get("gridElements", {}).get("infoWithStyle", {}).get("items", [])
                    elif widget_type == 'type.googleapis.com/swiggy.im.v1.OOSItemCollectionCard':
                        items_list = widget.get("items", {}).get("items", [])

                    for prod in items_list:
                        brand = (prod.get("brand") or "").lower()
                        name = prod.get("displayName") or ""
                        if "cloud9" in brand or "cloud 9" in name.lower():
                            for v in prod.get("variations", []):
                                all_extracted_rows.append({
                                    "pincode": pincode,
                                    "parent_product_name": name,
                                    "variant_product_name": v.get("displayName"),
                                    "sku_id": v.get("skuId"),
                                    "size": v.get("quantityDescription"),
                                    "mrp": v.get("price", {}).get("mrp", {}).get("units", "N/A"),
                                    "offer_price": v.get("price", {}).get("offerPrice", {}).get("units", "N/A"),
                                    "in_stock": "Yes" if v.get("inventory", {}).get("inStock") else "Out of Stock",
                                    "max_allowed_cart_qty": v.get("cartAllowedQuantity", {}).get("allowedQuantity", 0)
                                })

                print(f"[OK] {pincode} processed successfully!")

            except Exception as e:
                print(f"[-] Error at {pincode}: {e}")

            # Batch pause
            if idx % BATCH_SIZE == 0 and idx < total:
                print(f"\n[i] 5 Pincodes done. Cooldown for {COOLDOWN_DELAY}s...")
                time.sleep(COOLDOWN_DELAY)
            else:
                time.sleep(random.uniform(4, 7))

        browser.close()

    # Save to Excel
    if all_extracted_rows:
        df = pd.DataFrame(all_extracted_rows)
        df.to_excel("cloud9_auto_extracted.xlsx", index=False)
        print("\n[DONE] Done! Excel file saved: cloud9_auto_extracted.xlsx")
    else:
        print("\n[-] No data extracted.")

if __name__ == "__main__":
    run_scraper()