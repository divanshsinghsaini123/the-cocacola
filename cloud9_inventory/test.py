import json
from curl_cffi import requests

# Headers exactly from your n8n workflow
HEADERS = {
    "Host": "instamart.in",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://instamart.in/",
    "Content-Type": "application/json",
    "X-Build-Version": "2.363.0",
    "matcher": "agfcb8efddd79a88eagaf7d",
    "x-device-id": "ea548e3a-3f99-4f1c-9591-6cbedfc3c7f0",
    "Cookie": (
        "deviceId=s%3Aea548e3a-3f99-4f1c-9591-6cbedfc3c7f0.arP8jLW0d%2FV7x6NiLOzEgk5mZAreFPtgjLS8O7%2FYTcE; "
        "tid=eyJLSUQiOiIyIiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3ODY2NjM3OTQsImlhdCI6MTc4NjY2MDE5NCwic2Vzc2lvbl9kYXRhIjoiVXVJazZGYys0alA2ZHVMVHdiYWlqZmpzanZJUDYzTWpRa0IrK2R1eEplTEpMV2VzUFBjZmJyZDdweXBCVVJHRmVrTEZtLzJrdnFYNUtKQVhRWGFNQ0FjcXBjYUV2eGtRQitHVEc0Q0hBakNRNy8yWnhzSmFDb0RYMXBPTWFPVXpRMmJjNVpiY2tWdFlaYTcwZTBYY3FNMDI5cEJicFdicWhlclRzdVk0NktvZTJRTGtrREx1NWVsRTM5RXF4WkZvTXJtK2JySWNmNVBkSEs2eVpGKzZZUT09Iiwic2lkIjoidDFmMmNjMWJjZGEtNDI0Yy00Y2Y2LTg3ZTctYTdlYmJhY2U2Iiwic3ViIjoiZGIyZDM3ZmUtMzU4Yi00N2Q0LWE2MzgtOWU0NDFkOWFmZWY3IiwidXNlcl9pZCI6IjAifQ.q-BKT6NlYAd4Gd9VVgke18UxkS-CtNQaERl8wZc8oL8; "
        "versionCode=1200; platform=web; subplatform=dweb; "
        "aws-waf-token=51d6fe6f-1ca9-46a8-9717-d71135f4b33e:BQoAp2WdsawQAAAA:2KEt35IM0krEGR87OTK9UPUVAjURXIRjzv5PcypNrHWLRnpGBvSWPcFD0Qn2L2kXE+TmLeIw/Sh86QJmeFZmSYgsHIBjO1B6SHZ7Ko/zM47RKa9Qs30gLmYmnGm8eQtjwzTKgKC/Dx6sY1mbm7XsgMSFJoOxZ9vCmPXK6bClBTSmsGQz+ww5YJGsIqE42cZIaXYnZRDq0MYLvTVG3+hC+XxHAgwg3Yv5dhOOA1Kgf2hXNLd0lEY+IdFHBJZuTpRCLbA="
    )
}

def test_single_request():
    test_pincode = "400001"
    url = f"https://instamart.in/api/instamart/maps/suggestions?input={test_pincode}"
    
    print("==================================================")
    print(f"[*] Testing GET request for Pincode: {test_pincode}")
    print(f"[*] Target URL: {url}")
    print("==================================================\n")
    
    try:
        session = requests.Session(impersonate="chrome124")
        response = session.get(url, headers=HEADERS, timeout=15)
        
        print(f"[+] HTTP Status Code: {response.status_code}")
        print("---------------- Raw Response Body ----------------")
        print(response.text)
        print("---------------------------------------------------\n")
        
        # Try JSON parsing
        try:
            data = response.json()
            print("[+] Parsed JSON Structure:")
            print(json.dumps(data, indent=2))
        except Exception:
            print("[-] Response is NOT JSON (likely HTML / WAF block page).")
            
    except Exception as err:
        print(f"[-] Request failed with exception: {err}")

if __name__ == "__main__":
    test_single_request()