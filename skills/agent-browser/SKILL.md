---
name: agent-browser
description: Browser automation for OpenClaw agents using the browser tool
author: ESTUDIO
version: 1.0.0
---

# Agent Browser Skill

Enables agents to control the browser via OpenClaw's built-in browser tool.

## Prerequisites

- Chrome/Chromium installed
- OpenClaw browser extension installed and attached to a tab

## Available Actions

### Navigate
```javascript
// Navigate to URL
browser({
  action: "navigate",
  targetUrl: "https://example.com",
  profile: "chrome"
})
```

### Snapshot
```javascript
// Get page structure
browser({
  action: "snapshot",
  profile: "chrome"
})
```

### Click
```javascript
// Click element by ref
browser({
  action: "act",
  profile: "chrome",
  request: {
    kind: "click",
    ref: "e123"
  }
})
```

### Type/Fill
```javascript
// Type text into input
browser({
  action: "act",
  profile: "chrome",
  request: {
    kind: "type",
    ref: "e456",
    text: "Hello World"
  }
})
```

### Screenshot
```javascript
// Take screenshot
browser({
  action: "screenshot",
  profile: "chrome",
  fullPage: true
})
```

### Evaluate JavaScript
```javascript
// Run JS in page context
browser({
  action: "act",
  profile: "chrome",
  request: {
    kind: "evaluate",
    fn: "() => document.title"
  }
})
```

## Common Patterns

### Download an Image
1. Navigate to page
2. Snapshot to find image ref
3. Right-click or click to get image URL
4. Use exec(curl) to download

### Fill a Form
1. Navigate to form page
2. Snapshot to find input refs
3. Type into each field
4. Click submit button

### Scrape Data
1. Navigate to target page
2. Use evaluate to extract data
3. Return structured JSON

## Best Practices

- Always check snapshot first to understand page structure
- Use fullPage screenshots for documentation
- Handle errors - pages may load slowly
- Respect robots.txt and rate limits
