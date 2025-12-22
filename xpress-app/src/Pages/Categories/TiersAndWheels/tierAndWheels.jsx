import React from 'react';
import ProductList from '../../../Components/Ui/ProductList/productList';
import { useNavigate } from 'react-router-dom';
import useProductsByCategory from '../../../hooks/useProductsByCategory';
import LoadingSpinner from '../../../Components/LoadingSpinner';
import EmptyState from '../../../Components/EmptyState';

const TiresWheels = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProductsByCategory('tires');

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
        <EmptyState categoryName="Tires and Wheels" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProductList
        title='Tires and Wheels'
        data={products}
        onAddItem={() => navigate("/add-products")}
        onEditItem={(item) => console.log('[TiresWheels] Edit item:', item)}
        onDeleteItem={(item) => console.log('[TiresWheels] Delete item:', item)}
      />
    </div>
  );
};

export default TiresWheels;