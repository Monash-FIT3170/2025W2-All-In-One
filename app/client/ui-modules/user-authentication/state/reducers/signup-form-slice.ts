import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Meteor } from "meteor/meteor";
import { SignupFormUIState } from "../SignupFormUIState";
import { RootState } from "/app/client/store";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { Role } from "/app/shared/user-role-identifier";

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
  { state: RootState; rejectValue: string }
>("signup/registerUser", async (_, { getState, rejectWithValue }) => {
  const state = (getState() as RootState).signupFormSlice;

  const payload = {
    email: state.email,
    password: state.password,
    firstName: state.firstName,
    lastName: state.lastName,
    accountType: state.accountType,
    agentCode: state.accountType === Role.AGENT ? state.agentCode : undefined,
  };

  try {
    await Meteor.callAsync(MeteorMethodIdentifier.USER_REGISTER, payload);

    const userId = Meteor.userId();
    if (!userId) throw new Error("Registration successful! Please log in.");
    
    return;
  } catch (err: any) {
    console.error("Signup error:", err);
    return rejectWithValue(err.reason || err.message || "Registration failed.");
  }
});

export const { updateField, clearForm } = signupFormSlice.actions;
export const selectSignupFormUIState = (state: RootState) =>
  state.signupFormSlice;
export default signupFormSlice.reducer;
