import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AuthService from "../../services/auth";
import {
  LoginCredentials,
  AuthState,
  SignUpData,
  SignUpResponse,
} from "../../types/auth";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Define the error response type
interface ErrorResponseData {
  email?: string[];
  password?: string[];
  name?: string[];
  detail?: string;
  error?: string;
  message?: string;
  non_field_errors?: string[];
  [key: string]: string | string[] | undefined;
}

// Define a custom error type
interface CustomError extends Error {
  status?: number;
}

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log("Login attempt with email:", credentials.email);
      const authService = AuthService.getInstance();
      const response = await authService.signIn(credentials);
      console.log("Login response:", {
        userId: response.user?.id,
        hasToken: !!response.tokens,
      });

      if (response.tokens) {
        // Store tokens in localStorage
        localStorage.setItem("accessToken", response.tokens.access);
        localStorage.setItem("refreshToken", response.tokens.refresh);
        localStorage.setItem("user", JSON.stringify(response.user));
        console.log("Tokens stored in localStorage");
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        // Handle specific error cases
        if (status === 401) {
          return rejectWithValue(
            "Email-ka ama password-ka aad gelisay waa khalad. Fadlan hubi xogtaada oo mar kale isku day."
          );
        }

        if (status === 400 && typeof data === "object") {
          const errorMessage =
            data.detail ||
            data.message ||
            data.error ||
            (Array.isArray(data.non_field_errors)
              ? data.non_field_errors[0]
              : null);

          if (errorMessage) {
            return rejectWithValue(errorMessage);
          }
        }
      }

      return rejectWithValue("Cilad ayaa dhacday. Fadlan mar kale isku day.");
    }
  }
);

export const signup = createAsyncThunk<
  SignUpResponse,
  SignUpData,
  { rejectValue: string }
>("auth/signup", async (data: SignUpData, { rejectWithValue }) => {
  try {
    console.log("Starting signup process with data:", data);
    const authService = AuthService.getInstance();
    const response = await authService.signUp(data);
    console.log("Signup response received:", response);

    // Verify tokens before proceeding
    if (!response.tokens) {
      console.error("No tokens in signup response");
      return rejectWithValue("No tokens received from server");
    }

    // Store tokens and user data in localStorage
    console.log("Storing tokens from response:", response.tokens);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("accessToken", response.tokens.access);
        localStorage.setItem("refreshToken", response.tokens.refresh);
        localStorage.setItem("user", JSON.stringify(response.user));

        // Verify storage
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        console.log("Tokens stored in localStorage:", {
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
          matchesOriginal:
            storedAccessToken === response.tokens.access &&
            storedRefreshToken === response.tokens.refresh,
        });

        if (
          storedAccessToken !== response.tokens.access ||
          storedRefreshToken !== response.tokens.refresh
        ) {
          console.error("Token storage verification failed in thunk");
          return rejectWithValue("Failed to store tokens");
        }
      } catch (storageError) {
        console.error("Error storing tokens in localStorage:", storageError);
        return rejectWithValue("Failed to store tokens in browser storage");
      }
    } else {
      console.warn("window is undefined - cannot store tokens in localStorage");
      return rejectWithValue("Browser storage not available");
    }

    return response;
  } catch (error) {
    console.error("Signup error in thunk:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 400) {
        if (data?.error === "Username already exists") {
          return rejectWithValue(
            "Magaca isticmaalaha ayaa horey u jira. Fadlan dooro mid kale."
          );
        }
        return rejectWithValue(
          data?.error || "Xogta aad gelisay waa khalad. Fadlan hubi xogtaada."
        );
      }
    }

    // If it's a string error message, return it directly
    if (typeof error === "string") {
      return rejectWithValue(error);
    }

    // If it's an Error object, return its message
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    // For any other error type, return a generic message
    return rejectWithValue("Cilad ayaa dhacday. Fadlan mar kale isku day.");
  }
});

export const logoutAction = createAsyncThunk("auth/logout", async () => {
  AuthService.getInstance().signOut();
});

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = payload.user;
        if (payload.tokens) {
          state.accessToken = payload.tokens.access;
          state.refreshToken = payload.tokens.refresh;
        }
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = payload.user;
        if (payload.tokens) {
          state.accessToken = payload.tokens.access;
          state.refreshToken = payload.tokens.refresh;
        }
      })
      .addCase(signup.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
        state.isAuthenticated = false;
      });
  },
});

// Selectors
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
