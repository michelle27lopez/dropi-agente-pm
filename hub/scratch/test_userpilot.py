import os
import requests
import json

API_KEY = "692d64b9e344913f"
API_BASE_URL = "https://appex.userpilot.io"

headers = {
    "Authorization": f"Token {API_KEY}",
    "Content-Type": "application/json"
}

def test_connection():
    # Attempting to fetch jobs
    url = f"{API_BASE_URL}/api/v1/analytics/exports/jobs"
    print(f"GET {url}")
    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        try:
            print("Response:", json.dumps(response.json(), indent=2))
        except:
            print("Response Text:", response.text)
    except Exception as e:
        print("Error:", e)

    # Let's also try the alternative URL format (without /api)
    url_alt = f"{API_BASE_URL}/v1/analytics/exports/jobs"
    print(f"\nGET {url_alt}")
    try:
        response = requests.get(url_alt, headers=headers)
        print(f"Status: {response.status_code}")
        try:
            print("Response:", json.dumps(response.json(), indent=2))
        except:
            print("Response Text:", response.text)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_connection()
