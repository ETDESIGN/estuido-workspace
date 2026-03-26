#!/usr/bin/env python3
"""
Send WhatsApp messages through the gateway
"""

import json
import sys
import os
from pathlib import Path

def send_whatsapp(target: str, message: str) -> bool:
    """Send a WhatsApp message through the OpenClaw gateway"""

    # Import requests for HTTP call
    try:
        import requests
    except ImportError:
        print("Installing requests...")
        os.system("pip3 install requests -q")
        import requests

    gateway_url = "http://localhost:18789/api/channels/whatsapp/send"

    payload = {
        "target": target,
        "message": message
    }

    headers = {
        "Authorization": "Bearer 17fa83b8-ac7e-4439-95ee-1747f2c6d118",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(gateway_url, json=payload, headers=headers, timeout=10)

        if response.status_code == 200:
            result = response.json()
            print(f"✅ Message sent successfully!")
            print(f"   Target: {target}")
            print(f"   Message: {message[:50]}...")
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error sending message: {e}")
        return False

def main():
    if len(sys.argv) < 3:
        print("Usage: send-whatsapp.py <target_number> <message>")
        print("Example: send-whatsapp.py +8618680051493 'Hello Isabella!'")
        sys.exit(1)

    target = sys.argv[1]
    message = " ".join(sys.argv[2:])

    print(f"📱 Sending WhatsApp message...")
    print(f"   To: {target}")
    print(f"   Message: {message}")

    success = send_whatsapp(target, message)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
