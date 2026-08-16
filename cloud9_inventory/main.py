import time
import random
import pandas as pd
from curl_cffi import requests

# -------------------------------------------------------------
# Configuration
# -------------------------------------------------------------
PINCODES = [
    "400001", "400002", "400003", "400004", "400005"
    # Paste all your pincodes here
]

BATCH_SIZE = 5
COOLDOWN_DELAY = 120  # 2 minutes cool-down pause after every 5 pincodes
STEP_DELAY_MIN = 3
STEP_DELAY_MAX = 6

# Base headers matching your n8n flow
BASE_HEADERS = {
    "Host": "instamart.in",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://instamart.in/",
    "Content-Type": "application/json",
    "X-Build-Version": "2.363.0",
    "x-device-id": "ea548e3a-3f99-4f1c-9591-6cbedfc3c7f0",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Connection": "keep-alive",
    "Cookie": (
        "deviceId=s%3Aea548e3a-3f99-4f1c-9591-6cbedfc3c7f0.arP8jLW0d%2FV7x6NiLOzEgk5mZAreFPtgjLS8O7%2FYTcE; "
        "tid=eyJLSUQiOiIyIiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3ODY2NjM3OTQsImlhdCI6MTc4NjY2MDE5NCwic2Vzc2lvbl9kYXRhIjoiVXVJazZGYys0alA2ZHVMVHdiYWlqZmpzanZJUDYzTWpRa0IrK2R1eEplTEpMV2VzUFBjZmJyZDdweXBCVVJHRmVrTEZtLzJrdnFYNUtKQVhRWGFNQ0FjcXBjYUV2eGtRQitHVEc0Q0hBakNRNy8yWnhzSmFDb0RYMXBPTWFPVXpRMmJjNVpiY2tWdFlaYTcwZTBYY3FNMDI5cEJicFdicWhlclRzdVk0NktvZTJRTGtrREx1NWVsRTM5RXF4WkZvTXJtK2JySWNmNVBkSEs2eVpGKzZZUT09Iiwic2lkIjoidDFmMmNjMWJjZGEtNDI0Yy00Y2Y2LTg3ZTctYTdlYmJhY2U2Iiwic3ViIjoiZGIyZDM3ZmUtMzU4Yi00N2Q0LWE2MzgtOWU0NDFkOWFmZWY3IiwidXNlcl9pZCI6IjAifQ.q-BKT6NlYAd4Gd9VVgke18UxkS-CtNQaERl8wZc8oL8; "
        "versionCode=1200; platform=web; subplatform=dweb; "
        "aws-waf-token=51d6fe6f-1ca9-46a8-9717-d71135f4b33e:BQoAp2WdsawQAAAA:2KEt35IM0krEGR87OTK9UPUVAjURXIRjzv5PcypNrHWLRnpGBvSWPcFD0Qn2L2kXE+TmLeIw/Sh86QJmeFZmSYgsHIBjO1B6SHZ7Ko/zM47RKa9Qs30gLmYmnGm8eQtjwzTKgKC/Dx6sY1mbm7XsgMSFJoOxZ9vCmPXK6bClBTSmsGQz+ww5YJGsIqE42cZIaXYnZRDq0MYLvTVG3+hC+XxHAgwg3Yv5dhOOA1Kgf2hXNLd0lEY+IdFHBJZuTpRCLbA="
    )
}

session = requests.Session(impersonate="chrome124")


def fetch_with_retry(method, url, matcher=None, max_retries=3, **kwargs):
    """Executes requests with proper matcher header, browser impersonation, and retry on empty/fail."""
    headers = BASE_HEADERS.copy()
    if matcher:
        headers["matcher"] = matcher

    for attempt in range(1, max_retries + 1):
        try:
            response = session.request(method, url, headers=headers, timeout=20, **kwargs)
            if response.status_code == 200:
                res_json = response.json()
                if res_json and res_json.get("data") is not None:
                    return res_json
                print(f"      [!] Attempt {attempt}: Received 200 OK but data is empty/null.")
            else:
                print(f"      [!] Attempt {attempt}: HTTP Status {response.status_code} - {response.text[:80]}")
        except Exception as e:
            print(f"      [!] Attempt {attempt}: Exception -> {e}")

        time.sleep(random.uniform(4, 7))

    return None


def extract_cloud9_products(pincode, response_data):
    """Exact JavaScript port of the 'Extract Cloud9 Data' node."""
    extracted = []
    data_obj = response_data.get("data") or response_data
    cards = data_obj.get("cards", []) if isinstance(data_obj, dict) else []

    for card_wrapper in cards:
        widget = card_wrapper.get("card", {}).get("card", {})
        if not widget:
            continue

        widget_type = widget.get("@type", "")
        items_list = []

        if widget_type == "type.googleapis.com/swiggy.gandalf.widgets.v2.GridWidget":
            items_list = widget.get("gridElements", {}).get("infoWithStyle", {}).get("items", [])
        elif widget_type == "type.googleapis.com/swiggy.im.v1.OOSItemCollectionCard":
            items_list = widget.get("items", {}).get("items", [])

        for prod_item in items_list:
            brand_name = (prod_item.get("brand") or "").lower()
            parent_product_name = prod_item.get("displayName") or ""

            if "cloud9" in brand_name or "cloud 9" in parent_product_name.lower():
                variations = prod_item.get("variations", [])
                for variant in variations:
                    extracted.append({
                        "pincode": pincode,
                        "parent_product_name": parent_product_name,
                        "variant_product_name": variant.get("displayName"),
                        "sku_id": variant.get("skuId"),
                        "size": variant.get("quantityDescription"),
                        "mrp": variant.get("price", {}).get("mrp", {}).get("units", "N/A"),
                        "offer_price": variant.get("price", {}).get("offerPrice", {}).get("units", "N/A"),
                        "in_stock": "Yes" if variant.get("inventory", {}).get("inStock") else "Out of Stock",
                        "max_allowed_cart_qty": variant.get("cartAllowedQuantity", {}).get("allowedQuantity", 0)
                    })

    return extracted


