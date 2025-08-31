import { TenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication";
import { FilterType } from "../enums/FilterType";

export type TenantSelectionUiState = {
  // Property specific applications: { propertyId: TenantApplication[] }
  applicationsByProperty: Record<string, TenantApplication[]>;

  // UI state
  activeFilter: FilterType;
  isLoading: boolean;
  error: string | null;
  currentStep: number;
  bookedInspections: number[];
};