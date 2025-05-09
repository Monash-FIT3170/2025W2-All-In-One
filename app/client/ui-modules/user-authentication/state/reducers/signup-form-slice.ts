import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Meteor } from "meteor/meteor";
import { SignupFormUIState } from "../SignupFormUIState";
import { RootState } from "/app/client/store";

const initialState: SignupFormUIState = {
  accountType: "tenant",
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

export const registerUser = createAsyncThunk(
  "signup/registerUser",
  async (_, { getState, rejectWithValue }) => {
    const state = (getState() as RootState).signupFormSlice;

    const payload = {
      email: state.email,
      password: state.password,
      firstName: state.firstName,
      lastName: state.lastName,
      accountType: state.accountType,
      agentCode: state.accountType === "agent" ? state.agentCode : undefined,
    };

    return new Promise<void>((resolve, reject) => {
      Meteor.call(
        "user.register",
        payload,
        (err: { reason: string } | undefined) => {
          if (err) {
            return reject(
              rejectWithValue(err.reason || "Registration failed.")
            );
          }
          return resolve();
          // TODO: FIX TO DIRECT TO THE CORRECT PAGE
        }
      );
    });
  }
);

export const { updateField, clearForm } = signupFormSlice.actions;
export const selectSignupFormUIState = (state: RootState) =>
  state.signupFormSlice;
export default signupFormSlice.reducer;
