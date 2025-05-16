import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";

interface ProfileData {
  firstName: string;
  lastName: string;
  dob: string;
  occupation: string;
  email: string;
  phone: string;
  emergencyContact: string;
  employer: string;
  workAddress: string;
  workPhone: string;
  profileImage: string;
  carMake: string;
  carModel: string;
  carYear: string;
  carPlate: string;
}

interface ProfileState {
  data: ProfileData;
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  isEditing: false,
  isLoading: false,
  error: null,
  data: {
    firstName: "Tom",
    lastName: "Macauley",
    dob: "25/09/2003",
    occupation: "Student",
    email: "thomas123mac@gmail.com",
    phone: "0437 559 777",
    emergencyContact: "Miachel Jordan",
    employer: "Fit 3170",
    workAddress: "Learning Jungle",
    workPhone: "0437 559 777",
    profileImage: "/need-to-add.png",
    carMake: "Crown",
    carModel: "Toyota",
    carYear: "2000",
    carPlate: "AWSOME",
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    updateField: (
      state,
      action: PayloadAction<{ field: keyof ProfileData; value: string }>
    ) => {
      state.data[action.payload.field] = action.payload.value;
    },
    saveProfile: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    saveProfileSuccess: (state) => {
      state.isLoading = false;
      state.isEditing = false;
    },
    saveProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetProfile: (state) => {
      // You might want to reset to initial state or fetch fresh data
      state.data = initialState.data;
      state.isEditing = false;
      state.error = null;
    },
  },
});

// Action creators
export const {
  setEditing,
  updateField,
  saveProfile,
  saveProfileSuccess,
  saveProfileFailure,
  resetProfile,
} = profileSlice.actions;

// Selectors
export const selectProfile = (state: RootState) => state.profile;
export const selectProfileData = (state: RootState) => state.profile.data;
export const selectIsEditing = (state: RootState) => state.profile.isEditing;
export const selectIsLoading = (state: RootState) => state.profile.isLoading;
export const selectProfileError = (state: RootState) => state.profile.error;

export default profileSlice.reducer;
