import { SettingsPageUiState } from "../SettingsPageUiState";
import { RootState } from "/app/client/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SettingsPageUiState = {
  isLoading: false,
  textNotificationsEnabled: false,
};

export const settingsPageSlice = createSlice({
  name: "SettingsPage",
  initialState,
  reducers: {
    setTextNotificationsEnabled(state, action: PayloadAction<boolean>) {
      state.textNotificationsEnabled = action.payload;
    },
  },
});
export const selectSettingsPageUiState = (state: RootState) =>
  state.settingsPage;

export default settingsPageSlice.reducer;
export const {
  setTextNotificationsEnabled
} = settingsPageSlice.actions;
