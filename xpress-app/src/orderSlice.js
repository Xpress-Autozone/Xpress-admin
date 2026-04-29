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
    lastFetched: null,
    notificationDot: null
  },
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    markOrdersAsSeen: (state) => {
      state.notificationDot = null;
      if (state.items.length > 0) {
        const orderStatuses = state.items.reduce((acc, order) => {
          acc[order.id] = order.orderStatus || order.status;
          return acc;
        }, {});
        localStorage.setItem('admin_last_seen_statuses', JSON.stringify(orderStatuses));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newOrders = action.payload.data || [];
        state.items = newOrders;
        state.pagination = {
          page: action.payload.pagination?.currentPage || state.pagination.page,
          hasMore: action.payload.pagination?.hasMore || false,
          total: action.payload.pagination?.totalItems || state.items.length,
        };
        state.lastFetched = Date.now();

        // Calculate notification dot
        const lastSeenStatuses = JSON.parse(localStorage.getItem('admin_last_seen_statuses') || '{}');
        let highestPriorityColor = null;

        const priority = { 'red': 4, 'yellow': 3, 'blue': 2, 'green': 1 };
        const statusColors = {
          'requested': 'red',
          'pending': 'red',
          'payment_made': 'yellow',
          'confirmed': 'yellow',
          'dispatched': 'blue',
          'shipped': 'blue',
          'received': 'green',
          'delivered': 'green',
          'completed': 'green'
        };

        newOrders.forEach(order => {
          const currentStatus = (order.orderStatus || order.status || 'pending').toLowerCase();
          const lastStatus = lastSeenStatuses[order.id];

          if (currentStatus !== lastStatus) {
            const color = statusColors[currentStatus] || 'red';
            if (!highestPriorityColor || priority[color] > priority[highestPriorityColor]) {
              highestPriorityColor = color;
            }
          }
        });

        if (highestPriorityColor) {
          state.notificationDot = highestPriorityColor;
          // TODO: Implement email notifications for admins here
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setPage, markOrdersAsSeen } = orderSlice.actions;
export default orderSlice.reducer;
