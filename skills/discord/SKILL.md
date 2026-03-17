# Discord

Discord ops via the message tool (channel=discord).

## Configuration
- **Bot Token:** Set in `~/.openclaw/openclaw.json` under `discord.token`
- **Enabled Channels:** Configure routing in `openclaw.json` `routes` section

## Usage
- Messages from Discord automatically route to the agent based on channel/peer matching
- Use `sessions_send` for cross-session messaging
- Replies route automatically back to Discord

## Troubleshooting
- Check logs: `tail -100 /tmp/openclaw/openclaw-*.log | grep -i discord`
- Verify bot token is valid
- Check routing rules in openclaw.json
