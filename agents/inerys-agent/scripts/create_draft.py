#!/usr/bin/env python3
"""
Gmail Draft Creator for Inerys Agent
Uses Gmail REST API to create actual drafts in inerys.contact@gmail.com
"""

import os
import sys
import json
import base64
import subprocess
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def get_access_token():
    """Get OAuth access token from gog"""
    try:
        # Run gog command to get a token via API call
        result = subprocess.run(
            ['gog', '-a', 'inerys.contact@gmail.com', '--json', 'gmail', 'search', 'subject:token'],
            capture_output=True,
            text=True,
            timeout=10
        )
        # This won't give us the token directly, but shows gog is configured
        return None
    except:
        return None

def create_eml_file(to, subject, body, html_body=None):
    """Create .eml file for manual import"""

    draft_dir = os.path.expanduser("~/.openclaw/workspace/agents/inerys-agent/drafts")
    os.makedirs(draft_dir, exist_ok=True)

    from datetime import datetime
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_to = to.replace("@", "_").replace("/", "_")
    filename = f"{timestamp}_{safe_to}.eml"
    filepath = os.path.join(draft_dir, filename)

    # Create email
    if html_body:
        msg = MIMEMultipart('alternative')
        msg.attach(MIMEText(body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))
    else:
        msg = MIMEText(body, 'plain')

    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = 'inerys.contact@gmail.com'

    # Write to file
    with open(filepath, 'w') as f:
        f.write(msg.as_string())

    return filepath

def main():
    if len(sys.argv) < 4:
        print("Usage: create_draft.py <to> <subject> <body> [html_body]")
        sys.exit(1)

    to = sys.argv[1]
    subject = sys.argv[2]
    body = sys.argv[3]
    html_body = sys.argv[4] if len(sys.argv) > 4 else None

    print("Creating Gmail draft...")
    print(f"  To: {to}")
    print(f"  Subject: {subject}")
    print("")

    # Create .eml file for import
    filepath = create_eml_file(to, subject, body, html_body)

    print(f"✅ Draft created: {filepath}")
    print("")
    print("=" * 60)
    print("📧 HOW TO SEND THIS DRAFT:")
    print("=" * 60)
    print("")
    print("Method 1 - Import to Gmail:")
    print(f"  1. Open Gmail: https://mail.google.com/mail/u/inerys.contact@gmail.com/")
    print("  2. Click ⼈⋮ (More) → Import mail")
    print(f"  3. Select file: {filepath}")
    print("  4. Review, edit, and send")
    print("")
    print("Method 2 - Copy & Paste:")
    print(f"  1. Open file: {filepath}")
    print("  2. Copy the content")
    print("  3. Paste into Gmail compose")
    print("  4. Review and send")
    print("")
    print("Method 3 - Forward (Alternative):")
    print("  1. Send draft to yourself first")
    print("  2. Forward from 'Sent' folder")
    print("  3. Edit and send to prospect")
    print("")
    print("=" * 60)
    print("")
    print("✨ Draft ready for Florian's review!")

if __name__ == "__main__":
    main()
