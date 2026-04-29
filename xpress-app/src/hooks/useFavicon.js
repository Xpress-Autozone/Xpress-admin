import { useEffect } from 'react';

/**
 * Hook to dynamically change the browser favicon based on notification status.
 * @param {string|null} notificationColor - The color of the notification dot ('red', 'yellow', 'green', 'blue').
 */
const useFavicon = (notificationColor) => {
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) return;

    if (!notificationColor) {
      favicon.href = '/favicon.png';
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = '/favicon.png';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 32, 32);

      // Draw notification dot
      const colors = {
        'red': '#EF4444',
        'yellow': '#F59E0B',
        'green': '#10B981',
        'blue': '#3B82F6'
      };

      ctx.beginPath();
      ctx.arc(24, 24, 6, 0, 2 * Math.PI);
      ctx.fillStyle = colors[notificationColor] || '#EF4444';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      favicon.href = canvas.toDataURL('image/png');
    };
  }, [notificationColor]);
};

export default useFavicon;
