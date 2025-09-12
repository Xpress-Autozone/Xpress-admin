import VenderList from "../../Components/Ui/VenderList/venderList";


const Vender = () => {
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
      <VenderList
      title='Venders'
      data={itemList}
      onAddItem={handleAddItem}
      onEditItem={handleEditItem}
      onDeleteItem={handleDeleteItem}
      />
    </div>
  );
}

export default Vender;