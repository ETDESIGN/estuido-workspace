import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS for E's frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Types matching frontend contract
interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'thinking' | 'idle' | 'offline' | 'error' | 'working';
  task: string;
  contextUsed: number;
  contextTotal: number;
  contextBreakdown: {
    system: number;
    user: number;
    rag: number;
    output: number;
  };
  tools: string[];
  color: string;
}

interface DashboardData {
  uplinkTime: string;
  stats: {
    totalAgents: number;
    activeSessions: number;
    costToday: number;
    tokensToday: number;
    tasksCompletedToday: number;
  };
  systemHealth: {
    cpu: number;
    disk: number;
    memory: {
      used: number;
      total: number;
      percent: number;
    };
  };
  services: {
    openclawGateway: { status: string };
    costMonitor: { status: string };
    pulseUplink: { status: string };
  };
  agents: Agent[];
  socialQueue: Array<{
    day: number;
    title: string;
    type: string;
    status: string;
  }>;
  modelMetrics: Array<{
    model: string;
    tasks: number;
    cost: number;
    efficiency: number;
  }>;
  vaultFiles: Array<{
    id: string;
    name: string;
    type: string;
    size?: string;
    modified: string;
    extension?: string;
    category: string;
  }>;
}

// Helper: Get system health
async function getSystemHealth() {
  try {
    // CPU usage
    const { stdout: cpuOut } = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1");
    const cpu = parseFloat(cpuOut.trim()) || 0;
    
    // Memory
    const { stdout: memOut } = await execAsync("free -m | awk 'NR==2{printf \"%s %s\", $3,$2}'");
    const [used, total] = memOut.trim().split(' ').map(Number);
    
    // Disk
    const { stdout: diskOut } = await execAsync("df -h / | awk 'NR==2{print $5}' | sed 's/%//'");
    const disk = parseInt(diskOut.trim()) || 0;
    
    return {
      cpu: parseFloat(cpu.toFixed(1)),
      memory: {
        used: used || 0,
        total: total || 8192,
        percent: total ? Math.round((used / total) * 100) : 0
      },
      disk
    };
  } catch (e) {
    console.error('System health error:', e);
    return {
      cpu: 0,
      memory: { used: 0, total: 8192, percent: 0 },
      disk: 0
    };
  }
}

// Helper: Check service status
async function getServicesStatus() {
  const checkProcess = async (name: string): Promise<{status: string}> => {
    try {
      await execAsync(`pgrep -f ${name}`);
      return { status: 'running' };
    } catch {
      return { status: 'stopped' };
    }
  };
  
  return {
    openclawGateway: await checkProcess('openclaw'),
    costMonitor: await checkProcess('cost-monitor'),
    pulseUplink: { status: 'idle' }
  };
}

// Helper: Get OpenClaw sessions (via file for now)
// TODO: Replace with actual OpenClaw API calls
async function getOpenClawAgents(): Promise<Agent[]> {
  // For now, return mock agents
  // In production, this would call OpenClaw's sessions_list
  return [
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
  ];
}

// Main dashboard endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const [health, services, agents] = await Promise.all([
      getSystemHealth(),
      getServicesStatus(),
      getOpenClawAgents()
    ]);

    const data: DashboardData = {
      uplinkTime: now.toISOString(),
      
      stats: {
        totalAgents: agents.length,
        activeSessions: 14,
        costToday: 0.41,
        tokensToday: 190292,
        tasksCompletedToday: 12
      },

      systemHealth: health,
      services,
      agents,

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

    res.json(data);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Halt agent endpoint
app.post('/api/agents/:id/halt', async (req, res) => {
  const { id } = req.params;
  console.log(`Halt requested for agent: ${id}`);
  // TODO: Implement actual halt via OpenClaw API
  res.json({ success: true, message: `Agent ${id} halt signal sent` });
});

// Trigger protocol endpoint
app.post('/api/protocols/trigger', async (req, res) => {
  const { protocolId, protocolName } = req.body;
  console.log(`Protocol triggered: ${protocolName || protocolId}`);
  // TODO: Implement actual protocol execution
  res.json({ success: true, message: `Protocol ${protocolName || protocolId} triggered` });
});

app.listen(PORT, () => {
  console.log(`✅ NB Studio Backend running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});
