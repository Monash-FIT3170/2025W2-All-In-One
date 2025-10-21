import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { InsertLeaseAgreementPayload } from "/app/shared/api-models/user-documents/ApiLeaseAgreement";
import {
	getLeaseAgreementsForAgent,
	insertLeaseAgreement,
	deleteLeaseAgreement,
	searchLeaseAgreement,
} from "../../../../library-modules/domain-models/user-documents/repositories/lease-agreement-repository";
import { uploadFilesHandler } from "../../../../library-modules/apis/azure/blob-api";
import { BlobNamePrefix } from "/app/shared/azure/blob-models";
import { LeaseAgreementDocument } from "../../../../library-modules/domain-models/user-documents/LeaseAgreement";
import { getPropertyByAgentId } from "../../../../library-modules/domain-models/property/repositories/property-repository";
import { getTenantById } from "/app/client/library-modules/domain-models/user/role-repositories/tenant-repository";
import { getUserAccountById } from "/app/client/library-modules/domain-models/user/user-account-repositories/user-account-repository";
import { getProfileDataById } from "/app/client/library-modules/domain-models/user/role-repositories/profile-data-repository";

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

	search: string;
		
}

// Initial state
const initialState: AgentDocumentState = {
	documents: [],
	isLoading: false,
	isUploading: false,
	uploadProgress: 0,
	error: null,
	selectedPropertyId: null,

	search: "",
};

// Async thunks
export const fetchAgentDocuments = createAsyncThunk<
  AgentDocument[],                                  // return type
  { agentId: string; query?: string }               // arg type
>(
  "agentDocuments/fetchDocuments",
  async ({ agentId, query }) => {
    try {
      // 1) Fetch docs (all vs search) — both must return LeaseAgreementDocument[]
      const documents: LeaseAgreementDocument[] = await (
        query && query.trim()
          ? searchLeaseAgreement(agentId, query.trim())
          : getLeaseAgreementsForAgent(agentId)
      );

      // 2) Fetch properties and index by propertyId (no Map)
      const properties = await getPropertyByAgentId(agentId);
      const propertyIndex: Record<string, typeof properties[number]> = {};
      properties.forEach(p => {
        propertyIndex[p.propertyId] = p;
      });



			// gets all the profile data by id in parallel
      const tenantProfiles = await Promise.all(
				documents.map(async (doc) => {
				if (!doc.tenantId) return null;
				try {
					return await getProfileDataById(doc.tenantId);
				} catch {
				return null;
    }
  })
);
   

      // 4) Enrich documents
      const enriched: AgentDocument[] = documents.map((doc, i) => {
  			const tenant = tenantProfiles[i];
  			const tenantName = tenant
    			? `${tenant.firstName ?? ""} ${tenant.lastName ?? ""}`.trim()
    			: "No tenant assigned";

				const property = propertyIndex[doc.propertyId];
				const propertyAddress = property
					? `${property.streetnumber} ${property.streetname}, ${property.suburb}`
					: "Property address unavailable";

  return {
    ...doc,
    propertyAddress,
    tenantName,
  };
});

      return enriched;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch documents"
      );
    }
  }
);

export const uploadAgentDocument = createAsyncThunk(
	"agentDocuments/uploadDocument",
	async (payload: {
		title: string;
		file: File;
		propertyId: string;
		agentId: string;
		validUntil: Date;
	}) => {
		try {
			// Use uploadFilesHandler which expects an array of Files and returns UploadResults
			const uploadResults = await uploadFilesHandler(
				[payload.file],
				BlobNamePrefix.DOCUMENT
			);

			if (uploadResults.failed.length > 0) {
				throw new Error(`File upload failed: ${uploadResults.failed[0].error}`);
			}

			if (uploadResults.success.length === 0) {
				throw new Error("Upload succeeded but no results returned");
			}

			const uploadResult = uploadResults.success[0];

			const documentPayload: InsertLeaseAgreementPayload = {
				title: payload.title,
				propertyId: payload.propertyId,
				agentId: payload.agentId,
				validUntil: payload.validUntil,
				documentUrl: uploadResult.url,
			};

			const result = await insertLeaseAgreement(documentPayload);

			// Get property details for the new document
			const properties = await getPropertyByAgentId(payload.agentId);
			const property = properties.find(
				(prop) => prop.propertyId === payload.propertyId
			);
			const propertyAddress = property
				? `${property.streetnumber} ${property.streetname}, ${property.suburb}`
				: "Property address unavailable";

			return {
				_id: result._id,
				title: result.title,
				propertyId: result.propertyId,
				agentId: result.agentId,
				validUntil: new Date(result.validUntil),
				uploadedDate: new Date(result.uploadedDate),
				documentUrl: result.documentUrl,
				propertyAddress,
				tenantName: "No tenant assigned", // New uploads don't have tenants initially
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
		setAgentDocSearch: (state, action: PayloadAction<string>) => {
			state.search = action.payload;
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
					propertyAddress:
						(action.payload as any).propertyAddress ||
						"Property address unavailable",
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
	setAgentDocSearch
} = agentDocumentsSlice.actions;

// Selectors
export const selectAgentDocuments = (state: {
	agentDocuments: AgentDocumentState;
}) => state.agentDocuments.documents;

export const selectAgentDocumentsLoading = (state: {
	agentDocuments: AgentDocumentState;
}) => state.agentDocuments.isLoading;

export const selectAgentDocumentsError = (state: {
	agentDocuments: AgentDocumentState;
}) => state.agentDocuments.error;

export const selectIsUploading = (state: {
	agentDocuments: AgentDocumentState;
}) => state.agentDocuments.isUploading;

export const selectUploadProgress = (state: {
	agentDocuments: AgentDocumentState;
}) => state.agentDocuments.uploadProgress;

export const selectSelectedPropertyId = (state: {
	agentDocuments: AgentDocumentState;
}) => state.agentDocuments.selectedPropertyId;

export const selectDocumentsByProperty = (
	state: { agentDocuments: AgentDocumentState },
	propertyId: string
) =>
	state.agentDocuments.documents.filter((doc) => doc.propertyId === propertyId);

	

// Reducer
export default agentDocumentsSlice.reducer;
