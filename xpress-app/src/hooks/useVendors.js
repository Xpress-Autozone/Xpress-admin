import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../config/api";

const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { token } = useSelector((state) => state.auth);

  const fetchVendors = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle non-JSON responses (e.g. Render cold-start HTML page)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend server is starting up. Please try again in a moment.");
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch vendors");
      setVendors(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [token, refreshKey]);

  const deleteVendor = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete vendor");
      setRefreshKey(prev => prev + 1);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateVendor = async (id, vendorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(vendorData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update vendor");
      setRefreshKey(prev => prev + 1);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { vendors, loading, error, deleteVendor, updateVendor, refresh: () => setRefreshKey(prev => prev + 1) };
};

export default useVendors;
