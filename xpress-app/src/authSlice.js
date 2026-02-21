import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "./config/api";

// Helper to load initial state from localStorage
const loadAuthState = () => {
  try {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("authExpiry");
    const user = localStorage.getItem("authUser");

    // Check if token exists and is not expired
    if (token && expiry && Date.now() < parseInt(expiry)) {
      return {
        user: user ? JSON.parse(user) : null,
        token,
        isAuthenticated: true,
        status: "succeeded",
        error: null,
      };
    }

    // Clear storage if expired or invalid
    localStorage.removeItem("authToken");
    localStorage.removeItem("authExpiry");
    localStorage.removeItem("authUser");
  } catch (error) {
    console.error("Error loading auth state:", error);
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
  };
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.status = "succeeded";
      const ONE_HOUR = 60 * 60 * 1000;
      const expiryTime = Date.now() + ONE_HOUR;
      localStorage.setItem("authToken", token);
      localStorage.setItem("authExpiry", expiryTime.toString());
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "idle";
      localStorage.removeItem("authToken");
      localStorage.removeItem("authExpiry");
      localStorage.removeItem("authUser");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.token = action.payload.token;

        // Save to localStorage with 1 hour expiry
        const ONE_HOUR = 60 * 60 * 1000;
        const expiryTime = Date.now() + ONE_HOUR;

        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("authExpiry", expiryTime.toString());
        if (action.payload.user) {
          localStorage.setItem("authUser", JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
