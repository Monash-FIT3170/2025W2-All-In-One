import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "/app/store";
// Define the structure of AboutPageUiState
export type AboutPageUiState = {
  isLoading: boolean;
  agentDescription: string;
  tenantDescription: string;
  landlordDescription: string;
};

const initialState: AboutPageUiState = {
  isLoading: false,
  agentDescription: "",
  tenantDescription: "",
  landlordDescription: "",
};

const aboutPageSlice = createSlice({
  name: "aboutPage",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDescriptions: (
      state,
      action: PayloadAction<{
        agentDescription: string;
        tenantDescription: string;
        landlordDescription: string;
      }>
    ) => {
      state.agentDescription = action.payload.agentDescription;
      state.tenantDescription = action.payload.tenantDescription;
      state.landlordDescription = action.payload.landlordDescription;
    },
  },
});

export const { setLoading, setDescriptions } = aboutPageSlice.actions;

// Selector to retrieve the AboutPageUiState from the store
export const selectAboutPageUiState = (state: RootState): AboutPageUiState => state.aboutPage;

export default aboutPageSlice.reducer;
