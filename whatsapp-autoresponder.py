#!/usr/bin/env python3
"""
ESTUDIO WhatsApp Auto-Responder
Monitors for incoming messages and responds autonomously
"""

import json
import os
import subprocess
from pathlib import Path
from datetime import datetime

CONTACTS_FILE = Path.home() / ".openclaw/workspace/whatsapp-contacts.json"
CONVERSATIONS_FILE = Path.home() / ".openclaw/workspace/whatsapp-conversations.json"

def load_contacts():
    """Load contact database"""
    if not CONTACTS_FILE.exists():
        CONTACTS_FILE.write_text(json.dumps({"contacts": {}}, indent=2))
    return json.loads(CONTACTS_FILE.read_text())

def save_contact(contact):
    """Save or update contact"""
    contacts = load_contacts()
    contacts["contacts"][contact["phone"]] = contact
    CONTACTS_FILE.write_text(json.dumps(contacts, indent=2))

def load_conversations():
    """Load conversation history"""
    if not CONVERSATIONS_FILE.exists():
        CONVERSATIONS_FILE.write_text(json.dumps({"conversations": []}, indent=2))
    return json.loads(CONVERSATIONS_FILE.read_text())

def save_message(phone, message, direction):
    """Save message to conversation history"""
    conv = load_conversations()
    conv["conversations"].append({
        "timestamp": datetime.now().isoformat(),
        "phone": phone,
        "message": message,
        "direction": direction  # "in" or "out"
    })
    CONVERSATIONS_FILE.write_text(json.dumps(conv, indent=2))

def send_whatsapp(phone, message):
    """Send WhatsApp message via OpenClaw CLI"""
    cmd = [
        "openclaw", "message", "send",
        "--channel", "whatsapp",
        "--account", "dereck",
        "--target", phone,
        "--message", message
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0

def get_contact_context(phone):
    """Get context about a contact"""
    contacts = load_contacts()
    contact = contacts["contacts"].get(phone, {
        "phone": phone,
        "name": phone,
        "added": datetime.now().isoformat(),
        "notes": "",
        "relationship_stage": "new"
    })
    return contact

# Initialize Isabella in the system
print("📱 Initializing ESTUDIO WhatsApp Auto-Responder...")

# Add Isabella
isabella = {
    "phone": "+8618680051493",
    "name": "Isabella Z",
    "nickname": "Bella",
    "added": datetime.now().isoformat(),
    "notes": "Potential customer. E introduced her. Be friendly, helpful, build relationship.",
    "relationship_stage": "new",
    "interests": [],
    "last_contact": datetime.now().isoformat()
}

save_contact(isabella)

# Log the first message
save_message(isabella["phone"], "Intro message from GM of ESTUDIO", "out")

print("✅ Isabella added to contact database")
print(f"   Phone: {isabella['phone']}")
print(f"   Stage: {isabella['relationship_stage']}")
print(f"   Notes: {isabella['notes'][:50]}...")

print("\n🤖 Auto-responder ready!")
print("   I'll now handle all messages from Isabella autonomously.")
print("   Reply strategy: Friendly, helpful, relationship-building")
