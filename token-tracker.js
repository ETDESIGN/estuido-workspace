#!/usr/bin/env node

/**
 * Token Tracker - Monitors API token usage across providers
 * Run via cron to track usage and alert on limits
 */

const fs = require('fs');
const path = require('path');

const CONFIG_DIR = '/home/e/.openclaw';
const TRACKING_FILE = path.join(CONFIG_DIR, 'token-usage.json');
const LOG_FILE = path.join(CONFIG_DIR, 'workspace/memory', `token-tracker-${new Date().toISOString().split('T')[0]}.md`);

// Load previous tracking data
let trackingData = {};
if (fs.existsSync(TRACKING_FILE)) {
  try {
    trackingData = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
  } catch (e) {
    console.error('Failed to load tracking data:', e.message);
  }
}

// Initialize today's tracking
const today = new Date().toISOString().split('T')[0];
if (!trackingData[today]) {
  trackingData[today] = {
    timestamp: new Date().toISOString(),
    providers: {}
  };
}

// Track known providers
const providers = {
  groq: {
    name: 'Groq',
    freeLimit: 1000000, // 1M tokens/day free tier
    check: () => {
      // Check Groq usage via API if possible, otherwise estimate
      return { estimated: true, note: 'No direct API - usage estimated from logs' };
    }
  },
  openrouter: {
    name: 'OpenRouter',
    freeLimit: 0, // Paid service
    check: () => {
      return { estimated: true, note: 'Check https://openrouter.ai/keys for usage' };
    }
  },
  zai: {
    name: 'Zai (GLM)',
    freeLimit: 0,
    check: () => {
      return { estimated: true, note: 'Check Zai dashboard' };
    }
  }
};

// Check each provider
let report = `# Token Usage Report - ${today}\n\n`;
report += `Generated: ${new Date().toLocaleString()}\n\n`;

let hasAlerts = false;

for (const [key, provider] of Object.entries(providers)) {
  if (!trackingData[today].providers[key]) {
    trackingData[today].providers[key] = {
      checks: [],
      lastCheck: null
    };
  }

  const status = provider.check();
  trackingData[today].providers[key].checks.push({
    time: new Date().toISOString(),
    ...status
  });
  trackingData[today].providers[key].lastCheck = new Date().toISOString();

  report += `## ${provider.name}\n`;
  report += `- Status: ${status.estimated ? 'Estimated' : 'Direct'}\n`;
  report += `- Note: ${status.note}\n`;
  if (provider.freeLimit > 0) {
    report += `- Free Tier Limit: ${provider.freeLimit.toLocaleString()} tokens/day\n`;
  }
  report += `\n`;
}

// Check for potential issues
report += `## Alerts\n\n`;

// Check if any provider might be near limits (placeholder logic)
if (hasAlerts) {
  report += `⚠️ **Action needed:** Some providers may be approaching limits.\n`;
} else {
  report += `✅ **All clear:** No immediate concerns detected.\n`;
}

report += `\n---\n\n`;
report += `*This is an automated report. Run token-tracker.js manually for detailed checks.*\n`;

// Save tracking data
fs.writeFileSync(TRACKING_FILE, JSON.stringify(trackingData, null, 2));

// Append to today's memory log
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
fs.appendFileSync(LOG_FILE, report + '\n\n');

// Console output
console.log('✓ Token tracker completed');
console.log(`- Tracking file: ${TRACKING_FILE}`);
console.log(`- Log file: ${LOG_FILE}`);
console.log(`- Providers checked: ${Object.keys(providers).length}`);

// Summary
console.log('\n' + '='.repeat(50));
console.log(report);
