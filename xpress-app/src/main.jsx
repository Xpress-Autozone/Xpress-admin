import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./MainLayout/mainlayout";
import { AuthProvider } from "./Contexts/authContext";
import { Provider } from "react-redux";
import { store } from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </Provider>
  </StrictMode>
);
