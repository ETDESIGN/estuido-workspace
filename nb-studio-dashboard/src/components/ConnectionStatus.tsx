'use client';

import { ConnectionStatus } from '@/hooks/useDashboardStream';

interface ConnectionStatusIndicatorProps {
  status: ConnectionStatus;
  onReconnect?: () => void;
}

export function ConnectionStatusIndicator({ status, onReconnect }: ConnectionStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: '●',
          label: 'Live',
          bgColor: 'bg-emerald-900/50',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-800',
          pulseColor: 'bg-emerald-500',
          showReconnect: false
        };
      case 'connecting':
        return {
          icon: '○',
          label: 'Connecting...',
          bgColor: 'bg-yellow-900/50',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-800',
          pulseColor: 'bg-yellow-500',
          showReconnect: false
        };
      case 'error':
        return {
          icon: '●',
          label: 'Disconnected',
          bgColor: 'bg-red-900/50',
          textColor: 'text-red-400',
          borderColor: 'border-red-800',
          pulseColor: 'bg-red-500',
          showReconnect: true
        };
      default:
        return {
          icon: '○',
          label: 'Offline',
          bgColor: 'bg-zinc-900/50',
          textColor: 'text-zinc-400',
          borderColor: 'border-zinc-800',
          pulseColor: 'bg-zinc-500',
          showReconnect: true
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
      border ${config.borderColor} ${config.bgColor} ${config.textColor}
      transition-all duration-300
    `}>
      {/* Pulse animation for connected state */}
      {status === 'connected' && (
        <span className={`
          relative flex h-2 w-2
        `}>
          <span className={`
            animate-ping absolute inline-flex h-full w-full rounded-full
            ${config.pulseColor} opacity-75
          `}></span>
          <span className={`
            relative inline-flex rounded-full h-2 w-2
            ${config.pulseColor}
          `}></span>
        </span>
      )}
      
      {/* Static indicator for other states */}
      {status !== 'connected' && (
        <span className={`text-lg ${config.textColor}`}>{config.icon}</span>
      )}
      
      <span>{config.label}</span>
      
      {/* Reconnect button */}
      {config.showReconnect && onReconnect && (
        <button
          onClick={onReconnect}
          className="ml-1 text-xs underline hover:text-white transition-colors"
          title="Reconnect to dashboard"
        >
          Retry
        </button>
      )}
    </div>
  );
}