def process_pincode(pincode):
    print(f"\n[+] Processing Pincode: {pincode}")

    # 1. Get Place ID (maps/suggestions)
    url_place = "https://instamart.in/api/instamart/maps/suggestions"
    res_place = fetch_with_retry("GET", url_place, matcher="agfcb8efddd79a88eagaf7d", params={"input": pincode})
    if not res_place:
        print(f"[-] Failed at 'Get Place ID' for {pincode}")
        return []

    try:
        place_id = res_place["data"][0]["place_id"]
    except (KeyError, IndexError, TypeError):
        print(f"[-] Could not parse place_id for {pincode}")
        return []

    time.sleep(random.uniform(STEP_DELAY_MIN, STEP_DELAY_MAX))

    # 2. Get Coordinates (maps/address-widgets/v2)
    url_coord = "https://instamart.in/api/instamart/maps/address-widgets/v2"
    res_coord = fetch_with_retry("GET", url_coord, matcher="b779a8efdddafbgebcaf79d", params={"place_id": place_id})
    if not res_coord:
        print(f"[-] Failed at 'Get Coordinates' for {pincode}")
        return []

    try:
        address_obj = res_coord["data"]["address"]
        lat = address_obj["location"]["latitude"]
        lng = address_obj["location"]["longitude"]
        subtitle = address_obj.get("subtitle", "")
    except (KeyError, TypeError):
        print(f"[-] Could not parse coordinates for {pincode}")
        return []

    time.sleep(random.uniform(STEP_DELAY_MIN, STEP_DELAY_MAX))

    # 3. Get Store IDs (home/select-location/v2)
    url_store = "https://instamart.in/api/instamart/home/select-location/v2"
    payload_store = {
        "data": {
            "lat": lat,
            "lng": lng,
            "address": subtitle,
            "addressId": "",
            "annotation": subtitle,
            "clientId": "INSTAMART-APP"
        }
    }
    res_store = fetch_with_retry("POST", url_store, matcher="fabbc8efdddaea779dgggdf", json=payload_store)
    if not res_store:
        print(f"[-] Failed at 'Get Store IDs' for {pincode}")
        return []

    try:
        pod_details = res_store["data"]["configs"]["IM_PAGE_CONFIGS"]["configInfo"][0]["card"]["podDetailsList"]
        primary_store_id = pod_details[0]["podId"]
        secondary_store_id = pod_details[1]["podId"] if len(pod_details) > 1 else primary_store_id
    except (KeyError, IndexError, TypeError):
        print(f"[-] Could not parse Store IDs for {pincode}")
        return []

    time.sleep(random.uniform(STEP_DELAY_MIN, STEP_DELAY_MAX))

    # 4. Search Cloud9 (search/v2)
    url_search = "https://instamart.in/api/instamart/search/v2"
    params_search = {
        "offset": "0",
        "storeId": primary_store_id,
        "primaryStoreId": primary_store_id,
        "secondaryStoreId": secondary_store_id,
        "ageConsent": "false",
        "layoutId": "4987",
        "voiceSearchTrackingId": ""
    }
    payload_search = {
        "facets": [],
        "sortAttribute": "",
        "query": "cloud9",
        "search_results_offset": "0",
        "is_pre_search_tag": False,
        "page_type": "INSTAMART_SEARCH_PAGE"
    }
    res_search = fetch_with_retry("POST", url_search, matcher="agfcb8efddd79a88eagaf7d", params=params_search, json=payload_search)
    if not res_search:
        print(f"[-] Failed at 'Search Cloud9' for {pincode}")
        return []

    # 5. Extract items
    extracted_items = extract_cloud9_products(pincode, res_search)
    print(f"[✓] Extracted {len(extracted_items)} Cloud9 variants for {pincode}")
    return extracted_items


def main():
    all_extracted_rows = []
    total = len(PINCODES)

    for idx, pincode in enumerate(PINCODES, start=1):
        items = process_pincode(pincode)
        if items:
            all_extracted_rows.extend(items)

        # Batch break / Cooldown pause after every 5 items
        if idx % BATCH_SIZE == 0 and idx < total:
            print(f"\n=======================================================")
            print(f"[i] Batch of {BATCH_SIZE} completed ({idx}/{total}).")
            print(f"[i] Cooldown pause for {COOLDOWN_DELAY} seconds...")
            print(f"=======================================================\n")
            time.sleep(COOLDOWN_DELAY)
        else:
            time.sleep(random.uniform(STEP_DELAY_MIN, STEP_DELAY_MAX))

    # Save rows directly to Excel
    if all_extracted_rows:
        df = pd.DataFrame(all_extracted_rows)
        output_file = "cloud9_instamart_extracted.xlsx"
        df.to_excel(output_file, index=False)
        print(f"\n[🎉] Done! Successfully saved {len(all_extracted_rows)} product rows to '{output_file}'.")
    else:
        print("\n[-] No product items extracted.")


if __name__ == "__main__":
    main()