import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideBar from '../Components/SideBar/siderBar';
import Navbar from '../Components/NavBar/navBar';
import ProtectedRoute from '../Components/ProtectedRoute/protectedRoute';

// Import all your page components
import Overview from '../Pages/Dashboard/OverView/Overview';
import EngineParts from '../Pages/Categories/EngineParts/engineParts';
import SuspensionSteering from '../Pages/Categories/SuspensionAndSteering/SuspentionAndSteering';
import ElectricalComponents from '../Pages/Categories/ElectricalComponents/electricalComponents';
import TiresWheels from '../Pages/Categories/TiersAndWheels/tierAndWheels';
import Brakes from '../Pages/Categories/Brakes/brakes';
import ExhaustSystems from '../Pages/Categories/ExhaustSystems/exhaustSystem';
import InteriorAccessories from '../Pages/Categories/InteriorAccessories/interiorAccessories';
import ExteriorAccessories from '../Pages/Categories/ExteriorAccessories/exteriorAccessories';
import AddProduct from '../Pages/Products/product';
import Vendors from '../Pages/Vendors/vendors';
import AddVendors from '../Pages/Vendors/addVendors';

function DashboardLayout() {
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
              <Route path="/engine-parts" element={<EngineParts />} />
              <Route path="/suspension-steering" element={<SuspensionSteering />} />
              <Route path="/electrical-components" element={<ElectricalComponents />} />
              <Route path="/tires-wheels" element={<TiresWheels />} />
              <Route path="/brakes" element={<Brakes />} />
              <Route path="/exhaust-systems" element={<ExhaustSystems />} />
              <Route path="/interior-accessories" element={<InteriorAccessories />} />
              <Route path="/exterior-accessories" element={<ExteriorAccessories />} />
              <Route path="/add-products" element={<AddProduct/>} />
              <Route path="/vendors" element={<Vendors/>} />
              <Route path="/add-vendors" element={<AddVendors/>} />
            </Routes>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default DashboardLayout;