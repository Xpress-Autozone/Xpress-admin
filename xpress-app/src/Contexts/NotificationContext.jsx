import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [hasNewInquiries, setHasNewInquiries] = useState(false);

  // Simulation: Trigger a notification dot after 5 seconds to show it works
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewInquiries(true);
      console.log('New inquiry received! (Simulated)');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const clearNotifications = () => {
    setHasNewInquiries(false);
  };

  return (
    <NotificationContext.Provider value={{ hasNewInquiries, setHasNewInquiries, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    // Return placeholder to prevent app crash as requested
    return {
      hasNewInquiries: false,
      setHasNewInquiries: () => {},
      clearNotifications: () => {}
    };
  }
  return context;
};
