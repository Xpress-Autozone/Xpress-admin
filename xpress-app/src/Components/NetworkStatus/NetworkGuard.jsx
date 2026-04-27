import React from 'react';
import { useNetworkStatus } from '../../Contexts/NetworkStatusContext';
import OfflinePage from './OfflinePage';
import NetworkStatusBanner from './NetworkStatusBanner';

/**
 * NetworkGuard wraps the app and shows the OfflinePage when the connection
 * is lost. When the connection comes back, it seamlessly restores the UI
 * and shows a brief "reconnected" toast via NetworkStatusBanner.
 */
const NetworkGuard = ({ children }) => {
  const { isFullyConnected } = useNetworkStatus();

  return (
    <>
      <NetworkStatusBanner />
      {isFullyConnected ? children : <OfflinePage />}
    </>
  );
};

export default NetworkGuard;
