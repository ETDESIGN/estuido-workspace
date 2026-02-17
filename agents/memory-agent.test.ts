/**
 * MemoryAgent Tests
 * 
 * Run with: npx ts-node memory-agent.test.ts
 */

import { MemoryAgent } from './memory-agent.js';
import { getSessionState, retrieveContext } from './memory-core.js';

console.log('🧠 MemoryAgent Test Suite\n');

// Test 1: Session State
console.log('Test 1: getSessionState()');
try {
  const state = getSessionState();
  console.log('✅ Session state retrieved:', {
    activeAgents: state.activeAgents,
    currentTasks: state.currentTasks.length
  });
} catch (error) {
  console.log('❌ Failed:', error);
}

// Test 2: MemoryAgent instantiation
console.log('\nTest 2: MemoryAgent instantiation');
try {
  const memory = new MemoryAgent({ autoIndex: false });
  const stats = memory.getStats();
  console.log('✅ MemoryAgent created:', stats);
} catch (error) {
  console.log('❌ Failed:', error);
}

// Test 3: Context retrieval
console.log('\nTest 3: retrieveContext()');
try {
  const results = retrieveContext("memory agent implementation", 3);
  console.log(`✅ Retrieved ${results.length} memories`);
  results.forEach((r, i) => {
    console.log(`  [${i + 1}] ${r.source} (${Math.round(r.relevance * 100)}%)`);
  });
} catch (error) {
  console.log('❌ Failed:', error);
}

// Test 4: Context summary
console.log('\nTest 4: getContextSummary()');
try {
  const memory = new MemoryAgent();
  const summary = memory.getContextSummary("What is the MemoryAgent");
  console.log('✅ Context summary generated:', summary.slice(0, 200) + '...');
} catch (error) {
  console.log('❌ Failed:', error);
}

// Test 5: Message recording
console.log('\nTest 5: recordMessage()');
try {
  const memory = new MemoryAgent({ autoIndex: false });
  memory.recordMessage('user', 'Test message 1');
  memory.recordMessage('assistant', 'Test response 1');
  memory.recordMessage('user', 'Test message 2');
  
  const stats = memory.getStats();
  console.log('✅ Messages recorded:', stats.bufferedMessages);
} catch (error) {
  console.log('❌ Failed:', error);
}

console.log('\n✨ All basic tests completed!');
console.log('\nTo run full tests:');
console.log('  1. Ensure QMD is installed: qmd status');
console.log('  2. Run: npx ts-node agents/memory-agent.test.ts');
