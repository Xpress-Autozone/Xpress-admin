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

const ProductList = ({
  title = "Product Management",
  data = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  onViewItem,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filters, setFilters] = useState({
    priceRange: { min: "" },
    vendor: "",
    dateRange: { start: "", end: "" },
    quantityRange: { min: "", max: "" },
    category: "",
    status: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  // Get unique values for filter dropdowns - FIXED: Filter out undefined values
  const uniqueVendors = [
    ...new Set(tableData.map((item) => item.vendorName).filter(Boolean)),
  ];
  const uniqueCategories = [
    ...new Set(tableData.map((item) => item.category).filter(Boolean)),
  ];
  const uniqueStatuses = [
    ...new Set(tableData.map((item) => item.status).filter(Boolean)),
  ];

  // Advanced filtering and searching
  const filteredData = useMemo(() => {
    let filtered = tableData.filter((item) => {
      // Search filter
      const searchMatch =
        !searchTerm ||
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Price range filter
      const priceMatch =
        !filters.priceRange.min ||
        item.price >= parseFloat(filters.priceRange.min);

      // Vendor filter
      const vendorMatch = !filters.vendor || item.vendorName === filters.vendor;

      // Category filter
      const categoryMatch =
        !filters.category || item.category === filters.category;

      // Status filter
      const statusMatch = !filters.status || item.status === filters.status;

      // Date range filter
      const dateMatch =
        (!filters.dateRange.start ||
          new Date(item.datePosted) >= new Date(filters.dateRange.start)) &&
        (!filters.dateRange.end ||
          new Date(item.datePosted) <= new Date(filters.dateRange.end));

      // Quantity range filter
      const quantityMatch =
        (!filters.quantityRange.min ||
          item.quantity >= parseInt(filters.quantityRange.min)) &&
        (!filters.quantityRange.max ||
          item.quantity <= parseInt(filters.quantityRange.max));

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
      priceRange: { min: "" },
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
      "ID,Item Name,Price,Quantity,Vendor,Date Posted,Category,Status\n" +
      filteredData
        .map(
          (row) =>
            `${row.id},${row.itemName},${row.price},${row.quantity},${row.vendorName},${row.datePosted},${row.category},${row.status}`
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

  const handleConfirmDelete = () => {
    onDeleteItem?.(itemToDelete);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
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
                onClick={exportData}
                className="flex items-center space-x-2 bg-white hover:bg-gray-300 text-black px-4 py-2 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
                    showFilters
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
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
                          {category}
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
              <SortableHeader sortKey="id">ID</SortableHeader>
              <SortableHeader sortKey="itemName">Item Name</SortableHeader>
              <SortableHeader sortKey="price">Price</SortableHeader>
              <SortableHeader sortKey="quantity">Quantity</SortableHeader>
              <SortableHeader sortKey="vendorName">Vendor</SortableHeader>
              <SortableHeader sortKey="category">Category</SortableHeader>
              <SortableHeader sortKey="datePosted">Date Posted</SortableHeader>
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
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedItems.includes(item.id) ? "bg-yellow-50" : ""
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.id || "--"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.itemName || "--"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      ${item.price?.toFixed(2) || "0.00"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.quantity || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.vendorName || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.category || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.datePosted || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status || "Unknown"}
                    </span>
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
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === 1
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
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNumber
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
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === totalPages
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
    </div>
  );
};

export default ProductList;
