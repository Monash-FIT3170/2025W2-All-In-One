import { Meteor } from "meteor/meteor";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginFormUIState } from "../LoginFormUIState";
import { AppDispatch, RootState } from "/app/client/store";
import { UserAccount } from "/app/client/library-modules/domain-models/user/UserAccount";
import { getUserAccountById } from "/app/client/library-modules/domain-models/user/repositories/user-account-repository";
import { loadCurrentUser } from "./current-user-slice";

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
  string, // Return role for redirect
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("login/loginUser", async (_, { getState, rejectWithValue, dispatch }) => {
  const { email, password } = getState().loginForm;

  try {
    // Wrap Meteor login in a Promise to await
    await new Promise<void>((resolve, reject) => {
      Meteor.loginWithPassword(email, password, (error) => {
        if (error) {
          return reject(
            new Error("Login failed. Please check your credentials.")
          );
        }
        resolve();
      });
    });

    const userId = Meteor.userId();
    if (!userId) throw new Error("User ID not found after login.");

    // Load user account and role-specific profile into Redux
    await dispatch(loadCurrentUser(userId));

    // Retrieve account to return the role for redirect
    const user: UserAccount = await getUserAccountById(userId);
    if (!user?.role) throw new Error("User role not found.");
    
    return user.role;
  } catch (err: any) {
    console.error("Login error:", err);
    return rejectWithValue(err.message || "Unexpected login error.");
  }
});

export const { setEmail, setPassword, setMessage, setLoading, clearForm } =
  loginFormSlice.actions;

export const selectLoginFormUIState = (state: RootState) => state.loginForm;

export default loginFormSlice.reducer;
