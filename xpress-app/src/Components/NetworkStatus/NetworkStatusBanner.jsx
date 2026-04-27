import React from 'react';
import { CheckCircle, WifiOff, X } from 'lucide-react';
import { useNetworkStatus } from '../../Contexts/NetworkStatusContext';

const NetworkStatusBanner = () => {
  const { isFullyConnected, showReconnected, dismissReconnected } = useNetworkStatus();

  // Show the "back online" toast when reconnected
  if (showReconnected) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] animate-in slide-in-from-top-4 fade-in duration-500">
        <div className="flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl shadow-green-900/30 border border-green-500/50">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-bold">Connection restored — you're back online</span>
          <button
            onClick={dismissReconnected}
            className="ml-2 p-0.5 rounded-md hover:bg-green-700/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Show a subtle warning bar when offline but not fully blocking (e.g., intermittent)
  // The full OfflinePage handles the complete offline state, so this is a no-op when isFullyConnected is false
  return null;
};

export default NetworkStatusBanner;
