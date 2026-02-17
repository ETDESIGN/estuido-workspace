---
name: FS Watcher
slug: fs-watcher
version: 1.0.0
description: Monitor filesystem changes and trigger actions when files are created, modified, or deleted in specified folders.
---

## When to Use

- Watch a folder for new files and process them automatically
- Trigger agents or scripts when specific file types appear
- Build automated pipelines (e.g., new file → process → move)

## Usage

```bash
# Watch a folder for new files
fs-watch --path /path/to/folder --event add --agent cto --task "process-file"

# Watch for modifications
fs-watch --path /data --event change --run "npm run build"

# Watch for deletions
fs-watch --path /temp --event unlink --notify
```

## Events

| Event | Trigger |
|-------|--------|
| `add` | File created |
| `change` | File modified |
| `unlink` | File deleted |
| `addDir` | Directory created |
| `unlinkDir` | Directory deleted |

## Actions

- `--agent <id>` — Spawn an agent with a task
- `--run <cmd>` — Run a shell command
- `--notify` — Send a notification

## Examples

```yaml
# Watch for new images, run OCR agent
- path: /uploads/images
  event: add
  pattern: "*.{jpg,png}"
  agent: cto
  task: "OCR process TASK.md"

# Watch config changes, restart service
- path: /config
  event: change
  pattern: "*.json"
  run: "pm2 restart api"
```