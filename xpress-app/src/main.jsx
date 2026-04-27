import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./MainLayout/mainlayout";
import { AuthProvider } from "./Contexts/authContext";
import { NotificationProvider } from "./Contexts/NotificationContext";
import { NetworkStatusProvider } from "./Contexts/NetworkStatusContext";
import NetworkGuard from "./Components/NetworkStatus/NetworkGuard";
import { Provider } from "react-redux";
import { store } from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <NetworkStatusProvider>
        <NetworkGuard>
          <AuthProvider>
            <NotificationProvider>
              <MainLayout />
            </NotificationProvider>
          </AuthProvider>
        </NetworkGuard>
      </NetworkStatusProvider>
    </Provider>
  </StrictMode>
);
