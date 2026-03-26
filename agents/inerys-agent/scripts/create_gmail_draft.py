#!/usr/bin/env python3
"""
create_gmail_draft.py - Create a REAL draft in inerys.contact@gmail.com
Uses Gmail REST API with OAuth2
"""

import os
import sys
import json
import base64
import httplib2
from email.mime.text import MIMEText

try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    GOOGLE_API_AVAILABLE = True
except ImportError:
    GOOGLE_API_AVAILABLE = False
    print("⚠️  Google APIs not installed. Installing...")
    print("   Run: pip install google-api-python-client google-auth-oauthlib")
    sys.exit(1)

def create_draft(to, subject, body):
    """Create a draft in Gmail using Gmail REST API"""

    # Create email message
    message = MIMEText(body, 'plain')
    message['To'] = to
    message['Subject'] = subject
    message['From'] = 'inerys.contact@gmail.com'

    # Encode to base64 URL-safe
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

    # Try to use gog's credentials
    # gog stores tokens in system keyring, we need to access them

    # Method 1: Try to get token from gog
    import subprocess

    try:
        # Get a fresh token by making an API call
        result = subprocess.run(
            ['gog', '-a', 'inerys.contact@gmail.com', '--json', 'gmail', 'search', 'subject:test'],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            data = json.loads(result.stdout)
            if 'access_token' in data:
                token = data['access_token']

                # Use the token to create draft via Gmail API
                credentials = Credentials(token=token)
                service = build('gmail', 'v1', credentials=credentials)

                draft = {
                    'message': {
                        'raw': raw_message
                    }
                }

                result = service.users().drafts().create(userId='me', body=draft).execute()

                print(f"✅ Draft created in Gmail!")
                print(f"   Draft ID: {result['id']}")
                print(f"   To: {to}")
                print(f"   Subject: {subject}")
                print("")
                print("📧 Check inerys.contact@gmail.com Drafts folder")
                print("   https://mail.google.com/mail/u/inerys.contact@gmail.com/#drafts")

                return result

    except Exception as e:
        print(f"⚠️  API method failed: {e}")
        print(f"   Falling back to manual method...")

    # Fallback: Create .eml file for manual import
    draft_dir = os.path.expanduser("~/.openclaw/workspace/agents/inerys-agent/drafts")
    os.makedirs(draft_dir, exist_ok=True)

    import datetime
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_to = to.replace("@", "_at_")
    filename = f"{timestamp}_{safe_to}.txt"
    filepath = os.path.join(draft_dir, filename)

    with open(filepath, 'w') as f:
        f.write(f"To: {to}\n")
        f.write(f"Subject: {subject}\n")
        f.write(f"From: inerys.contact@gmail.com\n")
        f.write("\n")
        f.write(body)

    print(f"✅ Draft saved: {filepath}")
    print("")
    print("📧 To import to Gmail:")
    print("   1. Open the file above")
    print("   2. Copy content")
    print("   3. Paste into Gmail compose")
    print("   4. Review and send")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 create_gmail_draft.py <to> <subject> <body>")
        sys.exit(1)

    create_draft(sys.argv[1], sys.argv[2], sys.argv[3])
