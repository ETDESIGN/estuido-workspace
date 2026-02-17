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
    this.triggers = JSON.parse(content);
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

      // Spawn agent (via sessions_spawn in OpenClaw context)
      if (agent && task) {
        this.spawnAgent(agent, task, filePath);
      }

      // Notify (via message tool)
      if (notify) {
        this.sendNotification(eventType, filePath);
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
   * Spawn agent (placeholder - would use sessions_spawn in OpenClaw)
   */
  spawnAgent(agentId, task, filePath) {
    const fullTask = `${task} ${filePath}`;
    console.log(`Would spawn agent: ${agentId} with task: ${fullTask}`);
    // In OpenClaw, this would call sessions_spawn({ agentId, task: fullTask })
  }

  /**
   * Send notification
   */
  sendNotification(event, filePath) {
    console.log(`Would send notification: ${event} on ${filePath}`);
    // In OpenClaw, this would call message tool
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
