import React from 'react';
import ProductList from '../../../Components/Ui/ProductList/productList';

const ElectricalComponents = () => {

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
      title='ElectricalComponents'
      data={itemList}
      onAddItem={handleAddItem}
      onEditItem={handleEditItem}
      onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default ElectricalComponents;