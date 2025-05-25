import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { ApiListing } from "/app/shared/api-models/property-listing/ApiListing";


export type PropertyWithListing = ApiProperty & {
  listing: ApiListing;
};

export type GuestLandingPageUiState = {
  isLoading: boolean;
  properties: PropertyWithListing[];
  error: string | null;
};