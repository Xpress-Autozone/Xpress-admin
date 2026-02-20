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
        dispatch(fetchProducts());
    }, [dispatch, refreshKey]);

    if (status === "loading" && items.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen mt-20">
                <LoadingSpinner size="lg" color="yellow" />
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="p-6 mt-20">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    Error loading products: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <ProductList
                title="Total Inventory"
                data={enrichedItems}
                initialFilters={{ category: categoryFilter || "" }}
                onAddItem={() => navigate("/add-products")}
                onEditItem={(item) => navigate(`/edit-product/${item.id}`)}
                onDeleteItem={() => setRefreshKey(prev => prev + 1)}
            />
        </div>
    );
};

export default AllProducts;
