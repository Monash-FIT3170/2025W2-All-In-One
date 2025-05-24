import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { PropertyFormPageUiState } from "../PropertyFormPageUIState";
import { getAllLandlords } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";

const initialState: PropertyFormPageUiState = {
  landlords: []
};

export const propertyFormSlice = createSlice({
  name: "propertyForm",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(load.fulfilled, (state, action) => {
      state.landlords = action.payload;
    });
  },
});

export const load = createAsyncThunk(
  "propertyForm/load",
  async () => {
    const landlords: Landlord[] = await getAllLandlords()
    return landlords;
  }
);

export const selectPropertyFormUiState = (state: RootState) =>
  state.propertyForm;
