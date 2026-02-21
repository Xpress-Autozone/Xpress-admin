import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  ChevronDown,
  SortAsc,
  SortDesc,
  Download,
  Eye,
} from "lucide-react";
import DeleteConfirmationModal from "../DeleteConfirmModal/DeleteConfirmationModal";
import useDeleteProduct from "../../../hooks/useDeleteProduct";
import AlertModal from "../../AlertModal";
import { CATEGORIES } from "../../../constants/categories";

const uniqueStatuses = ["In Stock", "Low Stock", "Out of Stock"];

const ProductList = ({
  title = "Product Management",
  data = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  onViewItem,
  itemsPerPage = 10,
  initialFilters = {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({
    priceRange: { min: "", max: "" },
    vendor: "",
    dateRange: { start: "", end: "" },
    quantityRange: { min: "", max: "" },
    category: initialFilters.category || "",
    status: initialFilters.status || "",
  });

  // Update filters if initialFilters change (e.g. navigation)
  React.useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: initialFilters.category || "",
      status: initialFilters.status || prev.status
    }));
  }, [initialFilters.category, initialFilters.status]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [alert, setAlert] = useState({ isOpen: false, type: "info", title: "", message: "" });
  const { deleteProduct } = useDeleteProduct();

  // Default data for demonstration
  const defaultData = [
    {
      id: "001",
      itemName: "Premium Brake Pads",
      price: 89.99,
      quantity: 25,
      vendorName: "AutoParts Pro",
      datePosted: "2024-01-15",
      category: "Brakes",
      status: "In Stock",
    },
    {
      id: "002",
      itemName: "Engine Oil Filter",
      price: 12.5,
      quantity: 150,
      vendorName: "Motor Supply Co",
      datePosted: "2024-01-20",
      category: "Engine",
      status: "In Stock",
    },
    {
      id: "003",
      itemName: "LED Headlight Bulbs",
      price: 45.75,
      quantity: 8,
      vendorName: "Bright Auto Parts",
      datePosted: "2024-01-18",
      category: "Lighting",
      status: "Low Stock",
    },
    {
      id: "004",
      itemName: "Air Suspension Kit",
      price: 299.99,
      quantity: 5,
      vendorName: "Performance Plus",
      datePosted: "2024-01-12",
      category: "Suspension",
      status: "Low Stock",
    },
    {
      id: "005",
      itemName: "Tire Pressure Monitor",
      price: 67.25,
      quantity: 35,
      vendorName: "Tech Auto Solutions",
      datePosted: "2024-01-22",
      category: "Electronics",
      status: "In Stock",
    },
  ];

  const tableData = data.length > 0 ? data : defaultData;

  // Get unique values for filter dropdowns - Derived from full dataset
  const uniqueVendors = useMemo(() => {
    return [...new Set(tableData.map((item) => item.vendorName).filter(Boolean))].sort();
  }, [tableData]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(tableData.map((item) => item.categoryId || item.category).filter(Boolean))].sort();
  }, [tableData]);

  // Helper to get category label
  const getCategoryLabel = (id) => {
    return CATEGORIES.find(c => c.id === id)?.label || id;
  };

  // Advanced filtering and searching
  const filteredData = useMemo(() => {
    let filtered = tableData.filter((item) => {
      // Search filter - prioritized fields
      const searchTerms = searchTerm.toLowerCase().trim();
      const searchMatch =
        !searchTerms ||
        [item.itemName, item.brand, item.partNumber]
          .some((value) =>
            value?.toString().toLowerCase().includes(searchTerms)
          );

      // Price range filter - strict numeric comparison
      const itemPrice = parseFloat(item.price) || 0;
      const minPrice = filters.priceRange.min !== "" ? parseFloat(filters.priceRange.min) : -Infinity;
      const maxPrice = filters.priceRange.max !== "" ? parseFloat(filters.priceRange.max) : Infinity;
      const priceMatch = itemPrice >= minPrice && itemPrice <= maxPrice;

      // Vendor filter
      const vendorMatch = !filters.vendor || item.vendorName === filters.vendor;

      // Category filter
      const categoryMatch =
        !filters.category || (item.categoryId || item.category) === filters.category;

      // Status filter
      const itemStock = Number(item.stock ?? item.quantity ?? 0);
      const derivedStatus = item.status || (itemStock > 10 ? "In Stock" : itemStock > 0 ? "Low Stock" : "Out of Stock");
      const statusMatch = !filters.status || derivedStatus === filters.status;

      // Date range filter
      const dateMatch =
        (!filters.dateRange.start ||
          new Date(item.datePosted) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end ||
          new Date(item.datePosted) <= new Date(filters.dateRange.end));

      // Quantity range filter - strictly respect Min/Max
      const minQty = filters.quantityRange.min !== "" ? parseInt(filters.quantityRange.min) : -Infinity;
      const maxQty = filters.quantityRange.max !== "" ? parseInt(filters.quantityRange.max) : Infinity;
      const quantityMatch = itemStock >= minQty && itemStock <= maxQty;

      return (
        searchMatch &&
        priceMatch &&
        vendorMatch &&
        categoryMatch &&
        statusMatch &&
        dateMatch &&
        quantityMatch
      );
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle different data types
        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [tableData, searchTerm, filters, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);
  const totalItems = filteredData.length;

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: "", max: "" },
      vendor: "",
      dateRange: { start: "", end: "" },
      quantityRange: { min: "", max: "" },
      category: "",
      status: "",
    });
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map((item) => item.id));
    }
  };

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Item Name,Brand,Part Number,Price,Quantity,Vendor,Date Posted,Category,Status\n" +
      filteredData
        .map(
          (row) => {
            const stock = row.stock !== undefined ? row.stock : (row.quantity || 0);
            const status = row.status || (stock > 10 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock");
            return `${row.id},${row.itemName},${row.brand || ""},${row.partNumber || ""},${row.price},${stock},${row.vendorName},${row.datePosted},${row.category},${status}`;
          }
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const productId = itemToDelete._id || itemToDelete.id;
      console.log('[ProductList] Deleting product:', productId);
      await deleteProduct(productId, false);

      setAlert({
        isOpen: true,
        type: "success",
        title: "Success",
        message: "Product deleted successfully"
      });

      onDeleteItem?.(itemToDelete);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('[ProductList] Error deleting product:', error);
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: error.message
      });
    }
  };

  const SortableHeader = ({ children, sortKey, className = "" }) => (
    <th
      className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortConfig.key === sortKey &&
          (sortConfig.direction === "asc" ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          ))}
      </div>
    </th>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-20">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full mb-2"></div>
              <p className="text-gray-600">
                Manage your inventory with advanced search and filtering
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={exportData}
                className="flex items-center space-x-2 bg-white hover:bg-gray-300 text-black px-4 py-2 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                type="button"
                onClick={() => onAddItem?.()}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-white shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle and Quick Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${showFilters
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    } border border-gray-300`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {(searchTerm ||
                  Object.values(filters).some((f) =>
                    typeof f === "string" ? f : Object.values(f).some((v) => v)
                  )) && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear All</span>
                    </button>
                  )}
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>
                  Total: <strong className="text-gray-900">{totalItems}</strong>
                </span>
                <span>
                  In Stock:{" "}
                  <strong className="text-green-600">
                    {filteredData.filter((p) => p.status === "In Stock").length}
                  </strong>
                </span>
                <span>
                  Low Stock:{" "}
                  <strong className="text-yellow-600">
                    {
                      filteredData.filter((p) => p.status === "Low Stock")
                        .length
                    }
                  </strong>
                </span>
                <span>
                  Out of Stock:{" "}
                  <strong className="text-red-600">
                    {
                      filteredData.filter((p) => p.status === "Out of Stock")
                        .length
                    }
                  </strong>
                </span>
                {selectedItems.length > 0 && (
                  <span>
                    Selected:{" "}
                    <strong className="text-blue-600">
                      {selectedItems.length}
                    </strong>
                  </span>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange.min}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              min: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              max: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Vendor Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vendor
                    </label>
                    <select
                      value={filters.vendor}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          vendor: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm bg-white"
                    >
                      <option value="">All Vendors</option>
                      {uniqueVendors.map((vendor) => (
                        <option key={vendor} value={vendor}>
                          {vendor}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm bg-white"
                    >
                      <option value="">All Categories</option>
                      {uniqueCategories.map((category) => (
                        <option key={category} value={category}>
                          {getCategoryLabel(category)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm bg-white"
                    >
                      <option value="">All Status</option>
                      {uniqueStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Second Row for Quantity and Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Quantity Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity Range
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.quantityRange.min}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            quantityRange: {
                              ...prev.quantityRange,
                              min: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.quantityRange.max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            quantityRange: {
                              ...prev.quantityRange,
                              max: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            dateRange: {
                              ...prev.dateRange,
                              start: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                      />
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            dateRange: {
                              ...prev.dateRange,
                              end: e.target.value,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === currentItems.length &&
                    currentItems.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
              </th>
              <SortableHeader sortKey="itemName">Product Info</SortableHeader>
              <SortableHeader sortKey="brand">Brand / Part #</SortableHeader>
              <SortableHeader sortKey="price">Price</SortableHeader>
              <SortableHeader sortKey="stock">Stock</SortableHeader>
              <SortableHeader sortKey="vendorName">Vendor</SortableHeader>
              <SortableHeader sortKey="categoryId">Category</SortableHeader>
              <SortableHeader sortKey="status">Status</SortableHeader>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <Search className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-lg font-medium mb-2">
                      No products found
                    </p>
                    <p className="text-sm">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={`hover:bg-gray-50 transition-colors ${selectedItems.includes(item.id) ? "bg-yellow-50" : ""
                    }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        <img
                          className="h-10 w-10 rounded-lg object-cover border border-gray-100 shadow-xs"
                          src={item.mainImage?.url || item.mainImage || "https://via.placeholder.com/150"}
                          alt={item.itemName}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 line-clamp-1">
                          {item.itemName || "--"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {item.id || "--"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{item.brand || "N/A"}</div>
                    <div className="text-[11px] text-gray-400">{item.partNumber || "No Part #"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      GHC {item.price?.toFixed(2) || "0.00"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.stock !== undefined ? item.stock : (item.quantity || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.vendorName || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {CATEGORIES.find(c => c.id === (item.categoryId || item.category))?.label || (item.categoryId || item.category || "N/A")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.datePosted || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {(() => {
                        const stock = item.stock !== undefined ? item.stock : (item.quantity || 0);
                        let status = item.status;
                        if (!status) {
                          if (stock === 0) status = "Out of Stock";
                          else if (stock <= 10) status = "Low Stock";
                          else status = "In Stock";
                        }
                        return (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-center ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        );
                      })()}
                      <div className="flex flex-wrap gap-1">
                        {item.featured && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-700 rounded-sm">⭐ FEAT</span>
                        )}
                        {item.newProduct && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-100 text-blue-700 rounded-sm">🆕 NEW</span>
                        )}
                        {item.hotProduct && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 text-red-700 rounded-sm">🔥 HOT</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditItem?.(item)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-lg text-sm font-medium transition-colors"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg text-sm font-medium transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Footer with Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(endIndex, totalItems)}
            </span>{" "}
            of <span className="font-semibold">{totalItems}</span> entries
            {filteredData.length !== tableData.length && (
              <span className="text-yellow-600 ml-2">
                (filtered from {tableData.length} total)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 1
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNumber
                    ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                : "text-gray-700 hover:bg-gray-200 bg-white border border-gray-300"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.itemName}
      />
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default ProductList;
