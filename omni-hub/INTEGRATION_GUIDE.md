# WhatsApp Router - Integration Guide

## Quick Start

1. **Setup**
   ```bash
   cd ~/.openclaw/workspace/omni-hub
   ./setup.sh
   ```

2. **Configure whitelist**
   ```bash
   nano config/whitelist.json
   # Add your phone number
   ```

3. **Test**
   ```bash
   ./whatsapp-router.py "+YOUR_NUMBER" "Hello from WhatsApp Router!"
   ```

## OpenClaw Gateway Integration

### Step 1: Create Gateway Binding

Add this to your OpenClaw config (`~/.openclaw/openclaw.json`):

```json
{
  "bindings": [
    {
      "agentId": "omni-hub",
      "match": {
        "channel": "whatsapp",
        "peer": {
          "kind": "dm"
        }
      },
      "actions": {
        "webhook": {
          "url": "file:///home/e/.openclaw/workspace/omni-hub/whatsapp-router.py"
        }
      }
    }
  ]
}
```

### Step 2: Create Webhook Server (Optional)

If you need HTTP webhooks instead of direct CLI calls:

```python
#!/usr/bin/env python3
"""
Simple webhook server for WhatsApp Router
Listen for HTTP POST requests and route to whatsapp-router.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import subprocess
import sys

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/whatsapp/webhook':
            try:
                # Read request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data)
                
                # Extract message data
                phone_number = data.get('from', '')
                message = data.get('message', '')
                media_type = data.get('media_type')
                media_path = data.get('media_path')
                
                # Build command
                cmd = [
                    sys.executable,
                    '/home/e/.openclaw/workspace/omni-hub/whatsapp-router.py',
                    phone_number,
                    message
                ]
                
                if media_type:
                    cmd.extend(['--type', media_type])
                if media_path:
                    cmd.extend(['--media', media_path])
                
                # Execute router
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                # Send response
                self.send_response(200 if result.returncode == 0 else 500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(result.stdout.encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_response = json.dumps({
                    'status': 'error',
                    'message': str(e)
                })
                self.wfile.write(error_response.encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8080), WebhookHandler)
    print("Webhook server listening on http://localhost:8080")
    print("Endpoint: http://localhost:8080/whatsapp/webhook")
    server.serve_forever()
```

### Step 3: Systemd Service (Optional)

Create `/etc/systemd/system/whatsapp-router.service`:

```ini
[Unit]
Description=WhatsApp Router for Omni-Hub
After=network.target

[Service]
Type=simple
User=e
WorkingDirectory=/home/e/.openclaw/workspace/omni-hub
ExecStart=/usr/bin/python3 webhook-server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable whatsapp-router
sudo systemctl start whatsapp-router
sudo systemctl status whatsapp-router
```

## WhatsApp Business API Integration

If using WhatsApp Business API:

### Setup

1. Install `whatsapp-business-python-sdk`:
   ```bash
   pip install whatsapp-business-python-sdk
   ```

2. Configure webhook in Meta for Developers:
   - Webhook URL: `https://your-domain.com/whatsapp/webhook`
   - Verify token: (generate a secure token)
   - Subscribe to: messages, messages.status

### Example Integration

```python
from whatsapp_business import WhatsAppBusinessAPI

# Initialize API
api = WhatsAppBusinessAPI(
    phone_number_id="YOUR_PHONE_NUMBER_ID",
    access_token="YOUR_ACCESS_TOKEN"
)

# Send message
api.send_message(
    to="+1234567890",
    message="Hello from Omni-Hub!"
)
```

## Direct OpenClaw Sessions Integration

Instead of HTTP webhooks, you can route directly to OpenClaw sessions:

