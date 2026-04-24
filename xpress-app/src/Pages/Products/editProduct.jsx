import React, { useState, useEffect } from "react";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AlertModal from "../../Components/AlertModal";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { CATEGORIES } from "../../constants/categories";
import { updateProduct } from "../../productSlice";
import useVendors from "../../hooks/useVendors";
import { API_BASE_URL } from "../../config/api";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.products);

    const { vendors, loading: vendorsLoading } = useVendors();
    const [formData, setFormData] = useState({
        itemName: "",
        vendorId: "",
        price: "",
        condition: "new",
        stock: "",
        lowStockThreshold: "",
        description: "",
        categoryId: "",
        brand: "",
        partNumber: "",
        specifications: [{ label: "", value: "" }],
        compatibility: [""],
        tags: [],
        featured: false,
        newProduct: false,
        hotProduct: false,
        showOnHome: true,
    });

    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [alert, setAlert] = useState({
        isOpen: false,
        type: "info",
        title: "",
        message: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products/${id}`);
                const result = await response.json();

                    if (response.ok && result.data) {
                    const product = result.data;

                    // VENDOR SCOPING: Prevent vendors from accessing other's products
                    if (user?.role === 'vendor' && product.vendorId !== user.uid) {
                        showAlert("error", "Access Denied", "You do not have permission to edit this product.");
                        setTimeout(() => navigate('/products'), 2000);
                        return;
                    }

                    setFormData({
                        itemName: product.itemName || "",
                        vendorId: product.vendorId || "",
                        price: product.price || "",
                        condition: product.condition || "new",
                        stock: product.stock || product.quantity || "", // Handle migration
                        lowStockThreshold: product.lowStockThreshold || "",
                        description: product.description || "",
                        categoryId: product.categoryId || product.category || "", // Handle migration
                        brand: product.brand || "",
                        partNumber: product.partNumber || "",
                        specifications: Array.isArray(product.specifications) ? product.specifications : [{ label: "", value: "" }],
                        compatibility: Array.isArray(product.compatibility) ? product.compatibility : [""],
                        tags: Array.isArray(product.tags) ? product.tags : [],
                        featured: product.featured || false,
                        newProduct: product.newProduct || false,
                        hotProduct: product.hotProduct || false,
                        showOnHome: product.showOnHome !== undefined ? product.showOnHome : true,
                    });

                    if (product.mainImage) {
                        const mainImageUrl = typeof product.mainImage === 'object' ? product.mainImage.url : product.mainImage;
                        setExistingImages([{ id: 'main', url: mainImageUrl, type: 'main' }]);
                    }
                    if (product.additionalImages && product.additionalImages.length > 0) {
                        setExistingImages(prev => [
                            ...prev,
                            ...product.additionalImages.map((img, i) => ({
                                id: `additional-${i}`,
                                url: typeof img === 'object' ? img.url : img,
                                type: 'additional'
                            }))
                        ]);
                    }
                } else {
                    showAlert("error", "Error", "Failed to fetch product details");
                }
            } catch (error) {
                showAlert("error", "Error", "Error fetching product: " + error.message);
            } finally {
                setIsFetching(false);
            }
        };

        fetchProduct();
    }, [id]);

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

    const removeNewImage = (id) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const removeExistingImage = (id) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== id));
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

    // Tag Handlers
    const handleAddTag = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async () => {
        if (!formData.itemName || !formData.price || !formData.stock || !formData.categoryId || !formData.vendorId) {
            showAlert(
                "warning",
                "Missing Information",
                "Please fill in all required fields (Name, Price, Stock, Category, and Vendor)."
            );
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append("itemName", formData.itemName);
        data.append("vendorId", formData.vendorId);
        data.append("price", Number(formData.price));
        data.append("quantity", Number(formData.stock)); // Backend expects 'quantity'
        data.append("lowStockThreshold", Number(formData.lowStockThreshold || Math.floor(Number(formData.stock) * 0.1)));
        data.append("condition", formData.condition);
        data.append("description", formData.description);
        data.append("category", formData.categoryId); // Backend expects 'category'
        data.append("categoryId", formData.categoryId); // Backend might use 'categoryId'
        data.append("brand", formData.brand);
        data.append("partNumber", formData.partNumber);
        data.append("specifications", JSON.stringify(formData.specifications.filter(s => s.label && s.value)));
        data.append("compatibility", JSON.stringify(formData.compatibility.filter(c => c.make && c.model)));
        data.append("tags", JSON.stringify(formData.tags));
        data.append("featured", formData.featured);
        data.append("newProduct", formData.newProduct);
        data.append("hotProduct", formData.hotProduct);
        data.append("showOnHome", formData.showOnHome);

        // Only append new images if any
        images.forEach((img, index) => {
            if (index === 0 && existingImages.length === 0) {
                data.append("mainImage", img.file);
            } else {
                data.append("additionalImages", img.file);
            }
        });

        // Handle existing images state for granular deletion in backend
        const mainImage = existingImages.find(img => img.type === 'main');
        const additionalImages = existingImages.filter(img => img.type === 'additional');

        data.append("existingMainImage", mainImage ? JSON.stringify(mainImage) : "null");
        data.append("existingAdditionalImages", JSON.stringify(additionalImages));

        try {
            const actionResult = await dispatch(updateProduct({ id, productData: data }));

            if (updateProduct.fulfilled.match(actionResult)) {
                showAlert("success", "Success!", "Product updated successfully!");
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            } else {
                throw new Error(actionResult.payload || "Failed to update product");
            }
        } catch (error) {
            showAlert("error", "Error", "Failed to update product: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index][field] = value;
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };

    const addSpec = () => {
        setFormData(prev => ({
            ...prev,
            specifications: [...prev.specifications, { label: "", value: "" }]
        }));
    };

    const removeSpec = (index) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }));
    };

    const handleCompatChange = (index, field, value) => {
        const newCompat = [...formData.compatibility];
        newCompat[index][field] = value;
        setFormData(prev => ({ ...prev, compatibility: newCompat }));
    };

    const addCompat = () => {
        setFormData(prev => ({
            ...prev,
            compatibility: [...prev.compatibility, { make: "", model: "", yearStart: "", yearEnd: "" }]
        }));
    };

    const removeCompat = (index) => {
        setFormData(prev => ({
            ...prev,
            compatibility: prev.compatibility.filter((_, i) => i !== index)
        }));
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center h-screen mt-20">
                <LoadingSpinner size="lg" color="yellow" />
            </div>
        );
    }

    return (
        <div className="flex mt-20">
            <div className="p-6 min-h-screen w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={handleBack}
                            className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full pb-10">
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
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Vendor Selection *
                                        </label>
                                        <select
                                            name="vendorId"
                                            value={formData.vendorId}
                                            onChange={handleInputChange}
                                            disabled={user?.role === 'vendor'}
                                            className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors text-gray-900 ${user?.role === 'vendor' ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''}`}
                                        >
                                            <option value="">Select Vendor</option>
                                            {user?.role === 'vendor' ? (
                                                <option value={user.uid}>{user.displayName || user.email} (You)</option>
                                            ) : (
                                                vendors.map(vendor => (
                                                    <option key={vendor.uid || vendor.id} value={vendor.uid || vendor.id}>
                                                        {vendor.displayName || vendor.userName || vendor.email}
                                                    </option>
                                                ))
                                            )}
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
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Low Stock Alert Threshold
                                        </label>
                                        <input
                                            type="number"
                                            name="lowStockThreshold"
                                            value={formData.lowStockThreshold}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 10"
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
                                <div className="space-y-3">
                                    {Array.isArray(formData.compatibility) && formData.compatibility.map((item, index) => (
                                        <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-3 border border-gray-100 rounded-lg bg-gray-50">
                                            <div className="flex-1 min-w-[120px]">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Make</label>
                                                <input
                                                    type="text"
                                                    value={item.make || ""}
                                                    onChange={(e) => handleCompatChange(index, 'make', e.target.value)}
                                                    placeholder="e.g. Toyota"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-[120px]">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Model</label>
                                                <input
                                                    type="text"
                                                    value={item.model || ""}
                                                    onChange={(e) => handleCompatChange(index, 'model', e.target.value)}
                                                    placeholder="e.g. Camry"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Year Start</label>
                                                <input
                                                    type="number"
                                                    value={item.yearStart || ""}
                                                    onChange={(e) => handleCompatChange(index, 'yearStart', e.target.value)}
                                                    placeholder="2018"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Year End</label>
                                                <input
                                                    type="number"
                                                    value={item.yearEnd || ""}
                                                    onChange={(e) => handleCompatChange(index, 'yearEnd', e.target.value)}
                                                    placeholder="2022"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeCompat(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tags Section */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Product Tags</h2>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {formData.tags?.map((tag, index) => (
                                            <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold border border-yellow-200">
                                                {tag}
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); removeTag(tag); }} 
                                                    className="hover:text-yellow-900 focus:outline-none"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        onKeyDown={handleAddTag}
                                        placeholder="Type a tag and press Enter"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Press 'Enter' to add tags like "Summer Sale", "Premium", or "Bestseller"</p>
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
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none transition-colors"
                                />
                            </div>

                            {/* Images Section */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Images</h2>
                                <div className="space-y-4">
                                    {/* Existing Images */}
                                    {existingImages.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">Current Images</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                {existingImages.map((image) => (
                                                    <div key={image.id} className="relative">
                                                        <img
                                                            src={image.url}
                                                            alt="Product"
                                                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        {image.type === 'main' && (
                                                            <span className="absolute top-1 left-1 bg-yellow-400 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Main</span>
                                                        )}
                                                        <button
                                                            onClick={() => removeExistingImage(image.id)}
                                                            className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-yellow-400 shadow-sm transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

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
                                                Upload New Images
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Click here or drag and drop to add more images
                                            </p>
                                        </div>
                                    </div>

                                    {/* New Image Preview */}
                                    {images.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">New Images to Add</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                {images.map((image) => (
                                                    <div key={image.id} className="relative group">
                                                        <img
                                                            src={image.url}
                                                            alt={image.name}
                                                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        <button
                                                            onClick={() => removeNewImage(image.id)}
                                                            className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-yellow-400 shadow-sm transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
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
                                    <span>{isLoading ? "Saving Changes..." : "Save Changes"}</span>
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

export default EditProduct;
