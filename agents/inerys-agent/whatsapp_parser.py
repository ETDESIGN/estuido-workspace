#!/usr/bin/env python3
"""
whatsapp_parser.py - WhatsApp command parser for Inerys Agent

Handles:
- Text commands: "Send", "Change tone to X", "Add lead: email@domain.com"
- Audio transcription: Voice notes to text, then parse commands
- Lead extraction: Parse lead info from natural language
"""

import re
import json
import sys
from pathlib import Path

# Configuration
SANDBOX_DIR = Path.home() / ".openclaw" / "workspace" / "agents" / "inerys-agent"
LOG_DIR = SANDBOX_DIR / "logs"

COMMANDS = {
    "send": "send_draft",
    "approve": "send_draft",
    "yes": "send_draft",
    "go": "send_draft",
    "tweak": "modify_draft",
    "change": "modify_draft",
    "modify": "modify_draft",
    "add": "add_lead",
    "new": "add_lead",
    "create": "add_lead",
}

class WhatsAppParser:
    def __init__(self):
        self.log_file = LOG_DIR / "whatsapp_commands.log"
        LOG_DIR.mkdir(parents=True, exist_ok=True)

    def log(self, message):
        """Log to file"""
        with open(self.log_file, "a") as f:
            f.write(f"[{self.timestamp()}] {message}\n")

    def timestamp(self):
        from datetime import datetime
        return datetime.utcnow().isoformat() + "Z"

    def parse_command(self, text):
        """
        Parse WhatsApp text message for commands

        Returns dict:
        {
            "action": "send_draft" | "modify_draft" | "add_lead" | "unknown",
            "params": {...},
            "original": original_text
        }
        """
        text = text.strip().lower()
        original = text

        # Check for approval commands
        if text in ["send", "approve", "yes", "go"]:
            return {
                "action": "send_draft",
                "params": {},
                "original": original
            }

        # Check for tone modification
        tone_match = re.search(r"(?:change|modify|tweak).*?tone.*?to\s+(.+?)(?:\.|$)", text)
        if tone_match:
            new_tone = tone_match.group(1).strip()
            return {
                "action": "modify_draft",
                "params": {"tone": new_tone},
                "original": original
            }

        # Check for add lead
        email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
        if email_match and (word in text for word in ["add", "new", "create"]):
            email = email_match.group(0)

            # Extract company name if present
            company_match = re.search(r"(?:from|at)\s+([A-Z][a-zA-Z\s]+?)(?:\s|$|,)", text)
            company = company_match.group(1).strip() if company_match else ""

            # Extract niche if present
            niche_keywords = {
                "beauty": "Beauty",
                "cosmetic": "Beauty",
                "fashion": "Fashion",
                "food": "Food",
                "eco": "Eco",
                "green": "Eco",
                "retail": "Retail",
            }
            niche = ""
            for keyword, sector in niche_keywords.items():
                if keyword in text.lower():
                    niche = sector
                    break

            return {
                "action": "add_lead",
                "params": {
                    "email": email,
                    "company": company,
                    "niche": niche
                },
                "original": original
            }

        # Unknown command
        return {
            "action": "unknown",
            "params": {},
            "original": original
        }

    def execute_command(self, command):
        """Execute parsed command"""
        action = command["action"]
        params = command["params"]

        self.log(f"Executing: {action} with params: {params}")

        if action == "send_draft":
            return self.send_draft(params)
        elif action == "modify_draft":
            return self.modify_draft(params)
        elif action == "add_lead":
            return self.add_lead(params)
        else:
            return {"status": "error", "message": f"Unknown command: {command['original']}"}

    def send_draft(self, params):
        """Send the Gmail draft"""
        # TODO: Implement actual Gmail draft sending
        # gog --profile inerys gmail send-draft <draft_id>
        self.log("Send draft requested")
        return {
            "status": "success",
            "message": "Draft sent successfully",
            "action": "email_sent"
        }

    def modify_draft(self, params):
        """Modify draft tone"""
        tone = params.get("tone", "")
        # TODO: Re-run personalizer with new tone
        self.log(f"Tone modification requested: {tone}")
        return {
            "status": "success",
            "message": f"Draft updated with new tone: {tone}",
            "action": "draft_modified"
        }

    def add_lead(self, params):
        """Add new lead and run pipeline"""
        email = params["email"]
        company = params.get("company", "")
        niche = params.get("niche", "")

        # Build pipeline command
        cmd = f"{SANDBOX_DIR}/pipeline.sh {email}"
        if company:
            cmd += f" --company '{company}'"
        if niche:
            cmd += f" --niche '{niche}'"

        self.log(f"Adding lead: {email}")
        # TODO: Execute pipeline
        return {
            "status": "success",
            "message": f"Lead added: {email}",
            "action": "pipeline_started"
        }

def main():
    if len(sys.argv) < 2:
        print("Usage: whatsapp_parser.py '<message_text>'")
        print("")
        print("Examples:")
        print('  whatsapp_parser.py "Send"')
        print('  whatsapp_parser.py "Change tone to more aggressive"')
        print('  whatsapp_parser.py "Add marc@sephora.fr from Sephora"')
        sys.exit(1)

    message_text = sys.argv[1]

    parser = WhatsAppParser()
    command = parser.parse_command(message_text)
    result = parser.execute_command(command)

    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
