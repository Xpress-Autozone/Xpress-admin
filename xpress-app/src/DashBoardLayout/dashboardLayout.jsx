import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideBar from '../Components/SideBar/siderBar';
import Navbar from '../Components/NavBar/navBar';
import ProtectedRoute from '../Components/ProtectedRoute/protectedRoute';

// Import all your page components
import Overview from '../Pages/Dashboard/OverView/Overview';
import AllProducts from '../Pages/Products/AllProducts';
import CategoryProducts from '../Pages/Categories/CategoryProducts';
import AddProduct from '../Pages/Products/product';
import EditProduct from '../Pages/Products/editProduct';
import Vendors from '../Pages/Vendors/vendors';
import AddVendors from '../Pages/Vendors/addVendors';
import AdminRoles from '../Pages/AdminRoles/AdminRoles';
import SystemAdmins from '../Pages/AdminRoles/SystemAdmins';
import EditVendor from '../Pages/Vendors/editVendors';
import Orders from '../Pages/Sales/Orders';
import Payments from '../Pages/Sales/Payments';
import Customers from '../Pages/Management/Customers/Customers';
import useFavicon from '../hooks/useFavicon';
import { useNotifications } from '../Contexts/NotificationContext';

function DashboardLayout() {
  const { hasNewInquiries } = useNotifications();
  
  // Update browser icon based on notification status
  useFavicon(hasNewInquiries);

  return (
    <ProtectedRoute>
      <div className="">
        {/* Navbar at the top */}
        <Navbar />

        <div className="flex">
          {/* Sidebar */}
          <SideBar />

          {/* Main content area */}
          <main className='flex-1 bg-gray-100 overflow-y-auto h-screen'>
            <Routes>
              {/* Default redirect to overview */}
              <Route path="/" element={<Navigate to="/overview" replace />} />

              {/* All your routes */}
              <Route path="/overview" element={<Overview />} />

              {/* Products Management */}
              <Route path="/products" element={<AllProducts />} />
              <Route path="/add-products" element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />


              {/* Other Routes */}
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/add-vendors" element={<AddVendors />} />
              <Route path="/edit-vendor/:id" element={<EditVendor />} />
              <Route path="/admin-management" element={<SystemAdmins />} />
              <Route path="/admin-roles" element={<AdminRoles />} />

              {/* Sales & Logistics */}
              <Route path="/orders" element={<Orders />} />
              <Route path="/accounting" element={<Payments />} />

              {/* CRM / User Management */}
              <Route path="/customers" element={<Customers />} />
            </Routes>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default DashboardLayout;
