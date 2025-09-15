import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

import { getLeaseAgreementsForProperty } from "/app/client/library-modules/domain-models/user-documents/repositories/lease-agreement-repository";
export interface TenantDocument {
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
	tenantName?: string;
	agentSigned?: boolean;
	tenantSigned?: boolean;
	landlordSigned?: boolean;
}

interface TenantDocumentsState {
	isLoading: boolean;
	documents: TenantDocument[];
	error: string | null;
	uploadProgress: number;
	isUploading: boolean;
	agentSigned?: boolean;
	tenantSigned?: boolean;
	landlordSigned?: boolean;
}

const initialState: TenantDocumentsState = {
	isLoading: false,
	documents: [],
	error: null,
	uploadProgress: 0,
	isUploading: false,
	agentSigned: false,
	tenantSigned: false,
	landlordSigned: false,
};

// For tenants: fetch documents for their assigned property
export const fetchTenantDocuments = createAsyncThunk(
	"tenantDocuments/fetchDocuments",
	async (propertyId: string) => {
		try {
			const leaseAgreements = await getLeaseAgreementsForProperty(propertyId);
			return leaseAgreements.map((doc) => ({
				...doc,
				fileName: doc.documentUrl.split("/").pop() || "Unknown Document",
				documentType: "Lease Agreement",
			}));
		} catch (error) {
			console.error("Error fetching tenant documents:", error);
			throw new Error("Failed to fetch tenant documents");
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
			});
	},
});

export const { setLoading, setError, setUploadProgress, clearError } =
	tenantDocumentsSlice.actions;

export const selectTenantDocuments = (state: RootState) =>
	state.tenantDocuments;
export const selectDocuments = (state: RootState) =>
	state.tenantDocuments.documents;
export const selectDocumentsLoading = (state: RootState) =>
	state.tenantDocuments.isLoading;
export const selectDocumentsError = (state: RootState) =>
	state.tenantDocuments.error;
export const selectUploadProgress = (state: RootState) =>
	state.tenantDocuments.uploadProgress;
export const selectIsUploading = (state: RootState) =>
	state.tenantDocuments.isUploading;

export default tenantDocumentsSlice.reducer;
