import { useEffect } from 'react';

/**
 * Hook to dynamically change the browser favicon based on notification status.
 * @param {boolean} hasNotifications - Whether to show the notification dot icon.
 */
const useFavicon = (hasNotifications) => {
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = hasNotifications ? '/favicon-notification.png' : '/favicon.png';
    }
  }, [hasNotifications]);
};

export default useFavicon;
