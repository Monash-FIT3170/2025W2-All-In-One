import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { 
  apiGetLeaseAgreementsForProperty, 
  apiInsertLeaseAgreement, 
  apiDeleteLeaseAgreement 
} from "/app/client/library-modules/apis/user-documents/lease-agreement-api";
import { ApiLeaseAgreement, InsertLeaseAgreementPayload } from "/app/shared/api-models/user-documents/ApiLeaseAgreement";
import { uploadFileHandler } from "/app/client/library-modules/apis/azure/blob-api";
import { BlobNamePrefix } from "/app/shared/azure/blob-models";

export interface TenantDocument {
  _id: string;
  propertyId: string;
  agentId: string;
  uploadedDate: Date;
  validUntil: Date;
  documentUrl: string;
  fileName?: string;
  documentType?: string;
  propertyAddress?: string;
  tenantName?: string;
}

interface TenantDocumentsState {
  isLoading: boolean;
  documents: TenantDocument[];
  error: string | null;
  uploadProgress: number;
  isUploading: boolean;
}

const initialState: TenantDocumentsState = {
  isLoading: false,
  documents: [],
  error: null,
  uploadProgress: 0,
  isUploading: false,
};

// For tenants: fetch documents for their assigned property
export const fetchTenantDocuments = createAsyncThunk(
  "tenantDocuments/fetchDocuments",
  async (propertyId: string) => {
    try {
      const leaseAgreements = await apiGetLeaseAgreementsForProperty(propertyId);
      return leaseAgreements.map(doc => ({
        ...doc,
        fileName: doc.documentUrl.split('/').pop() || 'Unknown Document',
        documentType: 'Lease Agreement'
      }));
    } catch (error) {
      console.error("Error fetching tenant documents:", error);
      throw new Error("Failed to fetch tenant documents");
    }
  }
);

// For agents: upload document for a specific property
export const uploadTenantDocument = createAsyncThunk(
  "tenantDocuments/uploadDocument",
  async (payload: {
    file: File;
    propertyId: string;
    agentId: string;
    validUntil: Date;
  }) => {
    try {
      // Upload file to blob storage
      const blobName = `${BlobNamePrefix.DOCUMENT}${Date.now()}-${payload.file.name}`;
      const uploadResult = await uploadFileHandler(payload.file, blobName);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "File upload failed");
      }

      // Create lease agreement document
      const leaseAgreementData: InsertLeaseAgreementPayload = {
        propertyId: payload.propertyId,
        agentId: payload.agentId,
        documentUrl: uploadResult.url,
        validUntil: payload.validUntil,
      };

      const newDocument = await apiInsertLeaseAgreement(leaseAgreementData);
      
      return {
        ...newDocument,
        fileName: payload.file.name,
        documentType: 'Lease Agreement'
      };
    } catch (error) {
      console.error("Error uploading tenant document:", error);
      throw new Error("Failed to upload document");
    }
  }
);

export const deleteTenantDocument = createAsyncThunk(
  "tenantDocuments/deleteDocument",
  async (documentId: string) => {
    try {
      await apiDeleteLeaseAgreement(documentId);
      return documentId;
    } catch (error) {
      console.error("Error deleting tenant document:", error);
      throw new Error("Failed to delete document");
    }
  }
);

export const tenantDocumentsSlice = createSlice({
  name: "tenantDocuments",
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
      .addCase(fetchTenantDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenantDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
        state.error = null;
      })
      .addCase(fetchTenantDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch documents";
      })
      // Upload document
      .addCase(uploadTenantDocument.pending, (state) => {
        state.isUploading = true;
        state.uploadProgress = 0;
        state.error = null;
      })
      .addCase(uploadTenantDocument.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 100;
        state.documents.unshift(action.payload);
        state.error = null;
      })
      .addCase(uploadTenantDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 0;
        state.error = action.error.message || "Failed to upload document";
      })
      // Delete document
      .addCase(deleteTenantDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc._id !== action.payload);
      })
      .addCase(deleteTenantDocument.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete document";
      });
  },
});

export const { 
  setLoading, 
  setError, 
  setUploadProgress, 
  clearError 
} = tenantDocumentsSlice.actions;

export const selectTenantDocuments = (state: RootState) => state.tenantDocuments;
export const selectDocuments = (state: RootState) => state.tenantDocuments.documents;
export const selectDocumentsLoading = (state: RootState) => state.tenantDocuments.isLoading;
export const selectDocumentsError = (state: RootState) => state.tenantDocuments.error;
export const selectUploadProgress = (state: RootState) => state.tenantDocuments.uploadProgress;
export const selectIsUploading = (state: RootState) => state.tenantDocuments.isUploading;

export default tenantDocumentsSlice.reducer;
