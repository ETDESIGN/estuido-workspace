import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Simulated data generator for real-time updates
function generateDashboardData() {
  const now = new Date();
  
  // Add some randomization to simulate live data
  const agents = [
    {
      id: "agent-01",
      name: "CTO_Core_v4",
      role: "ARCHITECT (CTO)",
      model: "Gemini 1.5 Pro",
      status: ["thinking", "working", "idle", "error"][Math.floor(Math.random() * 4)],
      task: ["Optimizing API Gateway routes", "Reviewing PR #234", "Building feature X", "Waiting for input"][Math.floor(Math.random() * 4)],
      contextUsed: Math.floor(Math.random() * 100) + 10,
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
      status: ["thinking", "working", "idle", "error"][Math.floor(Math.random() * 4)],
      task: ["Waiting for social queue", "Drafting LinkedIn post", "Analyzing metrics", "Scheduling tweets"][Math.floor(Math.random() * 4)],
      contextUsed: Math.floor(Math.random() * 50) + 5,
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
      status: ["thinking", "working", "idle", "error"][Math.floor(Math.random() * 4)],
      task: ["Processing payments", "Monitoring uptime", "Reviewing logs", "Connection timeout"][Math.floor(Math.random() * 4)],
      contextUsed: Math.floor(Math.random() * 100) + 50,
      contextTotal: 128,
      contextBreakdown: { system: 10, user: 30, rag: 50, output: 10 },
      tools: ["Stripe API", "Quickbooks", "Slack Webhook", "SendGrid"],
      color: "red"
    }
  ];

  return {
    uplinkTime: now.toISOString(),
    stats: {
      totalAgents: 3,
      activeSessions: 14 + Math.floor(Math.random() * 5),
      costToday: parseFloat((0.41 + Math.random() * 0.1).toFixed(2)),
      tokensToday: 190292 + Math.floor(Math.random() * 10000),
      tasksCompletedToday: 12 + Math.floor(Math.random() * 3)
    },
    systemHealth: {
      cpu: parseFloat((2 + Math.random() * 5).toFixed(1)),
      disk: 84,
      memory: {
        used: 3458 + Math.floor(Math.random() * 500),
        total: 8192,
        percent: 42 + Math.floor(Math.random() * 10)
      }
    },
    services: {
      openclawGateway: { status: "running" },
      costMonitor: { status: "active" },
      pulseUplink: { status: "sending" }
    },
    agents,
    modelMetrics: [
      { model: "Gemini 1.5 Flash", tasks: 1420 + Math.floor(Math.random() * 50), cost: 0.12, efficiency: 95 },
      { model: "Gemini 1.5 Pro", tasks: 340 + Math.floor(Math.random() * 20), cost: 0.21, efficiency: 65 },
      { model: "DeepSeek-V3", tasks: 850 + Math.floor(Math.random() * 30), cost: 0.08, efficiency: 88 },
      { model: "GPT-4o", tasks: 120 + Math.floor(Math.random() * 10), cost: 0.35, efficiency: 30 }
    ]
  };
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Send initial data
      const initialData = generateDashboardData();
      const initialPayload = `data: ${JSON.stringify({ type: 'update', data: initialData })}\n\n`;
      controller.enqueue(encoder.encode(initialPayload));

      // Set up interval for real-time updates
      const intervalId = setInterval(() => {
        try {
          const newData = generateDashboardData();
          const payload = `data: ${JSON.stringify({ type: 'update', data: newData })}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch (error) {
          console.error('Error sending SSE data:', error);
          clearInterval(intervalId);
          controller.close();
        }
      }, 3000); // Update every 3 seconds

      // Cleanup on client disconnect
      req.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable Nginx buffering
    },
  });
}
