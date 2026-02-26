// api.ts - Frontend connector for NB Studio Backend
// Copy this file to: src/lib/api.ts (in your Vite/React frontend)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Types matching backend response
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

// Fetch dashboard data from backend
export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Health check
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return response.json();
}

// Halt an agent
export async function haltAgent(agentId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}/halt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

// Trigger a protocol
export async function triggerProtocol(protocolId: string, protocolName?: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/protocols/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ protocolId, protocolName })
  });
  return response.json();
}

// Example usage with SWR (if you use SWR):
// import useSWR from 'swr';
// const { data, error, isLoading } = useSWR('/api/dashboard', fetchDashboardData, {
//   refreshInterval: 5000, // Poll every 5 seconds
// });

// Example usage with useEffect (if you don't use SWR):
// const [data, setData] = useState<DashboardData | null>(null);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState<Error | null>(null);
//
// useEffect(() => {
//   const loadData = async () => {
//     try {
//       const dashboardData = await fetchDashboardData();
//       setData(dashboardData);
//     } catch (err) {
//       setError(err as Error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   
//   loadData();
//   const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
//   return () => clearInterval(interval);
// }, []);
