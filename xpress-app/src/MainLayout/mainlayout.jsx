import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home/home";
import LoginPage from "../Pages/Auth/Login/login";
import AddProduct from "../Pages/Products/product";
// import Dashboard from "../Pages/Dashboard/dashboard";
// import Overview from "../Pages/Dashboard/Overview/overview";
// import EngineParts from "../Pages/Categories/EngineParts/engineParts";
// import SuspensionSteering from "../Pages/Categories/SuspensionAndSteering/suspensionSteering";
// import ElectricalComponents from "../Pages/Categories/ElectricalComponents/electricalComponents";
// import TiresWheels from "../Pages/Categories/TiersAndWheels/tiresWheels";
// import Brakes from "../Pages/Categories/Brakes/brakes";
// import ExhaustSystems from "../Pages/Categories/ExhaustSystems/exhaustSystems";
// import InteriorAccessories from "../Pages/Categories/InteriorAccessories/interiorAccessories";
// import ExteriorAccessories from "../Pages/Categories/ExteriorAccessories/exteriorAccessories";

const MainLayout = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/home/*" element={<Home/>} />
                <Route path="/add-products" element={<AddProduct/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default MainLayout;