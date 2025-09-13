import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

import { getLeaseAgreementsForProperty } from "/app/client/library-modules/domain-models/user-documents/repositories/lease-agreement-repository";
export interface LandlordDocument {
  _id: string;
  propertyId: string;
  title: string;
  agentId: string;
  uploadedDate: Date;
  validUntil: Date;
  documentUrl: string;
  fileName?: string;
  documentType?: string;
  propertyAddress?: string;
  landlordName?: string;
  agentSigned?: boolean;
  landlordSigned?: boolean;
  tenantSigned?: boolean;
  Signed?: boolean;
}

interface LandlordDocumentsState {
  isLoading: boolean;
  documents: LandlordDocument[];
  error: string | null;
  uploadProgress: number;
  isUploading: boolean;
  agentSigned?: boolean;
  landlordSigned?: boolean;
  tenantSigned?: boolean;
  Signed?: boolean;
}

const initialState: LandlordDocumentsState = {
  isLoading: false,
  documents: [],
  error: null,
  uploadProgress: 0,
  isUploading: false,
  agentSigned: false,
  landlordSigned: false,
  tenantSigned: false,
  Signed: false,
};

// For landlords: fetch documents for their assigned property
export const fetchLandlordDocuments = createAsyncThunk(
  "landlordDocuments/fetchDocuments",
  async (propertyId: string) => {
    try {
      const leaseAgreements = await getLeaseAgreementsForProperty(propertyId);
      return leaseAgreements.map((doc) => ({
        ...doc,
        fileName: doc.documentUrl.split("/").pop() || "Unknown Document",
        documentType: "Lease Agreement",
      }));
    } catch (error) {
      console.error("Error fetching landlord documents:", error);
      throw new Error("Failed to fetch landlord documents");
    }
  }
);

export const landlordDocumentsSlice = createSlice({
  name: "landlordDocuments",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchLandlordDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLandlordDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
        state.error = null;
      })
      .addCase(fetchLandlordDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch documents";
      });
  },
});

export const { setLoading, setError, setUploadProgress, clearError } =
  landlordDocumentsSlice.actions;

export const selectlandlordDocuments = (state: RootState) =>
  state.landlordDocuments;
export const selectDocuments = (state: RootState) =>
  state.landlordDocuments.documents;
export const selectDocumentsLoading = (state: RootState) =>
  state.landlordDocuments.isLoading;
export const selectDocumentsError = (state: RootState) =>
  state.landlordDocuments.error;
export const selectUploadProgress = (state: RootState) =>
  state.landlordDocuments.uploadProgress;
export const selectIsUploading = (state: RootState) =>
  state.landlordDocuments.isUploading;

export default landlordDocumentsSlice.reducer;
