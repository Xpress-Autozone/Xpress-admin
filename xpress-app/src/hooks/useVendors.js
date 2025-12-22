import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        console.log("[useVendors] Fetching vendors");
        console.log(`[useVendors] Auth token available: ${!!token}`);

        const url =
          "https://xpress-backend-eeea.onrender.com/users?role=vendor";
        console.log(`[useVendors] Request URL: ${url}`);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        console.log(`[useVendors] Response status: ${response.status}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`[useVendors] Error response:`, errorData);
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log(
          `[useVendors] Successfully fetched ${data.data?.length || 0} vendors`
        );
        console.log(`[useVendors] Response data:`, data);

        setVendors(data.data || []);
        setError(null);
      } catch (err) {
        console.error(`[useVendors] Error fetching vendors:`, err);
        setError(err.message);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [token]);

  return { vendors, loading, error };
};

export default useVendors;
