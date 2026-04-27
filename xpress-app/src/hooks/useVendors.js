import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE_URL } from "../config/api";
import { fetchVendors } from "../vendorSlice";

const useVendors = () => {
  const dispatch = useDispatch();
  const { items: vendors, status, error, lastFetched } = useSelector((state) => state.vendors);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Cache for 10 minutes
    const shouldFetch = !lastFetched || (Date.now() - lastFetched > 10 * 60 * 1000);
    if (token && shouldFetch) {
      dispatch(fetchVendors());
    }
  }, [token, dispatch, lastFetched]);

  const deleteVendor = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete vendor");
      dispatch(fetchVendors());
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [token, dispatch]);

  const updateVendor = useCallback(async (id, vendorData) => {
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
      dispatch(fetchVendors());
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [token, dispatch]);

  return { 
    vendors, 
    loading: status === "loading", 
    error, 
    deleteVendor, 
    updateVendor, 
    refresh: () => dispatch(fetchVendors()) 
  };
};

export default useVendors;
