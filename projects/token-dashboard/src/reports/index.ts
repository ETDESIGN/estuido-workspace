/**
 * Token Tracking Dashboard - Report Generator
 * Generate daily, weekly, and monthly reports
 */

import { getDailyStats, getRangeStats } from '../db/index.js';
import { DailyStats } from '../types.js';

export interface ReportOptions {
  format?: 'text' | 'json' | 'csv';
  includeModels?: boolean;
}

/**
 * Generate a daily report
 */
export function generateDailyReport(date: string, options: ReportOptions = {}): string {
  const stats = getDailyStats(date);
  
  if (!stats) {
    return `No data found for ${date}`;
  }
  
  if (options.format === 'json') {
    return JSON.stringify(stats, null, 2);
  }
  
  if (options.format === 'csv') {
    return generateCSV([stats]);
  }
  
  return generateTextReport(stats);
}

/**
 * Generate a weekly report (last 7 days from given date)
 */
export function generateWeeklyReport(endDate: string, options: ReportOptions = {}): string {
  const end = new Date(endDate);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  
  const startStr = start.toISOString().split('T')[0];
  const stats = getRangeStats(startStr, endDate);
  
  if (stats.length === 0) {
    return `No data found for week ending ${endDate}`;
  }
  
  if (options.format === 'json') {
    return JSON.stringify(stats, null, 2);
  }
  
  if (options.format === 'csv') {
    return generateCSV(stats);
  }
  
  return generateWeeklyTextReport(stats, startStr, endDate);
}

/**
 * Generate text format report for a single day
 */
function generateTextReport(stats: DailyStats): string {
  const lines: string[] = [];
  
  lines.push('═'.repeat(50));
  lines.push(`  📊 DAILY TOKEN REPORT — ${stats.date}`);
  lines.push('═'.repeat(50));
  lines.push('');
  lines.push(`  💰 Total Cost:        $${stats.totalCost.toFixed(4)}`);
  lines.push(`  📝 Total Sessions:    ${stats.totalSessions}`);
  lines.push(`  ⬇️  Input Tokens:      ${formatTokens(stats.totalInputTokens)}`);
  lines.push(`  ⬆️  Output Tokens:     ${formatTokens(stats.totalOutputTokens)}`);
  lines.push(`  📦 Total Tokens:      ${formatTokens(stats.totalInputTokens + stats.totalOutputTokens)}`);
  
  if (stats.totalCacheReadTokens > 0) {
    lines.push(`  💾 Cache Read:        ${formatTokens(stats.totalCacheReadTokens)}`);
  }
  if (stats.totalCacheWriteTokens > 0) {
    lines.push(`  📝 Cache Write:       ${formatTokens(stats.totalCacheWriteTokens)}`);
  }
  
  lines.push('');
  lines.push('  📈 Model Breakdown:');
  lines.push('  ' + '─'.repeat(40));
  
  for (const [model, modelStats] of Object.entries(stats.modelBreakdown)) {
    const pct = ((modelStats.cost / stats.totalCost) * 100).toFixed(1);
    lines.push(`  • ${model.padEnd(25)} $${modelStats.cost.toFixed(4)} (${pct}%)`);
  }
  
  lines.push('');
  lines.push('═'.repeat(50));
  
  return lines.join('\n');
}

/**
 * Generate text format report for a week
 */
function generateWeeklyTextReport(stats: DailyStats[], startDate: string, endDate: string): string {
  const lines: string[] = [];
  
  const totalCost = stats.reduce((sum, s) => sum + s.totalCost, 0);
  const totalSessions = stats.reduce((sum, s) => sum + s.totalSessions, 0);
  const totalInput = stats.reduce((sum, s) => sum + s.totalInputTokens, 0);
  const totalOutput = stats.reduce((sum, s) => sum + s.totalOutputTokens, 0);
  
  lines.push('═'.repeat(60));
  lines.push(`  📊 WEEKLY TOKEN REPORT — ${startDate} to ${endDate}`);
  lines.push('═'.repeat(60));
  lines.push('');
  lines.push(`  💰 Weekly Total Cost: $${totalCost.toFixed(4)}`);
  lines.push(`  📝 Total Sessions:    ${totalSessions}`);
  lines.push(`  ⬇️  Input Tokens:      ${formatTokens(totalInput)}`);
  lines.push(`  ⬆️  Output Tokens:     ${formatTokens(totalOutput)}`);
  lines.push(`  📦 Total Tokens:      ${formatTokens(totalInput + totalOutput)}`);
  lines.push('');
  lines.push('  📅 Daily Breakdown:');
  lines.push('  ' + '─'.repeat(45));
  lines.push(`  ${'Date'.padEnd(12)} ${'Sessions'.padEnd(10)} ${'Cost'.padEnd(12)}`);
  lines.push('  ' + '─'.repeat(45));
  
  for (const day of stats) {
    lines.push(`  ${day.date.padEnd(12)} ${String(day.totalSessions).padEnd(10)} $${day.totalCost.toFixed(4).padEnd(10)}`);
  }
  
  lines.push('');
  lines.push('═'.repeat(60));
  
  return lines.join('\n');
}

/**
 * Generate CSV format
 */
function generateCSV(stats: DailyStats[]): string {
  const lines: string[] = [];
  lines.push('date,total_sessions,total_input_tokens,total_output_tokens,total_cost');
  
  for (const s of stats) {
    lines.push(`${s.date},${s.totalSessions},${s.totalInputTokens},${s.totalOutputTokens},${s.totalCost}`);
  }
  
  return lines.join('\n');
}

/**
 * Format token count for display
 */
function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * Get today's date string
 */
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}
