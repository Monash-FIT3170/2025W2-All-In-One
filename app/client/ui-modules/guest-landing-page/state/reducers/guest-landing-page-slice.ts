import { createSlice } from "@reduxjs/toolkit";
import { GuestLandingPageUiState } from "../GuestLandingPageUiState";
import { RootState } from "@/app/store";

const initialState: GuestLandingPageUiState = {
  isLoading: false,
};

export const guestLandingPageSlice = createSlice({
  name: "guestLandingPage",
  initialState: initialState,
  reducers: {},
});

export const selectGuestLandingPageUiState = (state: RootState) =>
  state.guestLandingPage;

export default guestLandingPageSlice.reducer;
