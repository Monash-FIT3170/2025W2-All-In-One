import { Meteor } from "meteor/meteor";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginFormUIState } from "../LoginFormUIState";
import { RootState } from "/app/client/store";

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

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (_, { getState, rejectWithValue }) => {
    const { email, password } = (getState() as RootState).loginFormSlice;

    return await new Promise<void>((resolve, reject) => {
      Meteor.loginWithPassword(email, password, (error) => {
        if (error instanceof Meteor.Error) {
          return reject(rejectWithValue(`Login failed: ${error.reason}`));
        } else if (error) {
          return reject(rejectWithValue("An unknown error occurred."));
        } else {
          return resolve();
        }
      });
    });
  }
);


export const { setEmail, setPassword, setMessage, setLoading, clearForm } =
  loginFormSlice.actions;

export const selectLoginFormUIState = (state: RootState) =>
  state.loginFormSlice;

export default loginFormSlice.reducer;
