import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductList = ({ 
  title = "", 
  data = [], 
  onAddItem,
  onEditItem,
  onDeleteItem,
  itemsPerPage = 10 
}) => {
  const [currentPage, setCurrentPage] = useState(1);

 

  const tableData = data.length > 0 ? data : defaultData;
  
  // Calculate pagination
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = tableData.slice(startIndex, endIndex);
  const totalItems = tableData.length;

  const handleEdit = (item) => {
    if (onEditItem) {
      onEditItem(item);
    } else {
      alert(`Edit ${item.itemName}`);
    }
  };

  const handleDelete = (item) => {
    if (onDeleteItem) {
      onDeleteItem(item);
    } else {
      alert(`Delete ${item.itemName}`);
    }
  };

  const handleAddItem = () => {
    if (onAddItem) {
      onAddItem();
    } else {
      alert('Add new item');
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <div className='h-1 w-16 bg-amber-300 '></div>
          </div>
        
        <button
          onClick={handleAddItem}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
        
      </div>
      

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Vendor Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Date Posted
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.itemName || "--"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${item.price?.toFixed(2) || '0.00'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.quantity || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.vendorName || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.datePosted || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
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
                onClick={() => goToPage(pageNumber)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;