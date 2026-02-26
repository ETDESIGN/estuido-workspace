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

export interface ChartDataPoint {
  time: string;
  tokens: number;
  cost: number;
}
