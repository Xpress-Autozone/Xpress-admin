import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideBar from '../Components/SideBar/siderBar';
import Navbar from '../Components/NavBar/navBar';
import ProtectedRoute from '../Components/ProtectedRoute/protectedRoute';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../orderSlice';

// Import all your page components
import { useNotifications } from '../Contexts/NotificationContext';
import LoadingSpinner from '../Components/LoadingSpinner';

// Lazy load all page components
const Overview = React.lazy(() => import('../Pages/Dashboard/OverView/Overview'));
const AllProducts = React.lazy(() => import('../Pages/Products/AllProducts'));
const CategoryProducts = React.lazy(() => import('../Pages/Categories/CategoryProducts'));
const AddProduct = React.lazy(() => import('../Pages/Products/product'));
const EditProduct = React.lazy(() => import('../Pages/Products/editProduct'));
const Vendors = React.lazy(() => import('../Pages/Vendors/vendors'));
const AddVendors = React.lazy(() => import('../Pages/Vendors/addVendors'));
const EditVendor = React.lazy(() => import('../Pages/Vendors/editVendors'));
const AdminRoles = React.lazy(() => import('../Pages/AdminRoles/AdminRoles'));
const SystemAdmins = React.lazy(() => import('../Pages/AdminRoles/SystemAdmins'));
const Orders = React.lazy(() => import('../Pages/Sales/Orders'));
const Payments = React.lazy(() => import('../Pages/Sales/Payments'));
const Customers = React.lazy(() => import('../Pages/Management/Customers/Customers'));

import useFavicon from '../hooks/useFavicon';

function DashboardLayout() {
  const dispatch = useDispatch();
  const { notificationDot } = useSelector((state) => state.orders);
  
  // Update browser icon based on notification status
  useFavicon(notificationDot);

  // Fetch orders and poll every minute
  React.useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 10 }));
    
    const interval = setInterval(() => {
      dispatch(fetchOrders({ page: 1, limit: 10 }));
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);
  const isVendor = user?.role === 'vendor';

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
            <React.Suspense fallback={
              <div className="flex items-center justify-center min-h-full p-20">
                <LoadingSpinner size="lg" color="yellow" />
              </div>
            }>
              <Routes>
                {/* Default redirect based on role */}
                <Route path="/" element={<Navigate to={isVendor ? "/products" : "/overview"} replace />} />

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
            </React.Suspense>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default DashboardLayout;
