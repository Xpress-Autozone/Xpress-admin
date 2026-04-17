import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./MainLayout/mainlayout";
import { AuthProvider } from "./Contexts/authContext";
import { NotificationProvider } from "./Contexts/NotificationContext";
import { Provider } from "react-redux";
import { store } from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <NotificationProvider>
          <MainLayout />
        </NotificationProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
