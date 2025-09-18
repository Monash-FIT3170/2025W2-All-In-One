import { Meteor } from "meteor/meteor";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SigninFormUIState } from "../SigninFormUIState";
import { AppDispatch, RootState } from "/app/client/store";
import { UserAccount } from "/app/client/library-modules/domain-models/user/UserAccount";
import { getUserAccountById } from "../../../../library-modules/domain-models/user/user-account-repositories/user-account-repository";
import { loadCurrentUser } from "./current-user-slice";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

const initialState: SigninFormUIState = {
  email: "",
  password: "",
  message: "",
  isLoading: false,
};

export const signinFormSlice = createSlice({
  name: "signin",
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
      .addCase(signinUser.pending, (state) => {
        state.isLoading = true;
        state.message = "";
      })
      .addCase(signinUser.fulfilled, (state) => {
        state.isLoading = false;
        state.message = "Sign in successful!";
        state.email = "";
        state.password = "";
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message =
          (action.payload as string) || "Something went wrong during signin.";
      });
  },
});

export const signinUser = createAsyncThunk<
  string, // Return role for redirect
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("signin/signinUser", async (_, { getState, rejectWithValue, dispatch }) => {
  const { email, password } = getState().signinForm;

  try {
    // Wrap Meteor signin in a Promise to await
    await new Promise<void>((resolve, reject) => {
      Meteor.loginWithPassword(email, password, (error) => {
        if (error) {
          return reject(
            new Error("Sign in failed. Please check your credentials.")
          );
        }
        resolve();
      });
    });

    const userId = Meteor.userId();
    if (!userId) throw new Error("User ID not found after sign in.");

    // Load user account and role-specific profile into Redux
    await dispatch(loadCurrentUser(userId));

    // Retrieve account to return the role for redirect
    const user: UserAccount = await getUserAccountById(userId);
    if (!user?.role) throw new Error("User role not found.");

    // Record login history (non-blocking)
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      Meteor.callAsync(MeteorMethodIdentifier.LOGIN_HISTORY_INSERT, {
        userId,
        timezone,
      }).catch(() => {});
    } catch {}
    
    return user.role;
  } catch (err: any) {
    console.error("Sign in error:", err);
    return rejectWithValue(err.message || "Unexpected sign in error.");
  }
});

export const { setEmail, setPassword, setMessage, setLoading, clearForm } =
  signinFormSlice.actions;

export const selectSigninFormUIState = (state: RootState) => state.signinForm;

export default signinFormSlice.reducer;
