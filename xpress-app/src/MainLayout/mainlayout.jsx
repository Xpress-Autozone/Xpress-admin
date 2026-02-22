// MainLayout.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../Pages/Auth/Login/login";
import DashboardLayout from "../DashBoardLayout/dashboardLayout"; // New component we'll create

const MainLayout = () => {
    return (
        <BrowserRouter basename="/admin/">
            <Routes>
                {/* Public routes (no navbar) */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes with navbar and sidebar */}
                <Route path="/*" element={<DashboardLayout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default MainLayout;