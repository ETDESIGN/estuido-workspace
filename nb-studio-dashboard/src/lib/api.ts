// API client for dashboard data
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export interface DashboardData {
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
  agents: Array<{
    id: string;
    name: string;
    role: string;
    model: string;
    status: string;
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
  }>;
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

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE}/api/dashboard`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }
  
  return response.json();
}
