import React from "react";
import { Package } from "lucide-react";

const EmptyState = ({ categoryName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mt-30">
      <Package className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
      <p className="text-gray-500 text-center max-w-sm">
        There are no products available in the <span className="font-medium">{categoryName}</span> category yet. Check back soon!
      </p>
    </div>
  );
};

export default EmptyState;