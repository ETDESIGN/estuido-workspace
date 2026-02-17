import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { StatsSection } from './components/StatsSection';
import { CostChart } from './components/CostChart';
import { TierDistributionChart } from './components/TierDistributionChart';
import { ModelUsageChart } from './components/ModelUsageChart';
import { ModelTable } from './components/ModelTable';
import { SessionsTable } from './components/SessionsTable';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-950 p-6 text-gray-100">
        <div className="mx-auto max-w-7xl">
          <Header />
          <StatsSection />
          
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CostChart />
            </div>
            <TierDistributionChart />
          </div>

          <div className="mb-8">
            <ModelUsageChart />
          </div>

          <div className="mb-8">
            <ModelTable />
          </div>

          <div className="mb-8">
            <SessionsTable />
          </div>

          <footer className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            <p>ESTUDIO AI Analytics Dashboard • Built with React + Recharts</p>
            <p className="mt-1">Tiered Intelligence: Pulse → Workhorse → Brain</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
