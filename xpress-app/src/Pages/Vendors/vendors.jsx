import VendorList from "../../Components/Ui/VendorList/vendorList";
import { useNavigate } from 'react-router-dom';
import useVendors from "../../hooks/useVendors";
import LoadingSpinner from "../../Components/LoadingSpinner";
import EmptyVendorState from "../../Components/EmptyVendorState";

const Vendor = () => {
  const navigate = useNavigate();
  const { vendors, loading, error, deleteVendor } = useVendors();

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
          Error loading vendors: {error}
        </div>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="p-6">
        <EmptyVendorState />
      </div>
    );
  }

  const handleDelete = async (item) => {
    const result = await deleteVendor(item.id);
    if (!result.success) {
      alert("Failed to delete vendor: " + result.error);
    }
  };

  return (
    <div className="p-6">
      <VendorList
        title='Vendors'
        data={vendors}
        onAddItem={() => navigate("/add-vendors")}
        onEditItem={(item) => navigate(`/edit-vendor/${item.id}`)}
        onDeleteItem={handleDelete}
      />
    </div>
  );
}

export default Vendor;