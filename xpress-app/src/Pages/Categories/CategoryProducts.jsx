import React, { useState } from 'react';
import ProductList from '../../Components/Ui/ProductList/productList';
import { useNavigate, useParams } from 'react-router-dom';
import useProductsByCategory from '../../hooks/useProductsByCategory';
import useCategories from '../../hooks/useCategories';
import LoadingSpinner from '../../Components/LoadingSpinner';
import EmptyState from '../../Components/EmptyState';

const CategoryProducts = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { getCategoryBySlug } = useCategories();
    const category = getCategoryBySlug(slug);
    const [refreshKey, setRefreshKey] = useState(0);

    // Note: we use slug as the category ID for the backend query if it matches
    // or we use the specific id from our constants.
    const { products, loading, error } = useProductsByCategory(category?.id || slug, refreshKey);

    if (!category) {
        return (
            <div className="p-6 mt-20">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                    Category not found: {slug}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" color="yellow" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 mt-20">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    Error loading products: {error}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="p-6">
                <EmptyState categoryName={category.label} />
            </div>
        );
    }

    const handleDeleteItem = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="p-6">
            <ProductList
                title={category.label}
                data={products}
                onAddItem={() => navigate("/add-products")}
                onEditItem={(item) => navigate(`/edit-product/${item.id}`)}
                onDeleteItem={handleDeleteItem}
            />
        </div>
    );
};

export default CategoryProducts;
