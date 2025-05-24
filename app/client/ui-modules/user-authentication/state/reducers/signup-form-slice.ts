import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Meteor } from "meteor/meteor";
import { SignupFormUIState } from "../SignupFormUIState";
import { AppDispatch, RootState } from "/app/client/store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { Role } from "/app/shared/user-role-identifier";
import { loadCurrentUser } from "./current-user-slice";

const initialState: SignupFormUIState = {
  accountType: Role.TENANT,
  passwordVisible: false,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  agentCode: "",
  message: "",
  isLoading: false,
};

export const signupFormSlice = createSlice({
  name: "signupFormSlice",
  initialState,
  reducers: {
    updateField: <K extends keyof SignupFormUIState>(
      state: SignupFormUIState,
      action: PayloadAction<{ field: K; value: SignupFormUIState[K] }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    clearForm: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.message = "Account created successfully!";
        Object.assign(state, {
          ...initialState,
          message: "Account created successfully!",
        });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = (action.payload as string) || "Something went wrong.";
      });
  },
});

export const registerUser = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("signup/registerUser", async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState().signupForm;

  const payload = {
    email: state.email,
    password: state.password,
    firstName: state.firstName,
    lastName: state.lastName,
    accountType: state.accountType,
    agentCode: state.accountType === Role.AGENT ? state.agentCode : undefined,
  };

  try {
    // 1. Register the user
    await Meteor.callAsync(MeteorMethodIdentifier.USER_REGISTER, payload);

    // 2. Get current user
    const currentUser = Meteor.user();

    // 3. If not logged in OR logged in user email doesn't match the new one, log in manually
    const signedInEmail = currentUser?.emails?.[0]?.address;
    const userNeedsSignin = !currentUser || signedInEmail !== payload.email;

    if (userNeedsSignin) {
      await new Promise<void>((resolve, reject) => {
        Meteor.loginWithPassword(payload.email, payload.password, (error) => {
          if (error)
            return reject(new Error("Auto-signin failed after registration."));
          resolve();
        });
      });
    }

    // 4. Load the correct current user
    const finalUserId = Meteor.userId();
    if (!finalUserId) throw new Error("Unable to establish signin session.");

    await dispatch(loadCurrentUser(finalUserId));

    return;
  } catch (err: any) {
    console.error("Signup error:", err);
    return rejectWithValue(err.reason || err.message || "Registration failed.");
  }
});

export const { updateField, clearForm } = signupFormSlice.actions;
export const selectSignupFormUIState = (state: RootState) => state.signupForm;
export default signupFormSlice.reducer;