```python
def route_to_openclaw_session(phone_number, message, agent_id):
    """Route message to OpenClaw session directly."""
    try:
        # Use clawteam CLI to send to session
        result = subprocess.run(
            ['clawteam', 'inbox', 'send', 'omni-hub', agent_id, message],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            return {
                'status': 'success',
                'agent': agent_id,
                'message': 'Routed to session'
            }
        else:
            return {
                'status': 'error',
                'message': result.stderr
            }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }
```

## Monitoring and Logs

### View Live Logs

```bash
tail -f ~/.openclaw/workspace/omni-hub/logs/whatsapp-router-$(date +%Y%m%d).log
```

### Check Memory

```bash
cat ~/.openclaw/workspace/omni-hub/memory/messages.json | jq
```

### Search with qmd

```bash
# Add memory to qmd collection
qmd collection add omni-hub-memory ~/.openclaw/workspace/omni-hub/memory

# Search memories
qmd query "project deadline"
```

## Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
pip3 install --user -r requirements.txt
```

### Issue: "Permission denied"

**Solution:**
```bash
chmod +x whatsapp-router.py
chmod +x setup.sh
chmod +x test-router.sh
```

### Issue: "Config file not found"

**Solution:**
```bash
mkdir -p ~/.openclaw/workspace/omni-hub/config
# Re-run setup or manually create whitelist.json
```

### Issue: "qmd command not found"

**Solution:**
```bash
# Install qmd
cargo install qmd-search

# Or download binary
wget https://github.com/grahamwpuk/qmd/releases/latest/download/qmd-linux
chmod +x qmd-linux
sudo mv qmd-linux /usr/local/bin/qmd
```

### Issue: Messages not routing to agents

**Check:**
1. Agent ID exists in OpenClaw config
2. Agent workspace directory exists
3. Permissions are correct
4. Check logs for errors

## Security Best Practices

1. **Never commit whitelist.json to version control**
   - Add to `.gitignore`:
     ```
     config/whitelist.json
     memory/messages.json
     logs/
     ```

2. **Use environment variables for sensitive data**
   ```bash
   export OPENAI_API_KEY="sk-..."
   export WHATSAPP_ACCESS_TOKEN="..."
   ```

3. **Regular security audits**
   ```bash
   # Review blocked numbers
   cat config/whitelist.json | jq '.blocked_numbers'
   
   # Review access logs
   grep "Blocked access" logs/whatsapp-router-*.log
   ```

4. **Rate limiting (optional)**
   - Implement in webhook server
   - Use Redis for distributed rate limiting

## Performance Optimization

1. **Async processing**
   - Use Celery for background tasks
   - Queue transcription jobs

2. **Caching**
   - Cache whitelist in memory
   - Cache qmd search results

3. **Monitoring**
   - Track message volume
   - Monitor transcription latency
   - Alert on errors

## Advanced Features

### Custom Command Handlers

```python
class CustomCommandHandler:
    def handle_command(self, command, phone_number, message):
        if command == "status":
            return self.get_status(phone_number)
        elif command == "help":
            return self.show_help(phone_number)
        # Add custom commands here
```

### Multi-language Support

```python
def detect_language(message):
    from langdetect import detect
    try:
        return detect(message)
    except:
        return "en"

def route_by_language(phone_number, message, language):
    agent_map = {
        "en": "english-agent",
        "es": "spanish-agent",
        "zh": "chinese-agent"
    }
    return agent_map.get(language, "default-agent")
```

### Voice Note Enhancement

```python
def enhance_transcription(transcript, phone_number):
    """Add punctuation, formatting to raw transcript."""
    # Use LLM to clean up transcript
    # Add speaker identification
    # Extract action items
    pass
```

## Support

For issues or questions:
1. Check logs: `~/.openclaw/workspace/omni-hub/logs/`
2. Run tests: `./test-router.sh`
3. Review README.md
4. Contact system administrator

## Changelog

### v1.0.0 (2026-03-25)
- Initial release
- Caller-ID bouncer
- Audio transcription
- qmd integration
- Message routing
- Security controls
