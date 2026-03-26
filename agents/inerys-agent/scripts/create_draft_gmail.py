#!/usr/bin/env python3
"""
create_draft_gmail.py - Create Gmail draft using API
Uses gog's stored credentials via gcloud/credential helper
"""

import subprocess
import json
import base64
from email.mime.text import MIMEText
import sys

def create_draft(to, subject, body):
    """Create a draft in Gmail using API"""

    # Create email message
    message = MIMEText(body, 'plain')
    message['To'] = to
    message['Subject'] = subject

    # Encode to base64 URL-safe
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

    # Try to use gog's stored credentials
    # gog stores credentials in system keyring, need to use gog command
    try:
        # For now, save as .eml file that can be imported
        import os
        from datetime import datetime

        draft_dir = os.path.expanduser("~/.openclaw/workspace/agents/inerys-agent/drafts")
        os.makedirs(draft_dir, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_to = to.replace("@", "_").replace("/", "_")
        filename = f"{timestamp}_{safe_to}.eml"
        filepath = os.path.join(draft_dir, filename)

        with open(filepath, 'w') as f:
            f.write(f"To: {to}\n")
            f.write(f"Subject: {subject}\n")
            f.write(f"Content-Type: text/plain; charset=UTF-8\n")
            f.write("\n")
            f.write(body)

        print(f"✅ Draft saved: {filepath}")
        print("")
        print("📧 To import to Gmail:")
        print("  1. Open Gmail")
        print("  2. Click ⼈⋮ More → Import mail")
        print(f"  3. Select: {filepath}")
        print("  4. Review, edit, and send")
        print("")

        return filepath

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 create_draft_gmail.py <to> <subject> <body>")
        sys.exit(1)

    to = sys.argv[1]
    subject = sys.argv[2]
    body = sys.argv[3]

    create_draft(to, subject, body)
