/**
 * Token Tracking Dashboard - Database Layer
 * SQLite schema and operations
 */

import Database from 'better-sqlite3';
import { TokenSession, Alert, DailyStats } from '../types.js';
import { join } from 'path';

const DB_PATH = process.env.TOKEN_DB_PATH || join(process.cwd(), 'data', 'tokens.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema();
  }
  return db;
}

export function initSchema(): void {
  const database = getDb();
  
  // Sessions table - individual API calls
  database.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL UNIQUE,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      model TEXT NOT NULL,
      provider TEXT NOT NULL,
      input_tokens INTEGER DEFAULT 0,
      output_tokens INTEGER DEFAULT 0,
      cache_read_tokens INTEGER DEFAULT 0,
      cache_write_tokens INTEGER DEFAULT 0,
      cost REAL DEFAULT 0,
      duration INTEGER,
      status TEXT DEFAULT 'success'
    );
    
    CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date(timestamp));
    CREATE INDEX IF NOT EXISTS idx_sessions_model ON sessions(model);
  `);

  // Daily aggregates table
  database.exec(`
    CREATE TABLE IF NOT EXISTS daily_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      total_sessions INTEGER DEFAULT 0,
      total_input_tokens INTEGER DEFAULT 0,
      total_output_tokens INTEGER DEFAULT 0,
      total_cache_read_tokens INTEGER DEFAULT 0,
      total_cache_write_tokens INTEGER DEFAULT 0,
      total_cost REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Alerts table
  database.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_id TEXT NOT NULL UNIQUE,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      level TEXT NOT NULL,
      message TEXT NOT NULL,
      current_spend REAL NOT NULL,
      limit_amount REAL NOT NULL,
      acknowledged BOOLEAN DEFAULT 0
    );
    
    CREATE INDEX IF NOT EXISTS idx_alerts_date ON alerts(date(timestamp));
  `);

  // Config table for settings
  database.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✓ Database initialized at', DB_PATH);
}

export function insertSession(session: TokenSession): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO sessions 
    (session_id, timestamp, model, provider, input_tokens, output_tokens, 
     cache_read_tokens, cache_write_tokens, cost, duration, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    session.sessionId,
    session.timestamp.toISOString(),
    session.model,
    session.provider,
    session.inputTokens,
    session.outputTokens,
    session.cacheReadTokens || 0,
    session.cacheWriteTokens || 0,
    session.cost,
    session.duration || null,
    session.status
  );
}

export function insertAlert(alert: Alert): void {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO alerts 
    (alert_id, timestamp, level, message, current_spend, limit_amount, acknowledged)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    alert.id,
    alert.timestamp.toISOString(),
    alert.level,
    alert.message,
    alert.currentSpend,
    alert.limit,
    alert.acknowledged ? 1 : 0
  );
}

export function getDailyStats(date: string): DailyStats | null {
  const database = getDb();
  
  // Get overall daily stats
  const statsStmt = database.prepare(`
    SELECT 
      date(timestamp) as date,
      COUNT(*) as total_sessions,
      SUM(input_tokens) as total_input_tokens,
      SUM(output_tokens) as total_output_tokens,
      SUM(cache_read_tokens) as total_cache_read_tokens,
      SUM(cache_write_tokens) as total_cache_write_tokens,
      SUM(cost) as total_cost
    FROM sessions
    WHERE date(timestamp) = ?
    GROUP BY date(timestamp)
  `);
  
  const stats = statsStmt.get(date) as any;
  if (!stats) return null;

  // Get model breakdown
  const modelStmt = database.prepare(`
    SELECT 
      model,
      COUNT(*) as sessions,
      SUM(input_tokens) as input_tokens,
      SUM(output_tokens) as output_tokens,
      SUM(cost) as cost
    FROM sessions
    WHERE date(timestamp) = ?
    GROUP BY model
  `);
  
  const modelRows = modelStmt.all(date) as any[];
  const modelBreakdown: Record<string, any> = {};
  
  for (const row of modelRows) {
    modelBreakdown[row.model] = {
      model: row.model,
      sessions: row.sessions,
      inputTokens: row.input_tokens,
      outputTokens: row.output_tokens,
      cost: row.cost,
    };
  }

  return {
    date: stats.date,
    totalSessions: stats.total_sessions,
    totalInputTokens: stats.total_input_tokens,
    totalOutputTokens: stats.total_output_tokens,
    totalCacheReadTokens: stats.total_cache_read_tokens || 0,
    totalCacheWriteTokens: stats.total_cache_write_tokens || 0,
    totalCost: stats.total_cost,
    modelBreakdown,
  };
}

export function getRangeStats(startDate: string, endDate: string): DailyStats[] {
  const database = getDb();
  const results: DailyStats[] = [];
  
  const stmt = database.prepare(`
    SELECT DISTINCT date(timestamp) as date
    FROM sessions
    WHERE date(timestamp) BETWEEN ? AND ?
    ORDER BY date
  `);
  
  const dates = stmt.all(startDate, endDate) as { date: string }[];
  
  for (const { date } of dates) {
    const stats = getDailyStats(date);
    if (stats) results.push(stats);
  }
  
  return results;
}

export function getUnacknowledgedAlerts(): Alert[] {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT * FROM alerts 
    WHERE acknowledged = 0
    ORDER BY timestamp DESC
  `);
  
  const rows = stmt.all() as any[];
  return rows.map(row => ({
    id: row.alert_id,
    timestamp: new Date(row.timestamp),
    level: row.level,
    message: row.message,
    currentSpend: row.current_spend,
    limit: row.limit_amount,
    acknowledged: !!row.acknowledged,
  }));
}

export function acknowledgeAlert(alertId: string): void {
  const database = getDb();
  const stmt = database.prepare(`
    UPDATE alerts SET acknowledged = 1 WHERE alert_id = ?
  `);
  stmt.run(alertId);
}

export function getMonthlyTotal(yearMonth: string): number {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT SUM(cost) as total FROM sessions
    WHERE strftime('%Y-%m', timestamp) = ?
  `);
  
  const result = stmt.get(yearMonth) as { total: number };
  return result?.total || 0;
}
