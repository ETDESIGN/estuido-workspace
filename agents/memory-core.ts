/**
 * MemoryAgent Core Functions
 * 
 * Long-term memory and context persistence system
 * Uses QMD for vector search and structured files for human-readable storage
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const MEMORY_DIR = '/home/e/.openclaw/workspace/memory';
const QMD_COLLECTION = 'estudio-memory';
const SESSIONS_DIR = path.join(MEMORY_DIR, 'sessions');

// QMD availability cache
let qmdAvailable: boolean | null = null;
let qmdChecked = false;

// Types
export interface MemoryEntry {
  id: string;
  content: string;
  source: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface RetrievalResult {
  content: string;
  source: string;
  relevance: number;
  timestamp?: string;
}

export interface SessionState {
  activeAgents: string[];
  currentTasks: string[];
  lastUpdate: string;
  context?: string;
}

/**
 * Index a conversation into QMD vector database
 * @param sessionId - Unique session identifier
 * @param messages - Array of conversation messages
 * @returns Success status and entry count
 */
export function indexConversation(
  sessionId: string,
  messages: Array<{ role: string; content: string; timestamp?: string }>
): { success: boolean; entriesIndexed: number; errors: string[] } {
  ensureDirectories();
  const errors: string[] = [];
  let entriesIndexed = 0;

  try {
    // Chunk messages into meaningful segments
    const chunks = chunkMessages(messages);

    for (const chunk of chunks) {
      const content = formatChunkForIndexing(chunk);
      
      // Write to temp file for QMD indexing
      const tempFile = path.join(MEMORY_DIR, 'index', `${sessionId}-${Date.now()}.md`);
      
      const metadata = `---
sessionId: ${sessionId}
timestamp: ${chunk.timestamp || new Date().toISOString()}
roles: ${chunk.roles.join(',')}
---

`;
      
      fs.writeFileSync(tempFile, metadata + content);
      entriesIndexed++;
    }

    // Trigger QMD update (only if available)
    if (isQmdAvailable()) {
      try {
        ensureQmdCollection();
        execSync('qmd update', { stdio: 'pipe', timeout: 60000 });
      } catch (e) {
        errors.push(`QMD update failed: ${e}`);
      }
    } else {
      // QMD not available — files are still written, will use fallback search
      console.log('💾 Indexed to files (QMD unavailable)');
    }

    return { success: errors.length === 0, entriesIndexed, errors };
  } catch (error) {
    errors.push(`Indexing failed: ${error}`);
    return { success: false, entriesIndexed, errors };
  }
}

/**
 * Retrieve relevant context from QMD using semantic search
 * @param query - Search query
 * @param limit - Maximum number of results (default: 5)
 * @returns Array of relevant memory entries
 */
export function retrieveContext(query: string, limit = 5): RetrievalResult[] {
  // Try QMD first if available
  if (isQmdAvailable()) {
    try {
      ensureQmdCollection();
      const output = execSync(
        `qmd vsearch "${query.replace(/"/g, '\\"')}" --json`,
        { encoding: 'utf-8', stdio: 'pipe', timeout: 10000 }
      );

      const results = JSON.parse(output);
      
      return results.slice(0, limit).map((r: any) => ({
        content: r.content || r.text,
        source: r.source || r.path,
        relevance: r.score || r.relevance || 0,
        timestamp: r.metadata?.timestamp
      }));
    } catch (error) {
      console.warn('QMD retrieval failed, using fallback:', error);
    }
  }
  
  // Fallback to file-based search
  return fallbackFileSearch(query, limit);
}

/**
 * Create a summary of a conversation session
 * @param messages - Conversation messages
 * @returns Structured summary
 */
export function summarizeSession(
  messages: Array<{ role: string; content: string }>
): {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  tasks: string[];
  participants: string[];
} {
  const participants = [...new Set(messages.map(m => m.role))];
  
  // Extract key points (simple heuristic-based extraction)
  const keyPoints: string[] = [];
  const decisions: string[] = [];
  const tasks: string[] = [];

  for (const msg of messages) {
    const content = msg.content.toLowerCase();
    
    // Look for decision markers
    if (content.includes('decision:') || content.includes('decided to')) {
      decisions.push(msg.content);
    }
    
    // Look for task markers
    if (content.includes('task:') || content.includes('todo:') || content.includes('- [ ]')) {
      tasks.push(msg.content);
    }
    
    // Look for key point markers
    if (content.includes('important:') || content.includes('note:') || content.includes('key:')) {
      keyPoints.push(msg.content);
    }
  }

  // Create overall summary
  const summary = generateSummary(messages);

  return {
    summary,
    keyPoints: keyPoints.slice(0, 10),
    decisions: decisions.slice(0, 5),
    tasks: tasks.slice(0, 10),
    participants
  };
}

