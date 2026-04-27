import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "./config/api";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async ({ page = 1, limit = 20 }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      if (!token) return { data: [], pagination: {} };
      
      const response = await fetch(`${API_BASE_URL}/getOrders?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch orders");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    pagination: { page: 1, hasMore: false, total: 0 },
    status: "idle",
    error: null,
    lastFetched: null
  },
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data || [];
        state.pagination = {
          page: action.payload.pagination?.currentPage || state.pagination.page,
          hasMore: action.payload.pagination?.hasMore || false,
          total: action.payload.pagination?.totalItems || state.items.length,
        };
        state.lastFetched = Date.now();
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setPage } = orderSlice.actions;
export default orderSlice.reducer;
