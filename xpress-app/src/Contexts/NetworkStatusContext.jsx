import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../config/api';

const NetworkStatusContext = createContext();

export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within a NetworkStatusProvider');
  }
  return context;
}

export function NetworkStatusProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isApiReachable, setIsApiReachable] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const checkIntervalRef = useRef(null);

  // Lightweight ping to verify API reachability
  const checkApiHealth = useCallback(async (retryCount = 3) => {
    if (!navigator.onLine) {
      setIsApiReachable(false);
      return false;
    }

    const attempt = async (count) => {
      try {
        const controller = new AbortController();
        // Increase timeout to 15s for Render cold starts
        const timeout = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeout);
        
        // Any response from our server (even 4xx) means the server is reachable
        const reachable = response.status >= 200 && response.status < 500;
        if (reachable) {
          setIsApiReachable(true);
          return true;
        }
        throw new Error("Unreachable");
      } catch (err) {
        if (count > 1) {
          // Wait 2s before retrying
          await new Promise(r => setTimeout(r, 2000));
          return attempt(count - 1);
        }
        setIsApiReachable(false);
        return false;
      }
    };

    return attempt(retryCount);
  }, []);

  // Handle browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Check API reachability when coming back online
      checkApiHealth().then((reachable) => {
        if (reachable && wasOffline) {
          setShowReconnected(true);
          setWasOffline(false);
          setTimeout(() => setShowReconnected(false), 4000);
        }
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsApiReachable(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkApiHealth, wasOffline]);

  // Periodic API health check (every 30s when offline, every 60s when online)
  useEffect(() => {
    const interval = (!isOnline || !isApiReachable) ? 15000 : 60000;

    checkIntervalRef.current = setInterval(() => {
      checkApiHealth();
    }, interval);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isOnline, isApiReachable, checkApiHealth]);

  // Initial health check on mount
  useEffect(() => {
    checkApiHealth();
  }, [checkApiHealth]);

  // Track when transitioning to offline
  useEffect(() => {
    if (!isOnline || !isApiReachable) {
      setWasOffline(true);
    }
  }, [isOnline, isApiReachable]);

  const dismissReconnected = useCallback(() => {
    setShowReconnected(false);
  }, []);

  const retryConnection = useCallback(async () => {
    const result = await checkApiHealth();
    if (result && wasOffline) {
      setShowReconnected(true);
      setWasOffline(false);
      setTimeout(() => setShowReconnected(false), 4000);
    }
    return result;
  }, [checkApiHealth, wasOffline]);

  const value = {
    isOnline,
    isApiReachable,
    isFullyConnected: isOnline && isApiReachable,
    showReconnected,
    dismissReconnected,
    retryConnection,
  };

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}
