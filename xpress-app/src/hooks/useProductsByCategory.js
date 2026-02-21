import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../config/api";

const useProductsByCategory = (category, refreshKey = 0) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) {
        console.warn("[useProductsByCategory] No category provided");
        setLoading(false);
        return;
      }

      try {
        console.log(
          `[useProductsByCategory] Fetching products for category: ${category}`
        );
        console.log(`[useProductsByCategory] Auth token available: ${!!token}`);

        const url = `${API_BASE_URL}/products/category/${encodeURIComponent(
          category
        )}`;
        console.log(`[useProductsByCategory] Request URL: ${url}`);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log(
          `[useProductsByCategory] Response status: ${response.status}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`[useProductsByCategory] Error response:`, errorData);
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log(
          `[useProductsByCategory] Successfully fetched ${data.data?.length || 0
          } products`
        );
        console.log(`[useProductsByCategory] Response data:`, data);

        setProducts(data.data || []);
        setError(null);
      } catch (err) {
        console.error(`[useProductsByCategory] Error fetching products:`, err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, token, refreshKey]);

  return { products, loading, error };
};

export default useProductsByCategory;
