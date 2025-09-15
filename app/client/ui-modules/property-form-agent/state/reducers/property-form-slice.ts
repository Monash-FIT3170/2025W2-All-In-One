import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "/app/client/store";
import { PropertyFormPageUiState } from "../PropertyFormPageUIState";
import { getAllLandlords } from "/app/client/library-modules/domain-models/user/role-repositories/landlord-repository";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { getProfileDataById } from "/app/client/library-modules/domain-models/user/role-repositories/profile-data-repository";

import { PropertyFeatureDocument } from "/app/server/database/property/models/PropertyFeatureDocument";
import { getAllPropertyFeatures } from "/app/client/library-modules/domain-models/property/repositories/feature-respository";
import { insertProperty } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { BlobNamePrefix, UploadResults } from "/app/shared/azure/blob-models";
import {
  getImageUrlsFromUploadResults,
  uploadFilesHandler,
} from "/app/client/library-modules/apis/azure/blob-api";
import { ListingStatus } from "/app/shared/api-models/property-listing/ListingStatus";
import { insertPropertyListingInspections, insertPropertyListing } from "/app/client/library-modules/domain-models/property-listing/repositories/listing-repository";
import { insertPropertyPrice } from "/app/client/library-modules/domain-models/property-price/property-price-repository";
import { FormSchemaType } from "../../components/FormSchema";
import { mapFormSchemaToPropertyInsertData } from "/app/client/library-modules/domain-models/property/repositories/mappers/property-mapper";

const initialState: PropertyFormPageUiState = {
  propertyId: "",
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
      state.landlords = action.payload.landlordsWithProfileData;
      state.features = action.payload.features;
      state.featureOptions = action.payload.features.map((feature) => ({
        value: feature._id,
        label: feature.name,
      }));
    });
    builder.addCase(submitForm.fulfilled, (state, action) => {
      state.propertyId = action.payload.propertyId;
    });
  },
});

export const load = createAsyncThunk("propertyForm/load", async () => {
  const landlords: Landlord[] = await getAllLandlords();
  const features: PropertyFeatureDocument[] = await getAllPropertyFeatures();
  const landlordsWithProfileData = await Promise.all(
    landlords.map(async (landlord) => {
      const profile = await getProfileDataById(landlord.profileDataId);

      return {
        ...landlord,
        firstName: profile.firstName,
        lastName: profile.lastName,
      };
    })
  );
  return { landlordsWithProfileData, features };
});

export const submitForm = createAsyncThunk(
  "propertyForm/insertProperty",
  async (propertyFormData: FormSchemaType) => {
    const { propertyInsertData, monthly_rent, images } =
      await mapFormSchemaToPropertyInsertData(propertyFormData);

    const propertyId = await insertProperty(propertyInsertData);
    await insertPropertyPrice(propertyId, monthly_rent);

    // Handle image uploads
    const fileObjects = images.filter(item => item instanceof File) as File[];
    const uploadResults: UploadResults = await uploadFilesHandler(
      fileObjects,
      BlobNamePrefix.PROPERTY
    );
    const imageUrls = getImageUrlsFromUploadResults(uploadResults);
    const inspectionIds = await insertPropertyListingInspections(
      (propertyFormData.inspection_times ?? []).map((t) => ({
        start_time: t.start_time,
        end_time: t.end_time,
      }))
    );

    await insertPropertyListing(propertyId, imageUrls, ListingStatus.DRAFT, inspectionIds, propertyFormData.lease_term);
    return { propertyId };
  }
);

export const selectPropertyFormUiState = (state: RootState) =>
  state.propertyForm;
