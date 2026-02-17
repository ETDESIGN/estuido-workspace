#!/usr/bin/env node
/**
 * Token Tracking Dashboard - Main CLI
 * ESTUDIO Phase 1 - Basic Token Tracking
 */

import { Command } from 'commander';
import { getDb, initSchema } from './db/index.js';
import { insertSession, getDailyStats } from './db/index.js';
import { createSession, parseLogLine } from './parser/index.js';
import { calculateCost } from './parser/cost.js';
import { checkAlerts, getPendingAlerts, formatAlert, ackAlert } from './alerts/index.js';
import { generateDailyReport, generateWeeklyReport, getToday } from './reports/index.js';
import { readFileSync, existsSync } from 'fs';
import { randomUUID } from 'crypto';

const program = new Command();

program
  .name('token-dashboard')
  .description('ESTUDIO Token Tracking Dashboard - Track OpenClaw API costs')
  .version('1.0.0');

// Init command - Initialize database
program
  .command('init')
  .description('Initialize the token tracking database')
  .action(() => {
    console.log('🔧 Initializing Token Tracking Dashboard...');
    initSchema();
    console.log('✅ Database ready!');
  });

// Track command - Log a new session manually
program
  .command('track')
  .description('Manually log a token session')
  .requiredOption('-m, --model <model>', 'Model name (e.g., moonshot/kimi-k2.5)')
  .requiredOption('-i, --input <tokens>', 'Input tokens', parseInt)
  .requiredOption('-o, --output <tokens>', 'Output tokens', parseInt)
  .option('-c, --cache-read <tokens>', 'Cache read tokens', parseInt, 0)
  .option('-w, --cache-write <tokens>', 'Cache write tokens', parseInt, 0)
  .option('-d, --duration <seconds>', 'Session duration', parseInt)
  .option('--cost <amount>', 'Override calculated cost')
  .action((options) => {
    const cost = options.cost !== undefined 
      ? parseFloat(options.cost)
      : calculateCost(options.model, options.input, options.output, options.cacheRead, options.cacheWrite);
    
    const session = createSession({
      model: options.model,
      inputTokens: options.input,
      outputTokens: options.output,
      cacheReadTokens: options.cacheRead,
      cacheWriteTokens: options.cacheWrite,
      duration: options.duration,
    });
    
    // Override cost if provided
    if (options.cost !== undefined) {
      session.cost = parseFloat(options.cost);
    }
    
    insertSession(session);
    
    console.log('✅ Session logged:');
    console.log(`   Model:   ${session.model}`);
    console.log(`   Input:   ${session.inputTokens.toLocaleString()} tokens`);
    console.log(`   Output:  ${session.outputTokens.toLocaleString()} tokens`);
    console.log(`   Cost:    $${session.cost.toFixed(4)}`);
  });

// Import command - Import from log file
program
  .command('import')
  .description('Import sessions from a log file (JSON lines or CSV)')
  .argument('<file>', 'Path to log file')
  .action((filePath) => {
    if (!existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      process.exit(1);
    }
    
    console.log(`📂 Importing from ${filePath}...`);
    
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    
    let imported = 0;
    let failed = 0;
    
    for (const line of lines) {
      const session = parseLogLine(line);
      if (session) {
        insertSession(session);
        imported++;
      } else {
        failed++;
      }
    }
    
    console.log(`✅ Imported ${imported} sessions`);
    if (failed > 0) {
      console.log(`⚠️  Failed to parse ${failed} lines`);
    }
  });

// Report command - Generate reports
program
  .command('report')
  .description('Generate daily or weekly reports')
  .option('-d, --date <date>', 'Date (YYYY-MM-DD)', getToday())
  .option('-w, --week', 'Show weekly report ending on date')
  .option('-f, --format <format>', 'Output format: text, json, csv', 'text')
  .action((options) => {
    if (options.week) {
      console.log(generateWeeklyReport(options.date, { format: options.format }));
    } else {
      console.log(generateDailyReport(options.date, { format: options.format }));
    }
  });

// Status command - Quick overview
program
  .command('status')
  .description('Show current spending status')
  .action(() => {
    const today = getToday();
    const stats = getDailyStats(today);
    
    console.log('📊 Token Dashboard Status');
    console.log('═'.repeat(40));
    console.log('');
    
    if (stats) {
      console.log(`Today (${today}):`);
      console.log(`  Sessions: ${stats.totalSessions}`);
      console.log(`  Tokens:   ${(stats.totalInputTokens + stats.totalOutputTokens).toLocaleString()}`);
      console.log(`  Cost:     $${stats.totalCost.toFixed(4)}`);
    } else {
      console.log(`Today (${today}): No data yet`);
    }
    
    console.log('');
    
    // Check for alerts
    const pending = getPendingAlerts();
    if (pending.length > 0) {
      console.log('🚨 Pending Alerts:');
      for (const alert of pending.slice(0, 5)) {
        console.log(formatAlert(alert));
        console.log('');
      }
    } else {
      console.log('✅ No pending alerts');
    }
  });

// Alert command - Check and acknowledge alerts
program
  .command('alerts')
  .description('Check and manage alerts')
  .option('-c, --check', 'Check for new alerts')
  .option('-a, --acknowledge <id>', 'Acknowledge alert by ID')
  .option('-l, --list', 'List all pending alerts')
  .action((options) => {
    if (options.check) {
      const result = checkAlerts();
      if (result.triggered) {
        console.log('🚨 Alerts triggered:');
        for (const alert of result.alerts) {
          console.log(formatAlert(alert));
        }
      } else {
        console.log('✅ No alerts - spending within limits');
      }
    } else if (options.acknowledge) {
      ackAlert(options.acknowledge);
      console.log(`✅ Alert ${options.acknowledge} acknowledged`);
    } else if (options.list) {
      const pending = getPendingAlerts();
      if (pending.length === 0) {
        console.log('✅ No pending alerts');
      } else {
        console.log(`📋 ${pending.length} Pending Alert(s):`);
        for (const alert of pending) {
          console.log('');
          console.log(formatAlert(alert));
          console.log(`   ID: ${alert.id}`);
        }
      }
    } else {
      // Default: show status
      const pending = getPendingAlerts();
      console.log(`${pending.length} pending alert(s)`);
    }
  });

// Pricing command - Show model pricing
import { listPricing } from './parser/cost.js';

program
  .command('pricing')
  .description('Show model pricing table')
  .action(() => {
    const pricing = listPricing();
    
    console.log('💰 Model Pricing (per 1M tokens)');
    console.log('═'.repeat(70));
    console.log(`${'Model'.padEnd(35)} ${'Input'.padEnd(12)} ${'Output'.padEnd(12)}`);
    console.log('─'.repeat(70));
    
    for (const p of pricing) {
      const input = p.inputCostPer1M === 0 ? 'FREE' : `$${p.inputCostPer1M.toFixed(2)}`;
      const output = p.outputCostPer1M === 0 ? 'FREE' : `$${p.outputCostPer1M.toFixed(2)}`;
      console.log(`${p.model.padEnd(35)} ${input.padEnd(12)} ${output.padEnd(12)}`);
    }
  });

// Parse command - Test log parsing
program
  .command('parse')
  .description('Test parsing a log line')
  .argument('<line>', 'Log line to parse')
  .action((line) => {
    const session = parseLogLine(line);
    if (session) {
      console.log('✅ Parsed successfully:');
      console.log(JSON.stringify(session, null, 2));
    } else {
      console.log('❌ Failed to parse line');
    }
  });

// Run
program.parse();
