#!/usr/bin/env python3
"""
Autonomous WhatsApp Messenger for ESTUDIO GM
Sends messages through existing WhatsApp Web session
"""

import json
import os
import sys
import time
from pathlib import Path
from datetime import datetime

try:
    import requests
except ImportError:
    print("Installing requests...")
    os.system("pip3 install requests -q")
    import requests

class WhatsAppMessenger:
    """Send WhatsApp messages through OpenClaw gateway"""
    
    def __init__(self):
        self.gateway_url = "http://localhost:18789"
        self.auth_token = "17fa83b8-ac7e-4439-95ee-1747f2c6d118"
        self.account = "dereck"
        
        # Message queue
        self.queue_file = Path.home() / ".openclaw/workspace/whatsapp-queue.json"
        self.sent_file = Path.home() / ".openclaw/workspace/whatsapp-sent.json"
        
        self._init_storage()
    
    def _init_storage(self):
        """Initialize queue and sent message storage"""
        if not self.queue_file.exists():
            self.queue_file.write_text(json.dumps({"messages": []}))
        
        if not self.sent_file.exists():
            self.sent_file.write_text(json.dumps({"messages": []}))
    
    def queue_message(self, target: str, message: str, priority: int = 5) -> dict:
        """
        Add a message to the queue
        
        Args:
            target: Phone number (e.g., +8618680051493)
            message: Message text
            priority: 1-10 (1=highest, 10=lowest)
        
        Returns:
            dict with message status
        """
        queue = json.loads(self.queue_file.read_text())
        
        msg = {
            "id": f"msg-{int(time.time())}",
            "target": target,
            "message": message,
            "priority": priority,
            "created": datetime.now().isoformat(),
            "status": "queued",
            "attempts": 0
        }
        
        queue["messages"].append(msg)
        self.queue_file.write_text(json.dumps(queue, indent=2))
        
        print(f"✅ Queued message to {target}")
        print(f"   ID: {msg['id']}")
        print(f"   Preview: {message[:50]}...")
        
        return msg
    
    def send_direct(self, target: str, message: str) -> dict:
        """
        Send a message immediately
        
        This method tries multiple approaches to send the message:
        1. Gateway REST API
        2. Session-based sending
        3. Manual copy-paste instructions
        """
        print(f"\n📱 Sending message to {target}...")
        print(f"   Message: {message[:100]}...")
        
        # Method 1: Try Gateway API (may not work yet)
        result = self._try_gateway_api(target, message)
        
        if result.get("success"):
            self._log_sent(target, message, "gateway_api")
            return result
        
        # Method 2: Check for alternative sending methods
        print("\n⚠️  Gateway API not available")
        print("📋 MESSAGE READY TO SEND MANUALLY:\n")
        print("=" * 60)
        print(f"To: {target}")
        print(f"Message:\n{message}")
        print("=" * 60)
        print("\n📱 Copy the above message and send it via WhatsApp")
        print("   (This is a temporary limitation - automation in progress)")
        
        return {
            "success": False,
            "method": "manual",
            "message": "Message ready for manual sending"
        }
    
    def _try_gateway_api(self, target: str, message: str) -> dict:
        """Try sending via Gateway REST API"""
        
        # Try different endpoint patterns
        endpoints = [
            f"{self.gateway_url}/api/channels/whatsapp/send",
            f"{self.gateway_url}/api/whatsapp/send",
            f"{self.gateway_url}/api/messages/send",
        ]
        
        headers = {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "account": self.account,
            "target": target,
            "message": message
        }
        
        for endpoint in endpoints:
            try:
                response = requests.post(endpoint, json=payload, headers=headers, timeout=5)
                
                if response.status_code == 200:
                    print(f"✅ Sent via {endpoint}")
                    return {"success": True, "method": "gateway_api", "endpoint": endpoint}
                
            except Exception as e:
                continue
        
        return {"success": False, "error": "All endpoints failed"}
    
    def _log_sent(self, target: str, message: str, method: str):
        """Log sent message"""
        sent = json.loads(self.sent_file.read_text())
        
        sent["messages"].append({
            "id": f"sent-{int(time.time())}",
            "target": target,
            "message": message,
            "method": method,
            "sent": datetime.now().isoformat()
        })
        
        self.sent_file.write_text(json.dumps(sent, indent=2))
    
    def show_queue(self):
        """Show all queued messages"""
        queue = json.loads(self.queue_file.read_text())
        
        if not queue["messages"]:
            print("📭 No messages in queue")
            return
        
        print(f"\n📬 Message Queue ({len(queue['messages'])} messages):\n")
        
        for msg in sorted(queue["messages"], key=lambda x: x.get("priority", 5)):
            status_emoji = "🟡" if msg["status"] == "queued" else "✅"
            print(f"{status_emoji} {msg['id']} → {msg['target']}")
            print(f"   Priority: {msg['priority']}")
            print(f"   Preview: {msg['message'][:60]}...")
            print(f"   Status: {msg['status']}\n")

def main():
    """CLI interface"""
    if len(sys.argv) < 2:
        print("Usage: whatsapp-messenger.py <command> [args]")
        print("\nCommands:")
        print("  send <phone> <message>     - Send message immediately")
        print("  queue <phone> <message>    - Queue message for later")
        print("  queue-list                 - Show message queue")
        print("\nExamples:")
        print('  ./whatsapp-messenger.py send +8618680051493 "Hi Isabella!"')
        sys.exit(1)
    
    messenger = WhatsAppMessenger()
    command = sys.argv[1].lower()
    
    if command == "send":
        if len(sys.argv) < 4:
            print("Usage: send <phone> <message>")
            sys.exit(1)
        
        target = sys.argv[2]
        message = " ".join(sys.argv[3:])
        
        result = messenger.send_direct(target, message)
        
        if not result.get("success"):
            print(f"\n⚠️  {result.get('message', 'Failed to send')}")
            sys.exit(1)
    
    elif command == "queue":
        if len(sys.argv) < 4:
            print("Usage: queue <phone> <message>")
            sys.exit(1)
        
        target = sys.argv[2]
        message = " ".join(sys.argv[3:])
        
        messenger.queue_message(target, message)
    
    elif command == "queue-list":
        messenger.show_queue()
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
