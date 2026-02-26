import { NextResponse } from 'next/server';

// Data aggregator - in production this would fetch from OpenClaw
async function getDashboardData() {
  // For now, return mock data structure
  // TODO: Replace with real OpenClaw API calls
  
  const now = new Date();
  
  return {
    uplinkTime: now.toISOString(),
    
    stats: {
      totalAgents: 3,
      activeSessions: 14,
      costToday: 0.41,
      tokensToday: 190292,
      tasksCompletedToday: 12
    },

    systemHealth: {
      cpu: 2.3,
      disk: 84,
      memory: {
        used: 3458,
        total: 8192,
        percent: 42
      }
    },

    services: {
      openclawGateway: { status: "running" },
      costMonitor: { status: "active" },
      pulseUplink: { status: "sending" }
    },

    agents: [
      {
        id: "agent-01",
        name: "CTO_Core_v4",
        role: "ARCHITECT (CTO)",
        model: "Gemini 1.5 Pro",
        status: "thinking",
        task: "Optimizing API Gateway routes",
        contextUsed: 45,
        contextTotal: 128,
        contextBreakdown: { system: 20, user: 15, rag: 45, output: 20 },
        tools: ["Kubectl", "AWS SDK", "Postgres", "Vercel CLI"],
        color: "emerald"
      },
      {
        id: "agent-02",
        name: "Growth_Engine_01",
        role: "GROWTH (CMO)",
        model: "Gemini 1.5 Flash",
        status: "idle",
        task: "Waiting for social queue",
        contextUsed: 12,
        contextTotal: 64,
        contextBreakdown: { system: 40, user: 10, rag: 40, output: 10 },
        tools: ["Twitter API", "LinkedIn API", "OpenAI DALL-E", "Google Trends"],
        color: "cyan"
      },
      {
        id: "agent-03",
        name: "Ops_Manager_X",
        role: "OPERATIONS (COO)",
        model: "DeepSeek-V3",
        status: "error",
        task: "Connection timeout on port 5432",
        contextUsed: 88,
        contextTotal: 128,
        contextBreakdown: { system: 10, user: 30, rag: 50, output: 10 },
        tools: ["Stripe API", "Quickbooks", "Slack Webhook", "SendGrid"],
        color: "red"
      }
    ],

    socialQueue: [
      { day: 2, title: "Launch Post", type: "LinkedIn", status: "Done" },
      { day: 5, title: "Feature Teaser", type: "Twitter", status: "Done" },
      { day: 12, title: "Case Study: Alpha", type: "Blog", status: "Scheduled" },
      { day: 15, title: "Meme Monday", type: "Twitter", status: "Draft" },
      { day: 22, title: "Product Update v2", type: "LinkedIn", status: "Draft" },
      { day: 25, title: "Community Spotlight", type: "Twitter", status: "Idea" }
    ],

    modelMetrics: [
      { model: "Gemini 1.5 Flash", tasks: 1420, cost: 0.12, efficiency: 95 },
      { model: "Gemini 1.5 Pro", tasks: 340, cost: 0.21, efficiency: 65 },
      { model: "DeepSeek-V3", tasks: 850, cost: 0.08, efficiency: 88 },
      { model: "GPT-4o", tasks: 120, cost: 0.35, efficiency: 30 }
    ],

    vaultFiles: [
      { id: 'f1', name: 'mission_protocols', type: 'folder', modified: '2024-02-18', category: 'doc' },
      { id: 'f2', name: 'agent_logs', type: 'folder', modified: '2024-02-19', category: 'doc' },
      { id: 'f3', name: 'src_backup_v2.zip', type: 'file', size: '450MB', modified: '2024-02-10', extension: 'zip', category: 'code' },
      { id: 'f4', name: 'architecture_diagram.png', type: 'file', size: '2.4MB', modified: '2024-02-15', extension: 'png', category: 'img' },
      { id: 'f5', name: 'user_manifest.json', type: 'file', size: '12KB', modified: 'Today', extension: 'json', category: 'code' },
      { id: 'f6', name: 'q1_financials.csv', type: 'file', size: '84KB', modified: 'Yesterday', extension: 'csv', category: 'doc' },
      { id: 'f7', name: 'vector_embeddings.bin', type: 'file', size: '1.2GB', modified: '2024-02-19', extension: 'bin', category: 'db' }
    ]
  };
}

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
