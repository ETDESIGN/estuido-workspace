#!/usr/bin/env node

/**
 * FS Watcher - Monitor filesystem and trigger actions
 * 
 * Usage:
 *   node fs-watcher.js --path /folder --event add --agent cto --task "do work"
 *   node fs-watcher.js --path /folder --event change --run "npm run build"
 *   node fs-watcher.js --config triggers.json
 */

const chokidar = require('chokidar');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Default config location
const CONFIG_PATH = path.join(__dirname, 'triggers.json');

class FSWatcher {
  constructor() {
    this.watchers = new Map();
    this.triggers = [];
  }

  /**
   * Load triggers from config file
   */
  loadConfig(configPath = CONFIG_PATH) {
    if (!fs.existsSync(configPath)) {
      console.error(`Config not found: ${configPath}`);
      process.exit(1);
    }
    
    const content = fs.readFileSync(configPath, 'utf-8');
    const data = JSON.parse(content);
    this.triggers = data.triggers || data;
    console.log(`Loaded ${this.triggers.length} trigger(s)`);
  }

  /**
   * Parse CLI args into a single trigger
   */
  parseArgs() {
    const args = process.argv.slice(2);
    const trigger = {
      path: null,
      event: 'add',
      pattern: '**/*',
      agent: null,
      task: null,
      run: null,
      notify: false
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const next = args[i + 1];

      switch (arg) {
        case '--path':
        case '-p':
          trigger.path = next;
          i++;
          break;
        case '--event':
        case '-e':
          trigger.event = next;
          i++;
          break;
        case '--pattern':
          trigger.pattern = next;
          i++;
          break;
        case '--agent':
        case '-a':
          trigger.agent = next;
          i++;
          break;
        case '--task':
        case '-t':
          trigger.task = next;
          i++;
          break;
        case '--run':
        case '-r':
          trigger.run = next;
          i++;
          break;
        case '--notify':
        case '-n':
          trigger.notify = true;
          break;
        case '--config':
        case '-c':
          this.loadConfig(next);
          return null;
        case '--help':
        case '-h':
          this.showHelp();
          process.exit(0);
      }
    }

    if (!trigger.path) {
      console.error('Error: --path is required');
      this.showHelp();
      process.exit(1);
    }

    return trigger;
  }

  showHelp() {
    console.log(`
FS Watcher - Monitor filesystem and trigger actions

Usage:
  fs-watcher [options]

Options:
  -p, --path <path>       Folder to watch (required for CLI mode)
  -e, --event <event>     Event: add, change, unlink, addDir, unlinkDir (default: add)
  --pattern <glob>        File pattern to match (default: **/*)
  -a, --agent <id>        Agent ID to spawn
  -t, --task <task>       Task prompt for agent
  -r, --run <cmd>         Shell command to run
  -n, --notify            Send notification
  -c, --config <file>     Load triggers from JSON config

Events:
  add       - File created
  change    - File modified  
  unlink    - File deleted
  addDir    - Directory created
  unlinkDir - Directory deleted

Examples:
  fs-watcher -p /uploads -e add --agent cto --task "process file"
  fs-watcher -p /config -e change --run "pm2 restart all"
  fs-watcher -c triggers.json
`);
  }

  /**
   * Start watching a trigger
   */
  watch(trigger) {
    const { path: watchPath, event, pattern, agent, task, run, notify } = trigger;

    // Validate path exists
    if (!fs.existsSync(watchPath)) {
      console.error(`Path does not exist: ${watchPath}`);
      return;
    }

    console.log(`Watching ${watchPath} for ${event} events...`);

    const watcher = chokidar.watch(watchPath, {
      persistent: true,
      ignoreInitial: true,
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
      }
    });

    const handleEvent = (eventType, filePath) => {
      // Check if event matches
      if (eventType !== event) return;

      // Check pattern match
      const fileName = path.basename(filePath);
      if (!this.matchPattern(fileName, pattern)) return;

      console.log(`\n[${eventType}] ${filePath}`);

      // Run shell command
      if (run) {
        this.runCommand(run, filePath);
      }

      // Notify via Discord (fs-watcher can't spawn directly)
      if (agent && task) {
        console.log(`🤖 Would spawn agent: ${agent}`);
        console.log(`   Task: ${task} ${filePath}`);
        // Discord notify instead
        this.notify(filePath);
      } else {
        console.log(`No agent/task configured`);
      }

      // Notify (via message tool)
      if (notify) {
        console.log(`📢 Calling sendNotification...`);
        this.sendNotification(eventType, filePath);
      } else {
        console.log(`Notify flag is: ${notify}`);
      }
    };

