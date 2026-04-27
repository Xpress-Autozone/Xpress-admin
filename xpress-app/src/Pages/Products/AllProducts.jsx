import React, { useEffect, useState, useMemo } from "react";
import ProductList from "../../Components/Ui/ProductList/productList";
import LoadingSpinner from "../../Components/LoadingSpinner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../productSlice";
import useVendors from "../../hooks/useVendors";

const AllProducts = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get("category");
    const { items, status, error } = useSelector((state) => state.products);
    const { vendors } = useVendors();
    const [refreshKey, setRefreshKey] = useState(0);

    const enrichedItems = useMemo(() => {
        return items.map(item => {
            const vendor = vendors.find(v => (v.uid || v.id) === item.vendorId);
            return {
                ...item,
                vendorName: vendor ? (vendor.displayName || vendor.userName || vendor.email) : (item.vendorName || "Unknown Vendor")
            };
        });
    }, [items, vendors]);

    useEffect(() => {
        // Only fetch on mount if we don't have items yet
        if (items.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, items.length]);

    const handleManualRefresh = () => {
        dispatch(fetchProducts());
    };

    if (status === "loading" && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 min-h-full">
                <LoadingSpinner size="lg" color="yellow" />
                <p className="mt-4 text-gray-500 font-bold text-xs uppercase tracking-widest animate-pulse">Syncing Inventory...</p>
            </div>
        );
    }

    if (status === "failed" && items.length === 0) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                    <h3 className="font-black uppercase tracking-wider text-sm mb-2">Sync Error</h3>
                    <p className="text-sm font-medium">{error}</p>
                    <button 
                        onClick={handleManualRefresh}
                        className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-200 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-end mb-4">
                {status === "loading" && (
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mr-4">
                        <div className="w-3 h-3 border-2 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
                        Updating...
                    </div>
                )}
            </div>
            <ProductList
                title="Total Inventory"
                data={enrichedItems}
                initialFilters={{ category: categoryFilter || "" }}
                onAddItem={() => navigate("/add-products")}
                onEditItem={(item) => navigate(`/edit-product/${item.id}`)}
                onDeleteItem={() => dispatch(fetchProducts())}
            />
        </div>
    );
};

export default AllProducts;
