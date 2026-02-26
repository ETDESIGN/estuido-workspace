#!/usr/bin/env node

/**
 * Twitter Thread Generator Handler
 * 
 * Called by fs-watcher when new .md files are added to CONTENT_DRAFTS
 * Spawns the Growth agent to generate Twitter threads
 * 
 * Usage: node twitter-thread-handler.js <path-to-draft-file>
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONTENT_DRAFTS_PATH = '/home/e/nb-studio/20_GROWTH/CONTENT_DRAFTS';
const SOCIAL_QUEUE_PATH = '/home/e/nb-studio/20_GROWTH/SOCIAL_QUEUE';
const DISCORD_CHANNEL = '1473477201599926273'; // Growth channel

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

async function sendDiscordNotification(fileName, threadPath) {
  return new Promise((resolve, reject) => {
    const msg = `🐦 New Twitter thread generated from **${fileName}**\n📁 Ready for review: ${threadPath}`;
    const cmd = `openclaw message send --channel discord --target ${DISCORD_CHANNEL} --message "${msg}"`;
    
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        log(`❌ Discord notify failed: ${err.message}`);
        reject(err);
        return;
      }
      log(`✅ Discord notification sent`);
      resolve(stdout);
    });
  });
}

async function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('Usage: node twitter-thread-handler.js <path-to-draft-file>');
    process.exit(1);
  }
  
  // Validate file exists and is in CONTENT_DRAFTS
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  
  if (!filePath.startsWith(CONTENT_DRAFTS_PATH)) {
    console.error(`File not in CONTENT_DRAFTS: ${filePath}`);
    process.exit(1);
  }
  
  // Only process .md files
  if (!filePath.endsWith('.md')) {
    log(`Skipping non-markdown file: ${filePath}`);
    process.exit(0);
  }
  
  const fileName = path.basename(filePath);
  log(`📝 Processing content draft: ${fileName}`);
  
  // Read the content
  const content = fs.readFileSync(filePath, 'utf-8');
  log(`📄 Content length: ${content.length} chars`);
  
  // Generate timestamp for filename
  const timestamp = new Date().toISOString().split('T')[0];
  const baseName = fileName.replace('.md', '');
  const threadFileName = `${baseName}-thread-${timestamp}.md`;
  const threadPath = path.join(SOCIAL_QUEUE_PATH, threadFileName);
  
  // Generate the Twitter thread
  log(`🤖 Generating Twitter thread...`);
  
  const thread = await generateTwitterThread(content, filePath, fileName);
  
  // Save to SOCIAL_QUEUE
  fs.writeFileSync(threadPath, thread, 'utf-8');
  log(`✅ Thread saved to: ${threadPath}`);
  
  // Send Discord notification
  log(`📢 Sending Discord notification...`);
  try {
    await sendDiscordNotification(fileName, threadPath);
  } catch (err) {
    log(`⚠️ Notification failed but thread was saved`);
  }
  
  log(`🎉 Done! Thread ready for review.`);
}

async function generateTwitterThread(content, sourcePath, fileName) {
  const now = new Date().toISOString();
  const title = extractTitle(content) || fileName.replace('.md', '');
  
  // Simple extraction of key points
  const keyPoints = extractKeyPoints(content);
  
  // Generate tweets from key points
  const tweets = createTweetsFromPoints(keyPoints, title);
  
  return `# Twitter Thread: ${title}

Source: ${sourcePath}
Generated: ${now}
Status: PENDING_REVIEW

---

🧵 ${tweets.length} tweets about ${title}

${tweets.map((tweet, i) => `${i + 1}/ ${tweet}`).join('\n\n')}

---

## Notes for Reviewer
- Key hook: ${tweets[0]?.substring(0, 50)}...
- Target audience: Tech-savvy builders, founders, developers
- Suggested timing: Weekday mornings (9-11 AM EST) for max engagement
- Hashtags included: #buildinpublic #indiehacker (adjust as needed)

## Action Items
- [ ] Review and edit tweets
- [ ] Add relevant hashtags
- [ ] Schedule or post manually
- [ ] Mark as POSTED when done
`;
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : null;
}

function extractKeyPoints(content) {
  const lines = content.split('\n');
  const points = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Capture bullet points, numbered lists, headers, and bold text
    if (trimmed.match(/^[-*•]\s+(.+)/) || 
        trimmed.match(/^\d+\.\s+(.+)/) ||
        trimmed.match(/^#{1,3}\s+(.+)/) ||
        trimmed.match(/\*\*(.+?)\*/)) {
      const clean = trimmed
        .replace(/^[-*•]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/^#{1,3}\s+/, '')
        .replace(/\*\*/g, '');
      if (clean.length > 20 && clean.length < 200) {
        points.push(clean);
      }
    }
  }
  
  // If no structured points, use paragraphs
  if (points.length === 0) {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    points.push(...paragraphs.slice(0, 4));
  }
  
  return points.slice(0, 5);
}

function createTweetsFromPoints(points, title) {
  const tweets = [];
  
  // Tweet 1: Hook
  const hook = points[0] ? `The one thing nobody tells you about ${title.toLowerCase()}: ${points[0].substring(0, 100)}` 
                         : `Thread on ${title} 🧵`;
  tweets.push(truncate(hook, 280));
  
  // Tweet 2-4: Key points
  for (let i = 1; i < Math.min(points.length, 4); i++) {
    const tweet = points[i].substring(0, 270);
    tweets.push(truncate(tweet, 280));
  }
  
  // Tweet 5: CTA (if we have enough content)
  if (points.length >= 3) {
    tweets.push(`What do you think? Drop your thoughts below 👇\n\nFollow for more threads on building and growth.`);
  }
  
  return tweets.filter(t => t.length > 10);
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

const { exec } = require('child_process');

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
