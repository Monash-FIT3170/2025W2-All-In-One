import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { InsertLeaseAgreementPayload } from "/app/shared/api-models/user-documents/ApiLeaseAgreement";
import { getLeaseAgreementsForAgent, insertLeaseAgreement, deleteLeaseAgreement } from "../../../../library-modules/domain-models/user-documents/repositories/lease-agreement-repository";
import { uploadFilesHandler } from "../../../../library-modules/apis/azure/blob-api";
import { BlobNamePrefix } from "/app/shared/azure/blob-models";
import { LeaseAgreementDocument } from "../../../../library-modules/domain-models/user-documents/LeaseAgreement";
import { getPropertyByAgentId } from "../../../../library-modules/domain-models/property/repositories/property-repository";

// Types
export interface AgentDocument extends LeaseAgreementDocument {
  propertyAddress: string; // Additional field for display
  tenantId?: string; // Additional field for display
  tenantName?: string; // Additional field for display
}

export interface AgentDocumentState {
  documents: AgentDocument[];
  isLoading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  selectedPropertyId: string | null;
}

// Initial state
const initialState: AgentDocumentState = {
  documents: [],
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  error: null,
  selectedPropertyId: null,
};

// Async thunks
export const fetchAgentDocuments = createAsyncThunk(
  "agentDocuments/fetchDocuments",
  async (agentId: string) => {
    try {
      const [documents, properties] = await Promise.all([
        getLeaseAgreementsForAgent(agentId),
        getPropertyByAgentId(agentId)
      ]);

      // Create a map of propertyId to property details for quick lookup
      const propertyMap = new Map(properties.map(prop => [prop.propertyId, prop]));

      // Map documents with property details and tenant names
      const enrichedDocuments = documents.map(doc => {
        const property = propertyMap.get(doc.propertyId);
        const propertyAddress = property 
          ? `${property.streetnumber} ${property.streetname}, ${property.suburb}`
          : "Property address unavailable";
        
        return {
          ...doc,
          propertyAddress,
          tenantName: doc.tenantName || "No tenant assigned"
        };
      });

      return enrichedDocuments;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch documents");
    }
  }
);

export const uploadAgentDocument = createAsyncThunk(
  "agentDocuments/uploadDocument",
  async (payload: {
    file: File;
    propertyId: string;
    agentId: string;
    validUntil: Date;
  }) => {
    try {
      // Use uploadFilesHandler which expects an array of Files and returns UploadResults
      const uploadResults = await uploadFilesHandler([payload.file], BlobNamePrefix.DOCUMENT);
      
      if (uploadResults.failed.length > 0) {
        throw new Error(`File upload failed: ${uploadResults.failed[0].error}`);
      }
      
      if (uploadResults.success.length === 0) {
        throw new Error("Upload succeeded but no results returned");
      }
      
      const uploadResult = uploadResults.success[0];

      const documentPayload: InsertLeaseAgreementPayload = {
        propertyId: payload.propertyId,
        agentId: payload.agentId,
        validUntil: payload.validUntil,
        documentUrl: uploadResult.url,
      };

      const result = await insertLeaseAgreement(documentPayload);

      // Get property details for the new document
      const properties = await getPropertyByAgentId(payload.agentId);
      const property = properties.find(prop => prop.propertyId === payload.propertyId);
      const propertyAddress = property 
        ? `${property.streetnumber} ${property.streetname}, ${property.suburb}`
        : "Property address unavailable";

      return {
        _id: result._id,
        propertyId: result.propertyId,
        agentId: result.agentId,
        validUntil: new Date(result.validUntil),
        uploadedDate: new Date(result.uploadedDate),
        documentUrl: result.documentUrl,
        propertyAddress,
        tenantName: "No tenant assigned" // New uploads don't have tenants initially
      } as LeaseAgreementDocument;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Upload failed");
    }
  }
);

export const deleteAgentDocument = createAsyncThunk(
  "agentDocuments/deleteDocument",
  async (documentId: string) => {
    try {
      await deleteLeaseAgreement(documentId);
      return documentId;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Delete failed");
    }
  }
);

// Slice
export const agentDocumentsSlice = createSlice({
  name: "agentDocuments",
  initialState,
  reducers: {
    setSelectedProperty: (state, action: PayloadAction<string | null>) => {
      state.selectedPropertyId = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch documents
    builder
      .addCase(fetchAgentDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgentDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload; // Data is already enriched with propertyAddress and tenantName
      })
      .addCase(fetchAgentDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch documents";
      });

    // Upload document
    builder
      .addCase(uploadAgentDocument.pending, (state) => {
        state.isUploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadAgentDocument.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 100;
        const newDoc: AgentDocument = {
          ...action.payload,
          tenantId: undefined, // Keep this for compatibility
          propertyAddress: (action.payload as any).propertyAddress || "Property address unavailable",
        };
        state.documents.unshift(newDoc);
      })
      .addCase(uploadAgentDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.error.message || "Upload failed";
      });

    // Delete document
    builder
      .addCase(deleteAgentDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (doc) => doc._id !== action.payload
        );
      })
      .addCase(deleteAgentDocument.rejected, (state, action) => {
        state.error = action.error.message || "Delete failed";
      });
  },
});

// Actions
export const {
  setSelectedProperty,
  setUploadProgress,
  clearError,
  clearUploadProgress,
} = agentDocumentsSlice.actions;

// Selectors
export const selectAgentDocuments = (state: { agentDocuments: AgentDocumentState }) =>
  state.agentDocuments.documents;

export const selectAgentDocumentsLoading = (state: { agentDocuments: AgentDocumentState }) =>
  state.agentDocuments.isLoading;

export const selectAgentDocumentsError = (state: { agentDocuments: AgentDocumentState }) =>
  state.agentDocuments.error;

export const selectIsUploading = (state: { agentDocuments: AgentDocumentState }) =>
  state.agentDocuments.isUploading;

export const selectUploadProgress = (state: { agentDocuments: AgentDocumentState }) =>
  state.agentDocuments.uploadProgress;

export const selectSelectedPropertyId = (state: { agentDocuments: AgentDocumentState }) =>
  state.agentDocuments.selectedPropertyId;

export const selectDocumentsByProperty = (state: { agentDocuments: AgentDocumentState }, propertyId: string) =>
  state.agentDocuments.documents.filter(doc => doc.propertyId === propertyId);

// Reducer
export default agentDocumentsSlice.reducer;
