import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "/app/client/store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export type ChangePasswordUIState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string;
};

const initialState: ChangePasswordUIState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  isLoading: false,
  error: "",
};

export const changePassword = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("settings/changePassword", async (_, { getState, rejectWithValue }) => {
  const state = getState().changePasswordForm;
  const { currentPassword, newPassword, confirmPassword } = state;

  if (!currentPassword?.trim()) {
    return rejectWithValue("Current password is required.");
  }
  if (!newPassword || newPassword.length < 8) {
    return rejectWithValue("New password must be at least 8 characters.");
  }
  if (newPassword !== confirmPassword) {
    return rejectWithValue("Passwords do not match.");
  }
  if (newPassword === currentPassword) {
    return rejectWithValue(
      "New password must be different from current password."
    );
  }

  try {
        console.log("Starting password change process...");

        // Try to change the password directly using Accounts.changePassword
        // This method should handle password validation internally
        console.log("Changing password...");
        await new Promise<void>((resolve, reject) => {
          Accounts.changePassword(currentPassword, newPassword, (err) => {
            if (err) {
              console.log("Password change error:", err);
              return reject(err);
            }
            console.log("Password changed successfully");
            resolve();
          });
        });

        return;
      } catch (err: any) {
        console.log("Password change process error:", err);
        return rejectWithValue(
          err?.reason || err?.message || "Unable to change password."
        );
      }
});

export const changePasswordSlice = createSlice({
  name: "changePasswordForm",
  initialState,
  reducers: {
    setCurrentPassword(state, action: PayloadAction<string>) {
      state.currentPassword = action.payload;
    },
    setNewPassword(state, action: PayloadAction<string>) {
      state.newPassword = action.payload;
    },
    setConfirmPassword(state, action: PayloadAction<string>) {
      state.confirmPassword = action.payload;
    },
    clearForm(state) {
      state.currentPassword = "";
      state.newPassword = "";
      state.confirmPassword = "";
      state.error = "";
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Password change failed.";
      });
  },
});

export const {
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  clearForm,
  setError,
} = changePasswordSlice.actions;

export const selectChangePasswordForm = (state: RootState) =>
  state.changePasswordForm;

export default changePasswordSlice.reducer;


