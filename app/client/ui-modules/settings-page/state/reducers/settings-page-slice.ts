import { createSlice } from "@reduxjs/toolkit";
import { SettingsPageUiState } from "../SettingsPageUiState";
import { RootState } from "/app/client/store";

const initialState: SettingsPageUiState = {
  isLoading: false,
};

export const SettingsPageSlice = createSlice({
  name: "SettingsPage",
  initialState: initialState,
  reducers: {},
});

export const selectSettingsPageUiState = (state: RootState) =>
  state.SettingsPage;

export default SettingsPageSlice.reducer;