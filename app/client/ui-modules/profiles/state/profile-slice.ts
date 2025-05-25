import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { ApiProfileData } from "/app/shared/api-models/user/api-roles/ApiProfileData";

const initialState: {
  data: ApiProfileData;
  isEditing: boolean;
} = {
  data: {} as ApiProfileData,
  isEditing: false
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ApiProfileData>) => {
      state.data = action.payload;
    },

    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    updateField: (
      state,
      action: PayloadAction<{ field: keyof ApiProfileData; value: string }>
    ) => {
      state.data[action.payload.field] = action.payload.value;
    },

    resetProfile: (state) => {
      // You might want to reset to initial state or fetch fresh data
      state.data = initialState.data;
      state.isEditing = false;
    },
  },
});

// Action creators
export const {
  setProfileData,
  setEditing,
  updateField,
  resetProfile,
} = profileSlice.actions;

// Selectors
export const selectProfile = (state: RootState) => state.profile;
export const selectProfileData = (state: RootState) => state.profile.data;
export const selectIsEditing = (state: RootState) => state.profile.isEditing;

export default profileSlice.reducer;
