import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CloudOff, Signal, Zap } from 'lucide-react';
import { useNetworkStatus } from '../../Contexts/NetworkStatusContext';

const OfflinePage = () => {
  const { isOnline, isApiReachable, retryConnection } = useNetworkStatus();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  // Determine the specific error state
  const isDeviceOffline = !isOnline;
  const isServerDown = isOnline && !isApiReachable;

  const handleRetry = async () => {
    setIsRetrying(true);
    setPulseKey(prev => prev + 1);
    await retryConnection();
    setRetryCount(prev => prev + 1);
    // Small delay so user sees the animation
    setTimeout(() => setIsRetrying(false), 1200);
  };

  // Floating particles effect data
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-yellow-500/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Radial glow behind icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-yellow-500/[0.04] blur-[120px]" />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        {/* Icon with pulse ring */}
        <div className="relative inline-flex items-center justify-center mb-10">
          {/* Outer pulse rings */}
          <div key={`ring1-${pulseKey}`} className="absolute w-32 h-32 rounded-full border border-yellow-500/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div key={`ring2-${pulseKey}`} className="absolute w-24 h-24 rounded-full border border-yellow-500/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />

          {/* Icon container */}
          <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${isDeviceOffline ? 'from-red-500/20 to-red-600/10 border-red-500/30' : 'from-yellow-500/20 to-amber-600/10 border-yellow-500/30'} border backdrop-blur-sm flex items-center justify-center shadow-2xl`}>
            {isDeviceOffline ? (
              <WifiOff className="w-9 h-9 text-red-400" strokeWidth={1.5} />
            ) : (
              <CloudOff className="w-9 h-9 text-yellow-400" strokeWidth={1.5} />
            )}
          </div>
        </div>

        {/* Status label */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-6 ${isDeviceOffline ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isDeviceOffline ? 'bg-red-400' : 'bg-yellow-400'} animate-pulse`} />
          {isDeviceOffline ? 'No Internet Connection' : 'Server Unreachable'}
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-[1.1]">
          {isDeviceOffline ? (
            <>You're <span className="text-red-400">Offline</span></>
          ) : (
            <>Service <span className="text-yellow-400">Interrupted</span></>
          )}
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-10 font-medium">
          {isDeviceOffline ? (
            <>
              It looks like your device lost its internet connection.
              Check your Wi-Fi or mobile data and we'll reconnect automatically
              once you're back online.
            </>
          ) : (
            <>
              We're having trouble reaching the Xpress servers right now.
              This is usually temporary — the server might be waking up
              or undergoing maintenance. Hang tight.
            </>
          )}
        </p>

        {/* Retry button */}
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 overflow-hidden ${
            isRetrying
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.25)] hover:scale-[1.02] active:scale-95'
          }`}
        >
          {/* Button shimmer effect */}
          {!isRetrying && (
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          )}

          <RefreshCw className={`w-4 h-4 relative z-10 ${isRetrying ? 'animate-spin' : ''}`} />
          <span className="relative z-10">
            {isRetrying ? 'Checking Connection...' : 'Try Again'}
          </span>
        </button>

        {/* Retry hint */}
        {retryCount > 0 && !isRetrying && (
          <p className="mt-4 text-gray-600 text-xs font-medium animate-in fade-in duration-500">
            Attempted {retryCount} {retryCount === 1 ? 'retry' : 'retries'} · Auto-checking every 15 seconds
          </p>
        )}

        {/* Helpful tips */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            {
              icon: <Signal className="w-4 h-4" />,
              title: 'Check Connection',
              text: 'Verify your Wi-Fi or cellular data is active.',
            },
            {
              icon: <RefreshCw className="w-4 h-4" />,
              title: 'Refresh Browser',
              text: 'Try a hard refresh with Ctrl + Shift + R.',
            },
            {
              icon: <Zap className="w-4 h-4" />,
              title: 'Auto-Reconnect',
              text: "We'll restore your session automatically.",
            },
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500/70">
                {tip.icon}
              </div>
              <div>
                <p className="text-white/80 text-xs font-bold mb-0.5">{tip.title}</p>
                <p className="text-gray-500 text-[11px] leading-relaxed">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer brand */}
        <div className="mt-16 flex items-center justify-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">
            Xpress Autozone Admin
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-[10px] font-medium text-gray-700">
            v2.0
          </span>
        </div>
      </div>

      {/* CSS for floating particles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { transform: translateY(-30px) translateX(15px); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default OfflinePage;
