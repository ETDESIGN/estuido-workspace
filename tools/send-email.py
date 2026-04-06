#!/usr/bin/env python3
"""
E-Studio Email Tool (dereck@oookea.com)
RESTRICTED: Can only send to approved recipients.
This is E-Studio's own inbox — reading is unrestricted, sending is restricted.
"""
import smtplib, ssl, sys, json, os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

SMTP_HOST = "mail.oookea.com"
SMTP_PORT = 2525
EMAIL = "dereck@oookea.com"
PASSWORD = "Remybrica-1"
DISPLAY_NAME = "Etia - E-Studio"

# APPROVED RECIPIENTS — only these addresses can receive email
# To add a new contact, Etia must approve it first
APPROVED_RECIPIENTS = [
    "etiawork@gmail.com",       # Etia (president)
]

def get_context():
    return ssl.create_default_context()

def check_approved(to_addr):
    """Verify recipient is in approved list. Returns True/False."""
    clean = to_addr.strip().lower()
    return any(clean == r.lower() for r in APPROVED_RECIPIENTS)

def send_email(to, subject, body, html=None, reply_to=None, attachments=None):
    if not check_approved(to):
        print(f"BLOCKED: {to} is not in approved recipient list.", file=sys.stderr)
        print(f"Approved recipients: {APPROVED_RECIPIENTS}", file=sys.stderr)
        return False
    
    msg = MIMEMultipart("alternative")
    msg["From"] = f"{DISPLAY_NAME} <{EMAIL}>"
    msg["To"] = to
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.attach(MIMEText(body, "plain", "utf-8"))
    if html:
        msg.attach(MIMEText(html, "html", "utf-8"))
    if attachments:
        for fp in attachments:
            if os.path.exists(fp):
                with open(fp, "rb") as f:
                    part = MIMEBase("application", "octet-stream")
                    part.set_payload(f.read())
                    encoders.encode_base64(part)
                    part.add_header("Content-Disposition", f"attachment; filename={os.path.basename(fp)}")
                    msg.attach(part)
    
    import os as _os
    for k in ['ALL_PROXY','all_proxy','HTTP_PROXY','http_proxy','HTTPS_PROXY','https_proxy']:
        _os.environ[k] = ''
    
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as server:
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, to, msg.as_string())
    return True

def send_bulk(emails_data):
    results = []
    import os as _os
    for k in ['ALL_PROXY','all_proxy','HTTP_PROXY','http_proxy','HTTPS_PROXY','https_proxy']:
        _os.environ[k] = ''
    
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as server:
        server.starttls()
        server.login(EMAIL, PASSWORD)
        for data in emails_data:
            to = data["to"]
            if not check_approved(to):
                results.append({"to": to, "status": "blocked", "error": "Not in approved recipients"})
                print(f"  BLOCKED {to} — not approved", file=sys.stderr)
                continue
            msg = MIMEMultipart("alternative")
            msg["From"] = f"{DISPLAY_NAME} <{EMAIL}>"
            msg["To"] = to
            msg["Subject"] = data["subject"]
            msg.attach(MIMEText(data["body"], "plain", "utf-8"))
            if data.get("html"):
                msg.attach(MIMEText(data["html"], "html", "utf-8"))
            try:
                server.sendmail(EMAIL, to, msg.as_string())
                results.append({"to": to, "status": "sent"})
                print(f"  OK {to}")
            except Exception as e:
                results.append({"to": to, "status": "failed", "error": str(e)})
                print(f"  FAIL {to}: {e}")
    return results

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        send_email("etiawork@gmail.com", "E-Studio Email System Test", "Email system working! - E-Studio")
        print("Test email sent to etiawork@gmail.com")
    elif sys.argv[1] == "approved":
        print(json.dumps(APPROVED_RECIPIENTS, indent=2))
    elif "--json" in sys.argv:
        idx = sys.argv.index("--json") + 1
        data = json.loads(sys.argv[idx])
        results = send_bulk(data)
        print(json.dumps(results, indent=2))
    elif len(sys.argv) >= 4:
        ok = send_email(sys.argv[1], sys.argv[2], sys.argv[3])
        if not ok:
            sys.exit(1)
    else:
        print("Usage:")
        print("  send-email.py test")
        print("  send-email.py approved          # list approved recipients")
        print("  send-email.py <to> <subject> <body>")
        print('  send-email.py --json \'[{"to":"...","subject":"...","body":"..."}]\'')
        print(f"\nAPPROVED RECIPIENTS: {APPROVED_RECIPIENTS}")
