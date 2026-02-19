import React, { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AlertModal from "../../components/AlertModal";
import LoadingSpinner from "../../components/LoadingSpinner";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    vendorId: "",
    price: "",
    condition: "new",
    quantity: "",
    description: "",
    category: "",
    priority: 1,
    displayOnPage: true,
  });
  const { user, token } = useSelector((state) => state.auth);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              url: e.target.result,
              name: file.name,
              file: file,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const showAlert = (type, title, message) => {
    setAlert({ isOpen: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ ...alert, isOpen: false });
  };

  const handleSubmit = async () => {
    if (!formData.itemName || !formData.price || !formData.quantity) {
      showAlert(
        "warning",
        "Missing Information",
        "Please fill in all required fields."
      );
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append("itemName", formData.itemName);
    data.append("vendorId", formData.vendorId);
    data.append("price", Number(formData.price));
    data.append("quantity", Number(formData.quantity));
    data.append("condition", formData.condition);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("priority", Number(formData.priority));
    data.append("displayOnPage", formData.displayOnPage);

    images.forEach((img, index) => {
      if (index === 0) {
        data.append("mainImage", img.file);
      } else {
        data.append("additionalImages", img.file);
      }
    });

    try {
      const response = await fetch(
        "https://xpress-backend-eeea.onrender.com/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Network response was not ok");
      }

      showAlert("success", "Success!", "Product added successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      showAlert("error", "Error", "Failed to add product: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex  mt-20">
      <div className=" p-6 h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleInputChange}
                      placeholder="e.g. Spark Plug"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor ID
                    </label>
                    <input
                      type="text"
                      name="vendorId"
                      value={formData.vendorId}
                      onChange={handleInputChange}
                      placeholder="e.g. 12345XYZ"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g. 25.99"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <input
                      type="text"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      placeholder="e.g. New"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g. 100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select category</option>
                      <option value="engine">Engine Parts</option>
                      <option value="brake">Brake System</option>
                      <option value="transmission">Transmission</option>
                      <option value="suspension">Suspension</option>
                      <option value="electrical">Electrical</option>
                      <option value="body">Body Parts</option>
                      <option value="interior">Interior</option>
                      <option value="tools">Tools</option>
                      <option value="accessories">Accessories</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Description
                </h2>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the car part..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none transition-colors"
                />
              </div>

              {/* Images Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Images</h2>
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-500 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-600 mb-2">
                        Add Images
                      </p>
                      <p className="text-sm text-gray-500">
                        Click here or drag and drop your images
                      </p>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-yellow-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    >
                      <option value="1">High</option>
                      <option value="2">Higher</option>
                      <option value="3">Highest</option>
                    </select>
                  </div>

                  {/* Display Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Display on Main Page
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="displayOnPage"
                          checked={formData.displayOnPage}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-400"></div>
                      </label>
                      <span className="text-sm font-medium text-gray-700">
                        {formData.displayOnPage ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
                >
                  {isLoading && <LoadingSpinner size="sm" color="gray" />}
                  <span>{isLoading ? "Adding Product..." : "Add Product"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default AddProduct;
