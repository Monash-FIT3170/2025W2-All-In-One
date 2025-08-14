import { create } from "domain";
import { PropertyWithListingData } from "/app/client/library-modules/use-cases/property-listing/models/PropertyWithListingData";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { S } from "@fullcalendar/core/internal-common";

export type SearchResultState = {
    decodedQuery: string;
    properties: PropertyWithListingData[];
    isLoading: boolean;
    error: string | null;
    visibleCount: number;
};

const initialState: SearchResultState = {
    decodedQuery: "",
    properties: [],
    isLoading: true,
    error: null,
    visibleCount: 9, // default page size ( how many properties to show initially )
};

export const fetchPropertiesByQuery = createAsyncThunk<
    PropertyWithListingData[], // Returns an array of PropertyWithListingData
    string
>("search/fetchPropertiesByQuery", async (decodedQuery) => {
    const q = decodedQuery.trim();

    if (!q) {
        return [];
    }

    return []; // Placeholder for actual fetching logic
});
