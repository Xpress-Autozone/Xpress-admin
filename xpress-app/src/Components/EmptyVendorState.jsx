import React from "react";
import { Users } from "lucide-react";

const EmptyVendorState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <Users className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vendors Found</h3>
      <p className="text-gray-500 text-center max-w-sm">
        There are no vendors available yet. Start by adding your first vendor!
      </p>
    </div>
  );
};

export default EmptyVendorState;