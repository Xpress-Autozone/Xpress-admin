import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "./config/api";

export const fetchVendors = createAsyncThunk(
  "vendors/fetchVendors",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) return [];
      
      const response = await fetch(`${API_BASE_URL}/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend server is starting up. Please try again in a moment.");
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch vendors");
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const vendorSlice = createSlice({
  name: "vendors",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    lastFetched: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default vendorSlice.reducer;
