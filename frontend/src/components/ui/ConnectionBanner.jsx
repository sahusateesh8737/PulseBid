import React from 'react';
import { useSocket } from '../../context/SocketContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const ConnectionBanner = () => {
  const { connectionStatus, reconnectAttempts } = useSocket();

  if (connectionStatus === 'connected') {
    return null; // Silent when live connection is healthy
  }

  return (
    <div className="bg-zinc-950 border-b border-dark-border px-4 md:px-6 lg:px-8 py-2 text-xs font-mono transition-colors w-full">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {connectionStatus === 'reconnecting' && (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
              <span className="text-amber-300">
                WebSocket disconnected. Attempting to reconnect (Attempt #{reconnectAttempts})...
              </span>
            </>
          )}

          {connectionStatus === 'connecting' && (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />
              <span className="text-slate-300">Connecting to real-time auction cluster...</span>
            </>
          )}

          {connectionStatus === 'disconnected' && (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-slate-300">
                Offline Mode — Live updates paused (Backend WebSocket disconnected).
              </span>
            </>
          )}
        </div>

        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono shrink-0">
          STATE: <span className="text-slate-200 font-bold">{connectionStatus}</span>
        </div>
      </div>
    </div>
  );
};