/**
 * Get current session state from AGENT_STATE.md
 * @returns Current agent assignments and tasks
 */
export function getSessionState(): SessionState {
  try {
    const stateFile = path.join(MEMORY_DIR, 'AGENT_STATE.md');
    
    if (!fs.existsSync(stateFile)) {
      return { activeAgents: [], currentTasks: [], lastUpdate: new Date().toISOString() };
    }

    const content = fs.readFileSync(stateFile, 'utf-8');
    
    // Parse active agents
    const agentMatch = content.match(/\|\s*(\w+)\s*\|\s*🟢\s*Active\s*\|\s*([^|]+)\|/g);
    const activeAgents = agentMatch 
      ? agentMatch.map(m => m.match(/\|\s*(\w+)\s*\|/)?.[1]).filter(Boolean) as string[]
      : [];

    // Parse current tasks
    const taskMatch = content.match(/\*\*Current Task:\*\*\s*([^
]+)/g);
    const currentTasks = taskMatch
      ? taskMatch.map(m => m.replace(/\*\*Current Task:\*\*\s*/, '').trim())
      : [];

    return {
      activeAgents,
      currentTasks,
      lastUpdate: new Date().toISOString(),
      context: content.slice(0, 2000) // First 2000 chars as context
    };
  } catch (error) {
    console.error('Failed to get session state:', error);
    return { activeAgents: [], currentTasks: [], lastUpdate: new Date().toISOString() };
  }
}

/**
 * Inject relevant context into a target session
 * @param targetSession - Target session identifier
 * @param query - Context query
 * @returns Injection result with formatted context
 */
export function injectContext(
  targetSession: string,
  query: string
): {
  success: boolean;
  context: string;
  sources: string[];
  relevance: number;
} {
  try {
    const memories = retrieveContext(query, 5);
    
    if (memories.length === 0) {
      return {
        success: false,
        context: 'No relevant context found.',
        sources: [],
        relevance: 0
      };
    }

    const sources = [...new Set(memories.map(m => m.source))];
    const avgRelevance = memories.reduce((sum, m) => sum + m.relevance, 0) / memories.length;
    
    const context = formatContextForInjection(memories, targetSession);

    return {
      success: true,
      context,
      sources,
      relevance: avgRelevance
    };
  } catch (error) {
    return {
      success: false,
      context: `Context injection failed: ${error}`,
      sources: [],
      relevance: 0
    };
  }
}

/**
 * Ensure memory directories exist
 */
function ensureDirectories(): void {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  }
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }
  if (!fs.existsSync(path.join(MEMORY_DIR, 'index'))) {
    fs.mkdirSync(path.join(MEMORY_DIR, 'index'), { recursive: true });
  }
}

/**
 * Save session summary to file
 * @param sessionId - Session identifier
 * @param summary - Session summary object
 */
export function saveSessionSummary(
  sessionId: string,
  summary: ReturnType<typeof summarizeSession>
): void {
  ensureDirectories();
  const summaryFile = path.join(SESSIONS_DIR, `${sessionId}.md`);
  
  const content = `# Session Summary: ${sessionId}

**Date:** ${new Date().toISOString().split('T')[0]}  
**Participants:** ${summary.participants.join(', ')}

## Overview

${summary.summary}

## Key Points

${summary.keyPoints.map(p => `- ${p}`).join('\n') || '*No key points extracted*'}

## Decisions Made

${summary.decisions.map(d => `- ${d}`).join('\n') || '*No decisions recorded*'}

## Tasks Identified

${summary.tasks.map(t => `- ${t}`).join('\n') || '*No tasks identified*'}

---

*Auto-generated by MemoryAgent*
`;

  fs.writeFileSync(summaryFile, content);
}

/**
 * Append a decision to the decisions log
 * @param decision - Decision text
 * @param rationale - Why this decision was made
 * @param context - Additional context
 */
export function logDecision(
  decision: string,
  rationale: string,
  context?: string
): void {
  ensureDirectories();
  const decisionsFile = path.join(MEMORY_DIR, 'decisions.md');
  
  const entry = `

## ${new Date().toISOString().split('T')[0]}: ${decision.slice(0, 50)}...

**Decision:** ${decision}

**Rationale:** ${rationale}

${context ? `**Context:** ${context}\n` : ''}
---
`;

  fs.appendFileSync(decisionsFile, entry);
}

/**
 * Add or update a task in TODO.md
 * @param taskId - Unique task identifier
 * @param description - Task description
 * @param status - Task status
 */
