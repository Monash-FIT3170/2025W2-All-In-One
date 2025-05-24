import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";

export type GuestLandingPageUiState = {
  isLoading: boolean;
  properties: ApiProperty[];
  error: string | null;
};