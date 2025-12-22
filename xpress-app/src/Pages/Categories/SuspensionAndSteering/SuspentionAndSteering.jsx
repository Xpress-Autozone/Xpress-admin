import React, { useState } from "react";
import ProductList from "../../../Components/Ui/ProductList/productList";
import { useNavigate } from "react-router-dom";
import useProductsByCategory from "../../../hooks/useProductsByCategory";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import EmptyState from "../../../Components/EmptyState";

const SuspensionAndSteering = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const { products, loading, error } = useProductsByCategory("suspension", refreshKey);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" color="yellow" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading products: {error}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-6">
        <EmptyState categoryName="Suspension and Steering" />
      </div>
    );
  }

  const handleDeleteItem = (item) => {
    console.log('[SuspensionAndSteering] Item deleted, refreshing list');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <ProductList
        title="Suspension and Steering"
        data={products}
        onAddItem={() => navigate("/add-products")}
        onEditItem={(item) =>
          console.log("[SuspensionAndSteering] Edit item:", item)
        }
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default SuspensionAndSteering;