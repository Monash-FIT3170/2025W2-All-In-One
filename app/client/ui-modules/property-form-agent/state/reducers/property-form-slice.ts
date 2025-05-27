import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { PropertyFormPageUiState } from "../PropertyFormPageUIState";
import { getAllLandlords } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";
import { getAllPropertyFeatures } from "/app/client/library-modules/domain-models/property/repositories/feature-respository";
import { PropertyInsertData } from "/app/shared/api-models/property/PropertyInsertData";
import { insertProperty } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { apiPropertyInsertPrice } from "/app/client/library-modules/apis/property-price/price-api";
import { BlobNamePrefix, UploadResults } from "/app/shared/azure/blob-models";
import { uploadFilesHandler } from "/app/client/library-modules/apis/azure/blob-api";
import { apiInsertPropertyListing } from "/app/client/library-modules/apis/property-listing/listing-api";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import { NavigationPath } from "/app/client/navigation";

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

export const submitForm = createAsyncThunk(
  "propertyForm/insertProperty",
  async(propertyFormData: PropertyInsertData) => {
    const propertyId = insertProperty(propertyFormData);
    await apiPropertyInsertPrice(propertyId, 1500);

    const uploadReturnValues: UploadResults = await uploadFilesHandler(values.images,BlobNamePrefix.PROPERTY)

    if (uploadReturnValues.failed.length > 0) {
      console.error("Failed to upload some images:", uploadReturnValues.failed);
      throw new Meteor.Error(`Image upload failed. Please try again.`);
      return;
    } 

    const imageUrls: string[] = uploadReturnValues.success.map((uploadResult) => {return uploadResult.url})
    await apiInsertPropertyListing(propertyId,imageUrls,ListingStatus.DRAFT)

    navigator(`${NavigationPath.PropertyListing}?propertyId=${propertyId}`)
  }
)

export const selectPropertyFormUiState = (state: RootState) =>
  state.propertyForm;
