import React, { useState } from "react";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AlertModal from "../../Components/AlertModal";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { CATEGORIES } from "../../constants/categories";

import useVendors from "../../hooks/useVendors";

const AddProduct = () => {
  const navigate = useNavigate();
  const { vendors, loading: vendorsLoading } = useVendors();
  const [formData, setFormData] = useState({
    itemName: "",
    vendorId: "",
    price: "",
    condition: "new",
    stock: "",
    description: "",
    categoryId: "",
    brand: "",
    partNumber: "",
    specifications: [{ label: "", value: "" }],
    compatibility: [""],
    featured: false,
    newProduct: false,
    hotProduct: false,
    showOnHome: true,
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

  // Specification field handlers
  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const removeSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // Vehicle compatibility handlers
  const handleCompatChange = (index, value) => {
    const updated = [...formData.compatibility];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, compatibility: updated }));
  };

  const addCompat = () => {
    setFormData((prev) => ({
      ...prev,
      compatibility: [...prev.compatibility, ""],
    }));
  };

  const removeCompat = (index) => {
    setFormData((prev) => ({
      ...prev,
      compatibility: prev.compatibility.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.itemName || !formData.price || !formData.stock || !formData.categoryId) {
      showAlert(
        "warning",
        "Missing Information",
        "Please fill in all required fields (Name, Price, Stock, Category)."
      );
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append("itemName", formData.itemName);
    data.append("vendorId", formData.vendorId);
    data.append("price", Number(formData.price));
    data.append("quantity", Number(formData.stock));
    data.append("condition", formData.condition);
    data.append("description", formData.description);
    data.append("categoryId", formData.categoryId);
    data.append("brand", formData.brand);
    data.append("partNumber", formData.partNumber);
    data.append("specifications", JSON.stringify(formData.specifications.filter(s => s.label && s.value)));
    data.append("compatibility", JSON.stringify(formData.compatibility.filter(c => c)));
    data.append("featured", formData.featured);
    data.append("newProduct", formData.newProduct);
    data.append("hotProduct", formData.hotProduct);
    data.append("showOnHome", formData.showOnHome);

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
    <div className="flex mt-20">
      <div className="p-6 h-screen w-full">
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
                      Item Name *
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
                      Vendor *
                    </label>
                    <select
                      name="vendorId"
                      value={formData.vendorId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select Vendor</option>
                      {vendors.map(vendor => (
                        <option key={vendor.uid || vendor.id} value={vendor.uid || vendor.id}>
                          {vendor.displayName || vendor.userName || vendor.email}
                        </option>
                      ))}
                    </select>
                    {vendorsLoading && <p className="text-xs text-gray-400 mt-1">Loading vendors...</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (GHC) *
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
                      Stock Amount *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="e.g. 100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="e.g. Bosch"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Part Number
                    </label>
                    <input
                      type="text"
                      name="partNumber"
                      value={formData.partNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. XP-9001"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specifications Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Technical Specifications</h2>
                  <button
                    onClick={addSpec}
                    className="text-sm font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Spec
                  </button>
                </div>
                <div className="space-y-3">
                  {Array.isArray(formData.specifications) && formData.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                          placeholder="e.g. Voltage"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                          placeholder="e.g. 12V"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                        />
                      </div>
                      <button
                        onClick={() => removeSpec(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Compatibility Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Vehicle Compatibility</h2>
                  <button
                    onClick={addCompat}
                    className="text-sm font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Vehicle
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(formData.compatibility) && formData.compatibility.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleCompatChange(index, e.target.value)}
                        placeholder="e.g. Toyota Camry 2019-2022"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                      />
                      <button
                        onClick={() => removeCompat(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
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

              {/* Display Flags Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Display Settings (Xplore Page)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">New Arrival</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="newProduct"
                        checked={formData.newProduct}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Hot Product</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="hotProduct"
                        checked={formData.hotProduct}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Show on Home</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="showOnHome"
                        checked={formData.showOnHome}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
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
