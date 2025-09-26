// EngineParts.jsx
import React from 'react';
import ProductList from '../../../Components/Ui/ProductList/productList';

import { useNavigate} from 'react-router-dom';

  


const EngineParts = () => {
  const navigate = useNavigate();

  const itemList = [
  
  {
    id: 1,
    itemName: "Spark Plug",
    price: 25.99,
    quantity: 100,
    vendorName: "Sparky Co.",
    datePosted: "2023-10-27",
  },
  {
    id: 2,
    itemName: "Air Filter",
    price: 15.5,
    quantity: 50,
    vendorName: "Fresh Air Inc.",
    datePosted: "2023-10-26",
  },
  {
    id: 3,
    itemName: "Oil Filter",
    price: 12.0,
    quantity: 250,
    vendorName: "Pure Oil Systems",
    datePosted: "2023-10-25",
  },
  {
    id: 4,
    itemName: "Piston Set",
    price: 150.75,
    quantity: 20,
    vendorName: "Power Pistons Ltd.",
    datePosted: "2023-10-24",
  },
  {
    id: 5,
    itemName: "Timing Belt",
    price: 45.0,
    quantity: 75,
    vendorName: "Dura-Belt",
    datePosted: "2023-10-23",
  },
  {
    id: 6,
    itemName: "Gasket Set",
    price: 89.99,
    quantity: 30,
    vendorName: "Seal Pro",
    datePosted: "2023-10-22",
  },
  {
    id: 7,
    itemName: "Fuel Pump",
    price: 125.0,
    quantity: 15,
    vendorName: "Flow Tech",
    datePosted: "2023-10-21",
  },
  {
    id: 8,
    itemName: "Radiator",
    price: 220.0,
    quantity: 10,
    vendorName: "CoolCore Systems",
    datePosted: "2023-10-20",
  },
  {
    id: 9,
    itemName: "Alternator",
    price: 175.5,
    quantity: 18,
    vendorName: "Volt Supplies",
    datePosted: "2023-10-19",
  },
  {
    id: 10,
    itemName: "Starter Motor",
    price: 199.99,
    quantity: 12,
    vendorName: "Ignite Motors",
    datePosted: "2023-10-18",
  },
  {
    id: 11,
    itemName: "Cylinder Head",
    price: 320.0,
    quantity: 8,
    vendorName: "EngineCraft",
    datePosted: "2023-10-17",
  },
  {
    id: 12,
    itemName: "Valve Kit",
    price: 95.25,
    quantity: 40,
    vendorName: "Precision Parts",
    datePosted: "2023-10-16",
  },
  {
    id: 13,
    itemName: "Camshaft",
    price: 260.0,
    quantity: 14,
    vendorName: "Motion Tech",
    datePosted: "2023-10-15",
  },
  {
    id: 14,
    itemName: "Crankshaft",
    price: 480.0,
    quantity: 6,
    vendorName: "Torque Systems",
    datePosted: "2023-10-14",
  },
  {
    id: 15,
    itemName: "Water Pump",
    price: 110.0,
    quantity: 22,
    vendorName: "HydroFlow",
    datePosted: "2023-10-13",
  },
  {
    id: 16,
    itemName: "Clutch Kit",
    price: 299.99,
    quantity: 17,
    vendorName: "Grip Masters",
    datePosted: "2023-10-12",
  },
  {
    id: 17,
    itemName: "Exhaust Manifold",
    price: 210.5,
    quantity: 9,
    vendorName: "EcoFlow Exhausts",
    datePosted: "2023-10-11",
  },
  {
    id: 18,
    itemName: "Turbocharger",
    price: 650.0,
    quantity: 5,
    vendorName: "Boosted Power",
    datePosted: "2023-10-10",
  },
  {
    id: 19,
    itemName: "Fuel Injector",
    price: 130.0,
    quantity: 35,
    vendorName: "Precision Fuel",
    datePosted: "2023-10-09",
  },
  {
    id: 20,
    itemName: "Ignition Coil",
    price: 60.0,
    quantity: 60,
    vendorName: "Spark Systems",
    datePosted: "2023-10-08",
  },
  {
    id: 21,
    itemName: "Throttle Body",
    price: 180.0,
    quantity: 13,
    vendorName: "AirFlow Tech",
    datePosted: "2023-10-07",
  },
  {
    id: 22,
    itemName: "Muffler",
    price: 95.0,
    quantity: 25,
    vendorName: "Silent Ride",
    datePosted: "2023-10-06",
  },
  {
    id: 23,
    itemName: "Drive Shaft",
    price: 340.0,
    quantity: 7,
    vendorName: "Torque Drive",
    datePosted: "2023-10-05",
  },
  {
    id: 24,
    itemName: "Head Gasket",
    price: 75.0,
    quantity: 45,
    vendorName: "Seal Pro",
    datePosted: "2023-10-04",
  },
  {
    id: 25,
    itemName: "Engine Mount",
    price: 55.0,
    quantity: 28,
    vendorName: "Stabilize Ltd.",
    datePosted: "2023-10-03",
  },
];



  const handleAddItem = () => {
    // Navigate to add item form

  };

  const handleEditItem = (item) => {
    // Navigate to edit item form with item details
  };

  const handleDeleteItem = (item) => {
    // Handle item deletion
  }



  return (
      <div className="p-6">
      <ProductList
      title='Engine Parts'
      data={itemList}
      onAddItem={() => navigate("/add-products")}
      onEditItem={handleEditItem}
      onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default EngineParts;