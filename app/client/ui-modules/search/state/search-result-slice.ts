import { PropertyWithListingData } from "/app/client/library-modules/use-cases/property-listing/models/PropertyWithListingData";
import {
	ActionReducerMapBuilder,
	createAsyncThunk,
	createSlice,
	PayloadAction,
} from "@reduxjs/toolkit";
import { searchProperties } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { getPropertyWithListingDataUseCase } from "/app/client/library-modules/use-cases/property-listing/GetPropertyWithListingDataUseCase";
import { RootState } from "/app/client/store";

export type SearchResultState = {
	isLoading: boolean;
	decodedQuery: string;
	properties: PropertyWithListingData[];
	error: string | null;
	visibleCount: number;

	defaultPageSize: number;
};

const initialState: SearchResultState = {
	decodedQuery: "",
	properties: [],
	error: null,
	defaultPageSize: 9,
	isLoading: false,
	visibleCount: 9, // default page size ( how many properties to show initially )
};

// This thunk fetches properties based on a search query
export const fetchPropertiesByQuery = createAsyncThunk<
	PropertyWithListingData[], // Returns an array of PropertyWithListingData
	string
>("search/fetchPropertiesByQuery", async (decodedQuery) => {
	const q = decodedQuery.trim();

	if (!q) {
		return []; // If the query is empty, return an empty array
	}

	const results = await searchProperties(q); // searches properties based on query

	const enrichedProperties = await Promise.all(
		results.map(async (property) => {
			return await getPropertyWithListingDataUseCase(property.propertyId);
		})
	);

	return enrichedProperties;
});

export const searchResultsSlice = createSlice({
	name: "searchResults",
	initialState,
	reducers: {
		setDecodedQuery: (
			state: SearchResultState,
			action: PayloadAction<string>
		) => {
			// added check to prevent unnecessary re-renders
			if (state.decodedQuery !== action.payload) {
				state.decodedQuery = action.payload;
				state.visibleCount = state.defaultPageSize;
			}
		},
		resetVisibleCount: (state: SearchResultState) => {
			state.visibleCount = state.defaultPageSize;
		},
		incrementVisibleCount: (state: SearchResultState) => {
			state.visibleCount = Math.min(
				state.visibleCount + state.defaultPageSize,
				state.properties.length
			);
		},
		clear(state: SearchResultState) {
			state.properties = [];
			state.error = null;
			state.isLoading = false;
			state.visibleCount = state.defaultPageSize;
		},
	},
	extraReducers: (builder: ActionReducerMapBuilder<SearchResultState>) => {
		builder
			.addCase(fetchPropertiesByQuery.pending, (state) => {
				state.error = null;
				state.isLoading = true;
				state.properties = [];
			})
			.addCase(fetchPropertiesByQuery.fulfilled, (state, action) => {
				state.properties = action.payload;
				state.isLoading = false;
			})
			.addCase(fetchPropertiesByQuery.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error?.message ?? "Failed to load results.";
				state.properties = [];
			});
	},
});

export const selectSearch = (s: RootState) => s.searchResults;

export const selectIsLoading = (s: RootState) => s.searchResults.isLoading;

export const selectShown = (s: RootState) => {
	const { properties, visibleCount } = s.searchResults;
	return properties.slice(0, visibleCount);
};

export const {
	setDecodedQuery,
	resetVisibleCount,
	incrementVisibleCount,
	clear,
} = searchResultsSlice.actions;
export default searchResultsSlice.reducer;
