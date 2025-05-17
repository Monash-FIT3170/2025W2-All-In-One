import { Meteor } from "meteor/meteor";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginFormUIState } from "../LoginFormUIState";
import { RootState } from "/app/client/store";
import { ApiUserAccount } from "../../../../../shared/api-models/user/ApiUserAccount";
import { getUserAccountById } from "/app/client/library-modules/domain-models/user/repositories/user-account-repository";

const initialState: LoginFormUIState = {
  email: "",
  password: "",
  message: "",
  isLoading: false,
};

export const loginFormSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearForm(state) {
      state.email = "";
      state.password = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.message = "Login successful!";
        state.email = "";
        state.password = "";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message =
          (action.payload as string) || "Something went wrong during login.";
      });
  },
});

export const loginUser = createAsyncThunk<
  string, // return user role for the componenet to do the navigation
  void,
  { state: RootState; rejectValue: string }>
  ("login/loginUser", async (_, { getState, rejectWithValue }) => {
  const { email, password } = getState().loginFormSlice;

  return await new Promise<string>((resolve, reject) => {
    Meteor.loginWithPassword(email, password, async (error) => {
      if (error) {
        return reject(rejectWithValue("Login failed."));
      }
      try {
        const userId = Meteor.userId();
        if (!userId) throw new Error("User ID not found after login.");

        // retrieve the user profile by userId
       const user: ApiUserAccount = await getUserAccountById(userId);

        if (!user?.role) {
          throw new Error("User role not found.");
        }

        resolve(user.role); // Return role for redirect
      } catch (err: any) {
        reject(rejectWithValue(err.message || "Failed to fetch user profile."));
      }
    });
  });
});

export const { setEmail, setPassword, setMessage, setLoading, clearForm } =
  loginFormSlice.actions;

export const selectLoginFormUIState = (state: RootState) =>
  state.loginFormSlice;

export default loginFormSlice.reducer;
