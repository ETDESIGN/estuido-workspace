#!/usr/bin/env python3
"""
WhatsApp Router for Omni-Hub Architecture
Implements Caller-ID Bouncer Protocol for security

Routes incoming WhatsApp messages to appropriate agent workspaces
based on phone number whitelisting and authorization levels.
"""

import json
import logging
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Paths
HOME = Path.home()
WORKSPACE = HOME / ".openclaw/workspace"
OMNIHUB_DIR = WORKSPACE / "omni-hub"
CONFIG_FILE = OMNIHUB_DIR / "whatsapp-router-config.json"
LOG_FILE = OMNIHUB_DIR / "whatsapp-router.log"

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class WhatsAppRouter:
    """Router for WhatsApp messages with Caller-ID security"""
    
    # Authorization levels
    AUTH_GOD_MODE = "god-mode"
    AUTH_SANDBOXED = "sandboxed"
    AUTH_BLOCKED = "blocked"
    
    def __init__(self, config_path: Path = CONFIG_FILE):
        self.config_path = config_path
        self.config = self._load_config()
        self.qmd_path = HOME / ".local/bin/qmd"
        
        logger.info("WhatsApp Router initialized")
        logger.info(f"Config file: {config_path}")
        logger.info(f"Trusted numbers: {len(self.config.get('trusted', {}))}")
        
    def _load_config(self) -> dict:
        """Load configuration from JSON file"""
        if not self.config_path.exists():
            logger.warning(f"Config not found, creating default: {self.config_path}")
            self._create_default_config()
        
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in config: {e}")
            return self._get_default_config_dict()
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            return self._get_default_config_dict()
    
    def _create_default_config(self):
        """Create default configuration file"""
        default_config = self._get_default_config_dict()
        with open(self.config_path, 'w') as f:
            json.dump(default_config, f, indent=2)
        logger.info(f"Created default config: {self.config_path}")
    
    def _get_default_config_dict(self) -> dict:
        """Get default configuration structure"""
        return {
            "version": "1.0",
            "lastUpdated": datetime.now().isoformat(),
            "whatsappAccounts": {
                "main": "+8618566570937"
            },
            "trusted": {
                "god_mode": {
                    "name": "E (God Mode)",
                    "phone": "",
                    "phone_normalized": "",
                    "agentAccess": "all",
                    "enabled": False,
                    "notes": "Full admin access to all agents and workspaces"
                }
            },
            "sandboxed": {},
            "blocked": [],
            "routing": {
                "defaultAgent": "main",
                "allowUnknown": False,
                "saveUnknownMessages": False
            },
            "features": {
                "transcriptionEnabled": True,
                "qmdIntegration": True,
                "autoSaveToMemory": False
            },
            "logLevel": "INFO"
        }
    
    def get_auth_level(self, phone_number: str) -> Tuple[str, Optional[dict]]:
        """
        Determine authorization level for a phone number
        
        Returns: (auth_level, user_config)
        """
        # Normalize phone number
        normalized = self._normalize_phone(phone_number)
        
        # Check god-mode first
        for user_id, user_config in self.config.get("trusted", {}).items():
            if user_config.get("enabled"):
                user_norm = self._normalize_phone(user_config.get("phone", ""))
                if user_norm == normalized:
                    if user_config.get("agentAccess") == "all":
                        logger.info(f"God-mode access: {normalized} -> {user_config.get('name')}")
                        return self.AUTH_GOD_MODE, user_config
        
        # Check sandboxed
        for user_id, user_config in self.config.get("sandboxed", {}).items():
            if user_config.get("enabled"):
                user_norm = self._normalize_phone(user_config.get("phone", ""))
                if user_norm == normalized:
                    logger.info(f"Sandboxed access: {normalized} -> {user_config.get('name')}")
                    return self.AUTH_SANDBOXED, user_config
        
        # Check blocked list
        blocked = self.config.get("blocked", [])
        if normalized in [self._normalize_phone(b) for b in blocked]:
            logger.warning(f"Blocked number: {normalized}")
            return self.AUTH_BLOCKED, None
        
        # Unknown number
        if self.config.get("routing", {}).get("allowUnknown", False):
            logger.info(f"Unknown number (allowed): {normalized}")
            return self.AUTH_SANDBOXED, {"name": "Unknown", "agentAccess": "default"}
        
        logger.warning(f"Unknown number (blocked): {normalized}")
        return self.AUTH_BLOCKED, None
    
    def _normalize_phone(self, phone: str) -> str:
        """Normalize phone number for comparison"""
        if not phone:
            return ""
        return phone.strip().replace(" ", "").replace("-", "").replace("+", "")
    
    def route_message(self, phone_number: str, message: str, message_type: str = "text", audio_path: Optional[str] = None) -> dict:
        """
        Route an incoming message to the appropriate agent
        
        Args:
            phone_number: Sender's phone number
            message: Message content (text)
            message_type: 'text' or 'audio'
            audio_path: Path to audio file if voice note
        
        Returns:
            dict with routing result: {
                'action': 'routed'|'blocked'|'error',
                'agent': 'agent-id',
                'workspace': 'path',
                'reason': 'explanation'
            }
        """
        result = {
            'timestamp': datetime.now().isoformat(),
            'phone': phone_number,
            'message_type': message_type,
            'action': 'error',
            'agent': None,
            'workspace': None,
            'reason': 'Unknown error'
        }
        
        try:
            # Get authorization level
            auth_level, user_config = self.get_auth_level(phone_number)
            
            if auth_level == self.AUTH_BLOCKED:
                result['action'] = 'blocked'
                result['reason'] = 'Number not authorized or explicitly blocked'
                logger.info(f"Blocked message from {phone_number}")
                return result
            
            # Handle voice notes
            if message_type == "audio" and audio_path:
                message = self._transcribe_audio(audio_path)
                if not message:
                    result['action'] = 'error'
                    result['reason'] = 'Audio transcription failed'
                    return result
                result['transcribed'] = True
            
            # Check for QMD commands
            if self._is_qmd_command(message):
                qmd_result = self._handle_qmd_command(message, phone_number, user_config)
                result['action'] = 'qmd_command'
                result.update(qmd_result)
                return result
            
            # Route to appropriate agent
            if auth_level == self.AUTH_GOD_MODE:
                # God mode: full access, can specify target agent
                target_agent = self._extract_target_agent(message)
                result['agent'] = target_agent or self.config.get('routing', {}).get('defaultAgent', 'main')
                result['workspace'] = self._get_workspace_for_agent(result['agent'])
                result['action'] = 'routed'
                result['reason'] = f'God-mode access to {result["agent"]}'
            
            elif auth_level == self.AUTH_SANDBOXED:
                # Sandboxed: only to assigned agent
                assigned_agent = user_config.get('agentAccess', 'default')
                result['agent'] = assigned_agent if assigned_agent != "default" else self.config.get('routing', {}).get('defaultAgent', 'main')
                result['workspace'] = self._get_workspace_for_agent(result['agent'])
                result['action'] = 'routed'
                result['reason'] = f'Sandboxed access to {result["agent"]}'
            
            logger.info(f"Routed message from {phone_number} -> {result['agent']} ({result['reason']})")
            
        except Exception as e:
            logger.error(f"Error routing message: {e}")
            result['action'] = 'error'
            result['reason'] = str(e)
        
        return result
    
    def _transcribe_audio(self, audio_path: str) -> Optional[str]:
        """Transcribe audio file using available STT"""
        try:
            # Check if we should use OpenAI Whisper or another service
            # For now, use a placeholder that can be extended
            
            # Check for ffmpeg audio conversion
            if not os.path.exists(audio_path):
                logger.error(f"Audio file not found: {audio_path}")
                return None
            
            # TODO: Implement actual transcription
            # Options: OpenAI Whisper API, local whisper model, or gog CLI
            
            logger.info(f"Audio transcription requested: {audio_path}")
            logger.warning("Transcription not yet implemented - returning placeholder")
            
            return "[Voice note - transcription pending implementation]"
            
        except Exception as e:
            logger.error(f"Transcription error: {e}")
            return None
    
    def _is_qmd_command(self, message: str) -> bool:
        """Check if message is a QMD memory command"""
        qmd_keywords = [
            "save to memory", "save this to memory",
            "remember", "store this",
            "search memory", "find in memory",
            "what do you remember", "recall"
        ]
        message_lower = message.lower().strip()
        return any(keyword in message_lower for keyword in qmd_keywords)
    
    def _handle_qmd_command(self, message: str, phone_number: str, user_config: dict) -> dict:
        """Handle QMD memory commands"""
        result = {
            'action': 'qmd_command',
            'command': None,
            'result': None
        }
        
        try:
            message_lower = message.lower()
            
            # Save to memory
            if "save" in message_lower or "remember" in message_lower:
                # Extract content after "save to memory:" etc.
                content = message
                for prefix in ["save to memory:", "save this to memory:", "remember:", "store this:"]:
                    if prefix in message_lower:
                        content = message[message_lower.index(prefix) + len(prefix):].strip()
                        break
                
                # Save to QMD
                collection = user_config.get("name", "default").replace(" ", "-").lower()
                qmd_result = self._qmd_save(content, collection, phone_number)
                
                result['command'] = 'save'
                result['result'] = qmd_result
                logger.info(f"QMD save: {collection} <- {content[:50]}...")
            
            # Search memory
            elif "search" in message_lower or "find" in message_lower or "recall" in message_lower:
                query = message
                for prefix in ["search memory for:", "find:", "recall:", "what do you remember about"]:
                    if prefix in message_lower:
                        query = message[message_lower.index(prefix) + len(prefix):].strip()
                        break
                
                qmd_result = self._qmd_search(query, phone_number)
                result['command'] = 'search'
                result['result'] = qmd_result
                logger.info(f"QMD search: {query[:50]}...")
        
        except Exception as e:
            logger.error(f"QMD command error: {e}")
            result['error'] = str(e)
        
        return result
    
    def _qmd_save(self, content: str, collection: str, phone_number: str) -> dict:
        """Save content to QMD memory"""
        try:
            # Create collection if needed
            collection_path = WORKSPACE / collection / "memory"
            subprocess.run(
                [str(self.qmd_path), "collection", "add", str(collection_path), "--name", collection],
                capture_output=True,
                timeout=30
            )
            
            # Create a memory file
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            memory_file = collection_path / f"whatsapp-{timestamp}.md"
            
            memory_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(memory_file, 'w') as f:
                f.write(f"# WhatsApp Memory Entry\n\n")
                f.write(f"**From:** {phone_number}\n")
                f.write(f"**When:** {datetime.now().isoformat()}\n")
                f.write(f"**Source:** WhatsApp\n\n")
                f.write(f"{content}\n")
            
            # Update QMD index
            subprocess.run(
                [str(self.qmd_path), "update"],
                capture_output=True,
                timeout=60
            )
            
            return {'status': 'saved', 'file': str(memory_file)}
            
        except Exception as e:
            logger.error(f"QMD save error: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def _qmd_search(self, query: str, phone_number: str) -> dict:
        """Search QMD memory"""
        try:
            result = subprocess.run(
                [str(self.qmd_path), "query", query],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            return {
                'status': 'success',
                'query': query,
                'results': result.stdout[:1000] if result.stdout else "No results"
            }
            
        except Exception as e:
            logger.error(f"QMD search error: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def _extract_target_agent(self, message: str) -> Optional[str]:
        """Extract target agent from message (god-mode feature)"""
        # Check for @agent mentions or "send to X" patterns
        # This is a simple implementation; can be extended
        if "@" in message:
            # Look for @agent-name pattern
            words = message.split()
            for word in words:
                if word.startswith("@"):
                    agent = word[1:].lower()
                    # Validate it's a known agent
                    if self._agent_exists(agent):
                        return agent
        return None
    
    def _agent_exists(self, agent_id: str) -> bool:
        """Check if an agent exists in the system"""
        agent_dir = HOME / f".openclaw/agents/{agent_id}"
        return agent_dir.exists() and (agent_dir / "agent").exists()
    
    def _get_workspace_for_agent(self, agent_id: str) -> Optional[str]:
        """Get workspace path for an agent"""
        # Try workspace-agent-id first, then fall back to workspace
        workspace_path = HOME / f".openclaw/workspace-{agent_id}"
        if workspace_path.exists():
            return str(workspace_path)
        
        workspace_path = HOME / ".openclaw/workspace"
        if workspace_path.exists():
            return str(workspace_path)
        
        return None
    
    def add_trusted_user(self, user_id: str, name: str, phone: str, agent_access: str = "default", god_mode: bool = False) -> bool:
        """Add a trusted user to the configuration"""
        try:
            if god_mode:
                section = "trusted"
                self.config["trusted"][user_id] = {
                    "name": name,
                    "phone": phone,
                    "phone_normalized": self._normalize_phone(phone),
                    "agentAccess": "all",
                    "enabled": True,
                    "added": datetime.now().isoformat(),
                    "notes": f"God-mode access added via router"
                }
            else:
                section = "sandboxed"
                self.config["sandboxed"][user_id] = {
                    "name": name,
                    "phone": phone,
                    "phone_normalized": self._normalize_phone(phone),
                    "agentAccess": agent_access,
                    "enabled": True,
                    "added": datetime.now().isoformat()
                }
            
            self._save_config()
            logger.info(f"Added trusted user: {name} ({phone}) -> {section}")
            return True
            
        except Exception as e:
            logger.error(f"Error adding trusted user: {e}")
            return False
    
    def remove_user(self, user_id: str) -> bool:
        """Remove a user from trusted or sandboxed lists"""
        try:
            removed = False
            if user_id in self.config.get("trusted", {}):
                del self.config["trusted"][user_id]
                removed = True
            
            if user_id in self.config.get("sandboxed", {}):
                del self.config["sandboxed"][user_id]
                removed = True
            
            if removed:
                self._save_config()
                logger.info(f"Removed user: {user_id}")
            
            return removed
            
        except Exception as e:
            logger.error(f"Error removing user: {e}")
            return False
    
    def block_number(self, phone: str) -> bool:
        """Add a phone number to the blocked list"""
        try:
            if "blocked" not in self.config:
                self.config["blocked"] = []
            
            normalized = self._normalize_phone(phone)
            if normalized not in [self._normalize_phone(b) for b in self.config["blocked"]]:
                self.config["blocked"].append(phone)
                self._save_config()
                logger.info(f"Blocked number: {phone}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error blocking number: {e}")
            return False
    
    def _save_config(self):
        """Save configuration to file"""
        self.config["lastUpdated"] = datetime.now().isoformat()
        with open(self.config_path, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def get_status(self) -> dict:
        """Get router status and statistics"""
        return {
            'version': self.config.get('version'),
            'lastUpdated': self.config.get('lastUpdated'),
            'trusted_count': len(self.config.get('trusted', {})),
            'sandboxed_count': len(self.config.get('sandboxed', {})),
            'blocked_count': len(self.config.get('blocked', [])),
            'log_file': str(LOG_FILE),
            'config_file': str(self.config_path)
        }


def main():
    """CLI interface for the WhatsApp router"""
    if len(sys.argv) < 2:
        print("Usage: whatsapp-router.py <command> [args]")
        print("\nCommands:")
        print("  route <phone> <message>          - Route a message")
        print("  add-trusted <id> <name> <phone>  - Add trusted user")
        print("  add-god <id> <name> <phone>      - Add god-mode user")
        print("  add-sandbox <id> <name> <phone> [agent] - Add sandboxed user")
        print("  remove <id>                      - Remove a user")
        print("  block <phone>                    - Block a number")
        print("  status                           - Show router status")
        sys.exit(1)
    
    router = WhatsAppRouter()
    command = sys.argv[1].lower()
    
    if command == "route":
        if len(sys.argv) < 4:
            print("Usage: route <phone> <message>")
            sys.exit(1)
        phone = sys.argv[2]
        message = " ".join(sys.argv[3:])
        result = router.route_message(phone, message)
        print(json.dumps(result, indent=2))
    
    elif command == "add-trusted" or command == "add-god":
        if len(sys.argv) < 5:
            print("Usage: add-trusted <id> <name> <phone>")
            sys.exit(1)
        router.add_trusted_user(sys.argv[2], sys.argv[3], sys.argv[4], god_mode=True)
        print(f"Added god-mode user: {sys.argv[3]}")
    
    elif command == "add-sandbox":
        if len(sys.argv) < 5:
            print("Usage: add-sandbox <id> <name> <phone> [agent]")
            sys.exit(1)
        agent = sys.argv[5] if len(sys.argv) > 5 else "default"
        router.add_trusted_user(sys.argv[2], sys.argv[3], sys.argv[4], agent, god_mode=False)
        print(f"Added sandboxed user: {sys.argv[3]} -> {agent}")
    
    elif command == "remove":
        if len(sys.argv) < 3:
            print("Usage: remove <user-id>")
            sys.exit(1)
        if router.remove_user(sys.argv[2]):
            print(f"Removed user: {sys.argv[2]}")
        else:
            print(f"User not found: {sys.argv[2]}")
    
    elif command == "block":
        if len(sys.argv) < 3:
            print("Usage: block <phone>")
            sys.exit(1)
        if router.block_number(sys.argv[2]):
            print(f"Blocked number: {sys.argv[2]}")
        else:
            print(f"Number already blocked or error: {sys.argv[2]}")
    
    elif command == "status":
        status = router.get_status()
        print(json.dumps(status, indent=2))
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
