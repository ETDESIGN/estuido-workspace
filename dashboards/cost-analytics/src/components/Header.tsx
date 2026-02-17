import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Zap } from 'lucide-react';

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">ESTUDIO AI Analytics</h1>
          <p className="text-sm text-gray-400">Cost optimization dashboard for tiered intelligence</p>
        </div>
      </div>
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700/50"
      >
        {isDark ? (
          <>
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </>
        )}
      </button>
    </header>
  );
}
