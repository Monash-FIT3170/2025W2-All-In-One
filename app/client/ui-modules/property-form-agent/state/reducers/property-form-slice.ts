import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { PropertyFormPageUiState } from "../PropertyFormPageUIState";
import { getAllLandlords } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";
import { getAllPropertyFeatures } from "/app/client/library-modules/domain-models/property/repositories/feature-respository";

const initialState: PropertyFormPageUiState = {
  landlords: [],
  features: [],
  featureOptions: [],
};

export const propertyFormSlice = createSlice({
  name: "propertyForm",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(load.fulfilled, (state, action) => {
      state.landlords = action.payload.landlords;
      state.features = action.payload.features;
      state.featureOptions = action.payload.features.map((feature) => ({
        value: feature._id,
        label: feature.name,
      }));
    });
  },
});

export const load = createAsyncThunk(
  "propertyForm/load",
  async () => {
    const landlords: Landlord[] = await getAllLandlords()
    const features: PropertyFeatureDocument[] = await getAllPropertyFeatures();
    return {landlords, features};
  }
);

export const selectPropertyFormUiState = (state: RootState) =>
  state.propertyForm;
