import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SideBar from '../../Components/SideBar/siderBar';
import Overview from '../Dashboard/OverView/Overview';
import EngineParts from '../Categories/EngineParts/engineParts';
import SuspensionSteering from '../Categories/SuspensionAndSteering/SuspentionAndSteering';
import ElectricalComponents from '../Categories/ElectricalComponents/electricalComponents';
import TiresWheels from '../Categories/TiersAndWheels/tierAndWheels';
import Brakes from '../Categories/Brakes/brakes';
import ExhaustSystems from '../Categories/ExhaustSystems/exhaustSystem';
import InteriorAccessories from '../Categories/InteriorAccessories/interiorAccessories';
import ExteriorAccessories from '../Categories/ExteriorAccessories/exteriorAccessories';
import AddProduct from '../Products/product';
import Vendors from '../Vendors/vendors';

function Home() {
  return (
    <div className="flex-1 flex h-screen">
        <div>
            <SideBar/>
        </div>
        <main className='flex-1 bg-gray-100 overflow-y-auto'>
            <Routes>
                {/* Default redirect to overview */}
                <Route path="/" element={<Navigate to="/home/overview" replace />} />
                
                {/* Main routes */}
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
            </Routes>
        </main>
    </div>
  )
}

export default Home;