#!/usr/bin/env node
/**
 * Tiered Intelligence Router
 * Automatically routes tasks to appropriate model tier
 */

const TIER_CONFIG = {
  PULSE: {
    model: "openrouter/google/gemini-2.0-flash-001",
    alias: "Flash",
    costPerM: { input: 0.1, output: 0.4 },
    timeout: 30,
    keywords: [
      "check", "status", "heartbeat", "hello", "hi", "hey", "thanks", "ok", "okay",
      "weather", "time", "date", "what is", "simple", "quick", "status check",
      "list", "show me", "get", "fetch", "read", "lookup", "find"
    ],
    patterns: [
      /^\s*(hi|hello|hey|yo)\s*$/i,
      /^\s*(thanks|thank you|ok|okay|cool|nice)\s*$/i,
      /check.*(email|calendar|status|inbox)/i,
      /what.*(weather|time|date|day)/i,
      /list.*(files|tasks|reminders)/i,
      /show.*(me|all|latest)/i,
    ]
  },
  WORKHORSE: {
    model: "openrouter/minimax/minimax-01",
    alias: "MiniMax",
    costPerM: { input: 1.5, output: 3.0 },
    timeout: 60,
    keywords: [
      "summarize", "generate", "create", "build", "write", "draft",
      "analyze", "convert", "format", "extract", "parse", "transform",
      "code", "script", "function", "component", "page", "api",
      "review", "refactor", "improve", "optimize"
    ],
    patterns: [
      /summarize.*/i,
      /generate.*/i,
      /create\s+(a|an|the).*/i,
      /write\s+(a|an|the|some|code).*/i,
      /build\s+(a|an|the).*/i,
      /convert\s+.*to.*/i,
      /format\s+.*/i,
    ]
  },
  BRAIN: {
    model: "moonshot/kimi-k2.5",
    alias: "Kimi",
    costPerM: { input: 0.5, output: 2.4 },
    timeout: 120,
    keywords: [
      "debug", "fix", "troubleshoot", "investigate", "diagnose",
      "design", "architect", "plan", "strategy", "system design",
      "reason", "prove", "explain", "understand", "complex",
      "error", "bug", "issue", "problem", "fail", "broken",
      "how to", "why does", "what if", "compare", "evaluate"
    ],
    patterns: [
      /debug.*/i,
      /fix.*/i,
      /troubleshoot.*/i,
      /design\s+(a|an|the|system|architecture).*/i,
      /architect.*/i,
      /how\s+(to|do|can|should).*/i,
      /why\s+(is|does|do|would).*/i,
      /what\s+if.*/i,
      /explain\s+(why|how|what).*/i,
      /error|bug|issue|problem|fail/i,
    ]
  }
};

/**
 * Classify task into tier
 */
function classifyTask(request) {
  const lowerRequest = request.toLowerCase();
  
  // Check for BRAIN patterns first (complex reasoning)
  for (const pattern of TIER_CONFIG.BRAIN.patterns) {
    if (pattern.test(lowerRequest)) return "BRAIN";
  }
  for (const keyword of TIER_CONFIG.BRAIN.keywords) {
    if (lowerRequest.includes(keyword)) return "BRAIN";
  }
  
  // Check for WORKHORSE patterns (moderate complexity)
  for (const pattern of TIER_CONFIG.WORKHORSE.patterns) {
    if (pattern.test(lowerRequest)) return "WORKHORSE";
  }
  for (const keyword of TIER_CONFIG.WORKHORSE.keywords) {
    if (lowerRequest.includes(keyword)) return "WORKHORSE";
  }
  
  // Check for PULSE patterns (routine)
  for (const pattern of TIER_CONFIG.PULSE.patterns) {
    if (pattern.test(lowerRequest)) return "PULSE";
  }
  for (const keyword of TIER_CONFIG.PULSE.keywords) {
    if (lowerRequest.includes(keyword)) return "PULSE";
  }
  
  // Default to BRAIN for unknown complexity
  return "BRAIN";
}

/**
 * Get model for tier
 */
function getModelForTier(tier) {
  return TIER_CONFIG[tier]?.model || TIER_CONFIG.BRAIN.model;
}

/**
 * Get alias for tier
 */
function getAliasForTier(tier) {
  return TIER_CONFIG[tier]?.alias || "Kimi";
}

/**
 * Route request and return routing decision
 */
function route(request, forceTier = null) {
  const tier = forceTier || classifyTask(request);
  const config = TIER_CONFIG[tier];
  
  return {
    tier,
    model: config.model,
    alias: config.alias,
    timeout: config.timeout,
    estimatedCost: config.costPerM,
    reasoning: forceTier ? `Forced to ${tier} tier` : `Classified as ${tier} tier`
  };
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const forceTier = args[0]?.startsWith('--') ? args[0].replace('--', '').toUpperCase() : null;
  const request = forceTier ? args.slice(1).join(' ') : args.join(' ');
  
  if (!request) {
    console.log(JSON.stringify({ error: "No request provided" }));
    process.exit(1);
  }
  
  const result = route(request, forceTier);
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { classifyTask, route, getModelForTier, TIER_CONFIG };