    watcher
      .on('add', (filePath) => handleEvent('add', filePath))
      .on('change', (filePath) => handleEvent('change', filePath))
      .on('unlink', (filePath) => handleEvent('unlink', filePath))
      .on('addDir', (filePath) => handleEvent('addDir', filePath))
      .on('unlinkDir', (filePath) => handleEvent('unlinkDir', filePath))
      .on('error', (error) => console.error(`Watcher error: ${error}`));

    this.watchers.set(watchPath, watcher);
  }

  /**
   * Match file against glob pattern (simple version)
   */
  matchPattern(fileName, pattern) {
    if (pattern === '**/*' || pattern === '*') return true;
    
    // Simple glob matching
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    );
    return regex.test(fileName);
  }

  /**
   * Run shell command
   */
  runCommand(cmd, filePath) {
    console.log(`Running: ${cmd}`);
    const proc = spawn(cmd, { shell: true });
    
    proc.stdout.on('data', (data) => console.log(data.toString().trim()));
    proc.stderr.on('data', (data) => console.error(data.toString().trim()));
    
    proc.on('close', (code) => {
      console.log(`Command exited with code ${code}`);
    });
  }

  /**
   * Notify via Discord - send message to channel
   */
  notify(filePath, trigger) {
    const channelMap = {
      '20_GROWTH': '1473477201599926273',  // Growth
      '10_ENGINEERING': '1473477068892410091', // Engineering
      '30_STRATEGY': '1473477201599926273' // Strategy (use Growth for now)
    };
    
    let channelId = null;
    for (const [dir, ch] of Object.entries(channelMap)) {
      if (filePath.includes(dir)) {
        channelId = ch;
        break;
      }
    }
    
    if (!channelId) {
      console.log(`No channel mapping for: ${filePath}`);
      return;
    }
    
    const fileName = filePath.split('/').pop();
    const msg = `📄 New file detected: ${fileName}`;
    
    const { exec } = require('child_process');
    const cmd = `openclaw message send --channel discord --target ${channelId} --message "${msg}"`;
    
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Notify failed: ${err.message}`);
        return;
      }
      console.log(`✅ Notified channel ${channelId}: ${msg}`);
    });
  }

  /**
   * Send notification to Discord
   */
  sendNotification(event, filePath) {
    console.log(`📢 sendNotification called with event=${event}, filePath=${filePath}`);
    
    const channelMap = {
      '20_GROWTH': '1473477201599926273',  // Growth
      '10_ENGINEERING': '1473477068892410091', // Engineering
      '30_STRATEGY': '1473477201599926273' // Strategy
    };
    
    let channelId = null;
    for (const [dir, ch] of Object.entries(channelMap)) {
      if (filePath.includes(dir)) {
        channelId = ch;
        break;
      }
    }
    
    console.log(`📢 Channel lookup: filePath=${filePath}, channelId=${channelId}`);
    
    if (!channelId) {
      console.log(`No channel mapping for: ${filePath}`);
      return;
    }
    
    const fileName = filePath.split('/').pop();
    const msg = `📄 New file detected: ${fileName}`;
    
    const { exec } = require('child_process');
    const cmd = `openclaw message send --channel discord --target ${channelId} --message "${msg}"`;
    console.log(`📢 Running: ${cmd}`);
    
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Notify failed: ${err.message}`);
        console.error(`   stderr: ${stderr}`);
        return;
      }
      console.log(`✅ Notified channel ${channelId}: ${msg}`);
      if (stdout) console.log(`   stdout: ${stdout.trim()}`);
    });
  }

  /**
   * Start all watchers
   */
  start() {
    // Load from config or CLI
    const trigger = this.parseArgs();
    
    if (trigger) {
      this.triggers = [trigger];
    }

    if (this.triggers.length === 0) {
      console.log('No triggers configured');
      return;
    }

    // Start each trigger
    for (const t of this.triggers) {
      this.watch(t);
    }

    console.log('FS Watcher started. Press Ctrl+C to stop.');
  }

  /**
   * Stop all watchers
   */
  stop() {
    for (const [watchPath, watcher] of this.watchers) {
      console.log(`Stopping watcher: ${watchPath}`);
      watcher.close();
    }
    this.watchers.clear();
  }
}

// Export for use as module
module.exports = FSWatcher;

// CLI
if (require.main === module) {
  const watcher = new FSWatcher();
  
  process.on('SIGINT', () => {
    console.log('\nStopping watchers...');
    watcher.stop();
    process.exit(0);
  });

  watcher.start();
}
