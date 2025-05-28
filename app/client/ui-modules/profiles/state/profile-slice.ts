import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { ApiProfileData } from "/app/shared/api-models/user/api-roles/ApiProfileData";
import { ProfileData } from "/app/client/library-modules/domain-models/user/ProfileData";
import {
  getProfileDataById,
  setProfileDataById,
} from "/app/client/library-modules/domain-models/user/role-repositories/profile-data-repository";

const initialState: {
  data: ProfileData;
  isEditing: boolean;
} = {
  data: {} as ProfileData,
  isEditing: false,
};

export const fetchProfileData = createAsyncThunk<
  ProfileData, // Reuturn
  string, // input id
  { state: RootState; rejectValue: string }
>("profile/fetch", async (profileDataId, { rejectWithValue }) => {
  try {
    return await getProfileDataById(profileDataId);
  } catch (err) {
    return rejectWithValue("Failed to fetch profile data");
  }
});

export const saveProfileData = createAsyncThunk<
  ProfileData, // Reuturn
  { id: string; profile: ProfileData }, // input id
  { state: RootState; rejectValue: string }
>("profile/save", async ({ id, profile }, { rejectWithValue }) => {
  try {
    return await setProfileDataById(id, profile);
  } catch (err) {
    return rejectWithValue("Failed to fetch profile data");
  }
});

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileData>) => {
      state.data = action.payload;
    },

    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    updateField: (
      state,
      action: PayloadAction<{ field: keyof ProfileData; value: string }>
    ) => {
      state.data[action.payload.field] = action.payload.value;
    },

    resetProfile: (state) => {
      // You might want to reset to initial state or fetch fresh data
      state.data = initialState.data;
      state.isEditing = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfileData.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(saveProfileData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isEditing = false;
    });
  },
});

// Action creators
export const { setProfileData, setEditing, updateField, resetProfile } =
  profileSlice.actions;

// Selectors
export const selectProfile = (state: RootState) => state.profile;
export const selectProfileData = (state: RootState) => state.profile.data;
export const selectIsEditing = (state: RootState) => state.profile.isEditing;

export default profileSlice.reducer;
