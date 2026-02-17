/**
 * MemoryAgent - Main Entry Point
 * 
 * Usage:
 *   import { MemoryAgent } from './memory-agent';
 *   
 *   const memory = new MemoryAgent();
 *   const context = await memory.retrieve("What was I working on?");
 */

import {
  indexConversation,
  retrieveContext,
  summarizeSession,
  getSessionState,
  injectContext,
  saveSessionSummary,
  logDecision,
  updateTask,
  RetrievalResult,
  SessionState
} from './memory-core';

export interface MemoryAgentConfig {
  collection?: string;
  memoryDir?: string;
  autoIndex?: boolean;
  indexInterval?: number; // messages
}

export class MemoryAgent {
  private config: Required<MemoryAgentConfig>;
  private messageBuffer: Array<{ role: string; content: string; timestamp: string }> = [];
  private messageCount = 0;

  constructor(config: MemoryAgentConfig = {}) {
    this.config = {
      collection: config.collection || 'estudio-memory',
      memoryDir: config.memoryDir || '/home/e/.openclaw/workspace/memory',
      autoIndex: config.autoIndex !== false,
      indexInterval: config.indexInterval || 10
    };
  }

  /**
   * Record a message for potential indexing
   */
  recordMessage(role: string, content: string): void {
    this.messageBuffer.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });
    this.messageCount++;

    // Auto-index if threshold reached
    if (this.config.autoIndex && this.messageCount >= this.config.indexInterval) {
      this.flushBuffer();
    }
  }

  /**
   * Retrieve relevant context for a query
   */
  retrieve(query: string, limit = 5): RetrievalResult[] {
    return retrieveContext(query, limit);
  }

  /**
   * Get formatted context summary
   */
  getContextSummary(query = "What was I working on?"): string {
    const results = this.retrieve(query, 5);
    
    if (results.length === 0) {
      return "No relevant context found in memory.";
    }

    const sections = results.map((r, i) => 
      `[${i + 1}] From ${r.source} (${Math.round(r.relevance * 100)}% match):\n${r.content.slice(0, 500)}...`
    );

    return `## Relevant Context\n\n${sections.join('\n\n')}`;
  }

  /**
   * Get current session state
   */
  getState(): SessionState {
    return getSessionState();
  }

  /**
   * Index entire conversation
   */
  indexSession(sessionId: string): { success: boolean; entriesIndexed: number } {
    const result = indexConversation(sessionId, this.messageBuffer);
    this.flushBuffer();
    return { success: result.success, entriesIndexed: result.entriesIndexed };
  }

  /**
   * Create and save session summary
   */
  summarize(sessionId: string): void {
    const summary = summarizeSession(this.messageBuffer);
    saveSessionSummary(sessionId, summary);
  }

  /**
   * Inject context into a target
   */
  inject(targetSession: string, query: string): {
    success: boolean;
    context: string;
    relevance: number;
  } {
    const result = injectContext(targetSession, query);
    return {
      success: result.success,
      context: result.context,
      relevance: result.relevance
    };
  }

  /**
   * Log a decision
   */
  logDecision(decision: string, rationale: string, context?: string): void {
    logDecision(decision, rationale, context);
  }

  /**
   * Update task status
   */
  updateTask(taskId: string, description: string, status: 'todo' | 'in_progress' | 'completed' | 'blocked'): void {
    updateTask(taskId, description, status);
  }

  /**
   * Flush message buffer to index
   */
  private flushBuffer(): void {
    if (this.messageBuffer.length === 0) return;
    
    const sessionId = `session-${Date.now()}`;
    indexConversation(sessionId, this.messageBuffer);
    
    this.messageBuffer = [];
    this.messageCount = 0;
  }

  /**
   * Get memory statistics
   */
  getStats(): {
    bufferedMessages: number;
    autoIndexEnabled: boolean;
    indexInterval: number;
  } {
    return {
      bufferedMessages: this.messageBuffer.length,
      autoIndexEnabled: this.config.autoIndex,
      indexInterval: this.config.indexInterval
    };
  }
}

// Export standalone functions for direct use
export {
  indexConversation,
  retrieveContext,
  summarizeSession,
  getSessionState,
  injectContext,
  saveSessionSummary,
  logDecision as logDecisionToMemory,
  updateTask as updateTaskInMemory,
  RetrievalResult,
  SessionState
};

// Default export
export default MemoryAgent;
