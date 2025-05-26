import { PropertyWithListingData } from "/app/client/library-modules/use-cases/property-listing/models/PropertyWithListingData";

export type GuestLandingPageUiState = {
  isLoading: boolean;
  properties: PropertyWithListingData[];
  error: string | null;
};