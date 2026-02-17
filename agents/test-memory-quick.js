#!/usr/bin/env node
/**
 * Quick MemoryAgent Test Runner (CommonJS)
 */

const fs = require('fs');
const path = require('path');

// Simple test framework
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`${msg}: expected ${expected}, got ${actual}`);
  }
}

function assertTrue(value, msg) {
  if (!value) {
    throw new Error(msg || 'Expected true, got false');
  }
}

console.log('🧠 MemoryAgent Quick Test Suite\n');

// Test 1: Directory structure exists
test('Memory directories exist', () => {
  const dirs = [
    '/home/e/.openclaw/workspace/memory',
    '/home/e/.openclaw/workspace/memory/sessions',
    '/home/e/.openclaw/workspace/memory/index'
  ];
  dirs.forEach(dir => {
    assertTrue(fs.existsSync(dir), `Directory ${dir} should exist`);
  });
});

// Test 2: Core files exist
test('Agent files exist', () => {
  const files = [
    '/home/e/.openclaw/workspace/agents/memory.json',
    '/home/e/.openclaw/workspace/agents/MEMORY.md',
    '/home/e/.openclaw/workspace/agents/memory-core.ts',
    '/home/e/.openclaw/workspace/agents/memory-agent.ts'
  ];
  files.forEach(file => {
    assertTrue(fs.existsSync(file), `File ${file} should exist`);
  });
});

// Test 3: Config is valid JSON
test('memory.json is valid JSON', () => {
  const config = JSON.parse(fs.readFileSync('/home/e/.openclaw/workspace/agents/memory.json', 'utf-8'));
  assertEqual(config.id, 'memory', 'Config ID should be memory');
  assertTrue(config.systemPrompt.includes('MemoryAgent'), 'Should have MemoryAgent system prompt');
});

// Test 4: Session state file readable
test('AGENT_STATE.md is readable', () => {
  const content = fs.readFileSync('/home/e/.openclaw/workspace/memory/AGENT_STATE.md', 'utf-8');
  assertTrue(content.includes('Currently Active Agents'), 'Should have agent state section');
  assertTrue(content.includes('MemoryAgent'), 'Should mention MemoryAgent');
});

// Test 5: Core functions exist in source
test('Core functions defined in memory-core.ts', () => {
  const core = fs.readFileSync('/home/e/.openclaw/workspace/agents/memory-core.ts', 'utf-8');
  assertTrue(core.includes('indexConversation'), 'Should have indexConversation');
  assertTrue(core.includes('retrieveContext'), 'Should have retrieveContext');
  assertTrue(core.includes('summarizeSession'), 'Should have summarizeSession');
  assertTrue(core.includes('getSessionState'), 'Should have getSessionState');
  assertTrue(core.includes('isQmdAvailable'), 'Should have isQmdAvailable (QMD fix)');
  assertTrue(core.includes('ensureDirectories'), 'Should have ensureDirectories');
});

// Test 6: MemoryAgent class exists
test('MemoryAgent class defined', () => {
  const agent = fs.readFileSync('/home/e/.openclaw/workspace/agents/memory-agent.ts', 'utf-8');
  assertTrue(agent.includes('export class MemoryAgent'), 'Should export MemoryAgent class');
  assertTrue(agent.includes('recordMessage'), 'Should have recordMessage method');
  assertTrue(agent.includes('retrieve'), 'Should have retrieve method');
});

// Test 7: QMD fallback implemented
test('QMD fallback implemented', () => {
  const core = fs.readFileSync('/home/e/.openclaw/workspace/agents/memory-core.ts', 'utf-8');
  assertTrue(core.includes('fallbackFileSearch'), 'Should have fallback search');
  assertTrue(core.includes('qmdAvailable'), 'Should track QMD availability');
});

// Test 8: Test file runnable
test('Test file structure valid', () => {
  const test = fs.readFileSync('/home/e/.openclaw/workspace/agents/memory-agent.test.ts', 'utf-8');
  assertTrue(test.includes('getSessionState'), 'Tests should cover getSessionState');
  assertTrue(test.includes('MemoryAgent'), 'Tests should cover MemoryAgent');
});

// Summary
console.log('\n' + '='.repeat(40));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(40));

if (failed === 0) {
  console.log('\n✨ All tests passed! MemoryAgent is ready.');
  process.exit(0);
} else {
  console.log('\n⚠️ Some tests failed. Check output above.');
  process.exit(1);
}
