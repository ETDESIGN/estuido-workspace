/**
 * Token Tracking Dashboard - Session Parser
 * Parse OpenClaw session data and create token records
 */

import { TokenSession } from '../types.js';
import { calculateCost } from './cost.js';
import { randomUUID } from 'crypto';

/**
 * Parse a raw session log entry into a TokenSession
 * This handles various formats that OpenClaw might produce
 */
export function parseSession(data: Record<string, any>): TokenSession | null {
  try {
    // Handle different possible field names
    const sessionId = data.sessionId || data.session_id || data.id || randomUUID();
    const model = data.model || data.modelId || 'unknown';
    const provider = data.provider || extractProvider(model);
    
    const inputTokens = normalizeTokens(data.inputTokens || data.input_tokens || data.input || 0);
    const outputTokens = normalizeTokens(data.outputTokens || data.output_tokens || data.output || 0);
    const cacheReadTokens = normalizeTokens(data.cacheReadTokens || data.cache_read_tokens || 0);
    const cacheWriteTokens = normalizeTokens(data.cacheWriteTokens || data.cache_write_tokens || 0);
    
    const cost = data.cost !== undefined 
      ? parseFloat(data.cost) 
      : calculateCost(model, inputTokens, outputTokens, cacheReadTokens, cacheWriteTokens);
    
    const timestamp = data.timestamp 
      ? new Date(data.timestamp) 
      : new Date();
    
    const duration = data.duration ? parseInt(data.duration, 10) : undefined;
    const status = normalizeStatus(data.status);
    
    return {
      sessionId,
      timestamp,
      model,
      provider,
      inputTokens,
      outputTokens,
      cacheReadTokens,
      cacheWriteTokens,
      cost,
      duration,
      status,
    };
  } catch (err) {
    console.error('Failed to parse session:', err);
    return null;
  }
}

/**
 * Extract provider from model name (e.g., "moonshot/kimi-k2.5" -> "moonshot")
 */
function extractProvider(model: string): string {
  if (model.includes('/')) {
    return model.split('/')[0];
  }
  return 'unknown';
}

/**
 * Normalize token counts to integers
 */
function normalizeTokens(value: any): number {
  if (typeof value === 'number') return Math.max(0, Math.round(value));
  if (typeof value === 'string') {
    const parsed = parseInt(value.replace(/,/g, ''), 10);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  }
  return 0;
}

/**
 * Normalize status strings
 */
function normalizeStatus(status: any): 'success' | 'error' | 'cached' {
  if (!status) return 'success';
  const s = String(status).toLowerCase();
  if (s === 'error' || s === 'failed' || s === 'failure') return 'error';
  if (s === 'cached' || s === 'cache') return 'cached';
  return 'success';
}

/**
 * Create a token session from manual input
 */
export function createSession(params: {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  duration?: number;
  status?: 'success' | 'error' | 'cached';
}): TokenSession {
  const sessionId = randomUUID();
  const provider = extractProvider(params.model);
  const cost = calculateCost(
    params.model,
    params.inputTokens,
    params.outputTokens,
    params.cacheReadTokens || 0,
    params.cacheWriteTokens || 0
  );
  
  return {
    sessionId,
    timestamp: new Date(),
    model: params.model,
    provider,
    inputTokens: params.inputTokens,
    outputTokens: params.outputTokens,
    cacheReadTokens: params.cacheReadTokens || 0,
    cacheWriteTokens: params.cacheWriteTokens || 0,
    cost,
    duration: params.duration,
    status: params.status || 'success',
  };
}

/**
 * Simulate parsing from a log file line (JSON or CSV)
 */
export function parseLogLine(line: string): TokenSession | null {
  line = line.trim();
  if (!line) return null;
  
  // Try JSON first
  if (line.startsWith('{')) {
    try {
      const data = JSON.parse(line);
      return parseSession(data);
    } catch {
      // Not valid JSON, continue
    }
  }
  
  // Try CSV format: timestamp,model,input,output,cost
  const parts = line.split(',');
  if (parts.length >= 4) {
    return parseSession({
      timestamp: parts[0],
      model: parts[1],
      inputTokens: parts[2],
      outputTokens: parts[3],
      cost: parts[4],
    });
  }
  
  return null;
}
