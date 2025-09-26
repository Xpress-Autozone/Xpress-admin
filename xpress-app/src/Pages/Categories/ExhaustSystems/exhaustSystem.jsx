import React from 'react';
import ProductList from '../../../Components/Ui/ProductList/productList';
import { useNavigate} from 'react-router-dom';

const ExhaustSystems = () => {
  const navigate = useNavigate();
  const itemList = [
    {}
  ]

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
      title='ExhaustSystems'
      data={itemList}
      onAddItem={()=>navigate("/add-products")}
      onEditItem={handleEditItem}
      onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default ExhaustSystems;