export function updateTask(
  taskId: string,
  description: string,
  status: 'todo' | 'in_progress' | 'completed' | 'blocked'
): void {
  ensureDirectories();
  const todoFile = path.join(MEMORY_DIR, 'TODO.md');
  
  // Read existing content
  let content = fs.existsSync(todoFile) ? fs.readFileSync(todoFile, 'utf-8') : '';
  
  const statusEmoji = {
    todo: '⬜',
    in_progress: '🚧',
    completed: '✅',
    blocked: '⛔'
  };

  const taskLine = `- ${statusEmoji[status]} **${taskId}**: ${description}`;
  
  // Check if task already exists
  if (content.includes(taskId)) {
    // Update existing task
    const lines = content.split('\n');
    const updatedLines = lines.map(line => 
      line.includes(taskId) ? taskLine : line
    );
    content = updatedLines.join('\n');
  } else {
    // Add new task
    content += `\n${taskLine}`;
  }

  fs.writeFileSync(todoFile, content);
}

/**
 * Check if QMD is available and working
 */
function isQmdAvailable(): boolean {
  if (qmdChecked) return qmdAvailable!;
  
  try {
    execSync('qmd --help', { stdio: 'pipe', timeout: 5000 });
    qmdAvailable = true;
  } catch (error) {
    qmdAvailable = false;
    console.warn('⚠️ QMD not available. Using file-based fallback for memory retrieval.');
  }
  
  qmdChecked = true;
  return qmdAvailable;
}

/**
 * Initialize QMD collection if needed
 */
function ensureQmdCollection(): boolean {
  if (!isQmdAvailable()) return false;
  
  try {
    // Check if collection exists
    const output = execSync('qmd collection list', { encoding: 'utf-8', stdio: 'pipe' });
    if (!output.includes(QMD_COLLECTION)) {
      // Create collection
      execSync(`qmd collection add ${MEMORY_DIR}/index --name ${QMD_COLLECTION} --mask "*.md"`, { 
        stdio: 'pipe',
        timeout: 30000 
      });
      console.log(`✅ Created QMD collection: ${QMD_COLLECTION}`);
    }
    return true;
  } catch (error) {
    console.warn('⚠️ Failed to initialize QMD collection:', error);
    return false;
  }
}

// Helper functions

function chunkMessages(
  messages: Array<{ role: string; content: string; timestamp?: string }>
): Array<{ content: string; roles: string[]; timestamp: string }> {
  const chunks: Array<{ content: string; roles: string[]; timestamp: string }> = [];
  let currentChunk: string[] = [];
  let currentRoles: Set<string> = new Set();
  let chunkStartTime = messages[0]?.timestamp || new Date().toISOString();

  for (const msg of messages) {
    currentChunk.push(`${msg.role}: ${msg.content}`);
    currentRoles.add(msg.role);

    // Chunk every 10 messages or on topic change
    if (currentChunk.length >= 10) {
      chunks.push({
        content: currentChunk.join('\n\n'),
        roles: [...currentRoles],
        timestamp: chunkStartTime
      });
      currentChunk = [];
      currentRoles = new Set();
      chunkStartTime = msg.timestamp || new Date().toISOString();
    }
  }

  // Don't forget the last chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n\n'),
      roles: [...currentRoles],
      timestamp: chunkStartTime
    });
  }

  return chunks;
}

function formatChunkForIndexing(chunk: { content: string; roles: string[] }): string {
  return chunk.content;
}

function fallbackFileSearch(query: string, limit: number): RetrievalResult[] {
  const results: RetrievalResult[] = [];
  const queryTerms = query.toLowerCase().split(' ');

  try {
    const files = fs.readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md'));

    for (const file of files.slice(0, limit)) {
      const content = fs.readFileSync(path.join(MEMORY_DIR, file), 'utf-8');
      const lowerContent = content.toLowerCase();
      
      // Simple relevance scoring
      let score = 0;
      for (const term of queryTerms) {
        if (lowerContent.includes(term)) score += 1;
      }
      
      if (score > 0) {
        results.push({
          content: content.slice(0, 500), // First 500 chars
          source: file,
          relevance: score / queryTerms.length
        });
      }
    }
  } catch (error) {
    console.error('Fallback search failed:', error);
  }

  return results.slice(0, limit);
}

function generateSummary(messages: Array<{ role: string; content: string }>): string {
  const messageCount = messages.length;
  const participantCount = new Set(messages.map(m => m.role)).size;
  const totalLength = messages.reduce((sum, m) => sum + m.content.length, 0);

  return `Session with ${participantCount} participants, ${messageCount} messages, ${Math.round(totalLength / 1000)}KB total content.`;
}

function formatContextForInjection(
  memories: RetrievalResult[],
  targetSession: string
): string {
  const sections = memories.map((m, i) => 
    `### Memory ${i + 1} (Relevance: ${Math.round(m.relevance * 100)}%)\nSource: ${m.source}\n\n${m.content.slice(0, 1000)}`
  );

  return `# Relevant Context for ${targetSession}

${sections.join('\n\n---\n\n')}

---
*Retrieved by MemoryAgent*`;
}
