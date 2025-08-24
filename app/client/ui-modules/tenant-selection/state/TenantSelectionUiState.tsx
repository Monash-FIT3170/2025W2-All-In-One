import { TenantApplication } from "../types/TenantApplication";
import { FilterType } from "../enums/FilterType";

export type TenantSelectionUiState = {
  // Property specific applications: { propertyId: TenantApplication[] }
  applicationsByProperty: Record<string, TenantApplication[]>;

  // UI state
  activeFilter: FilterType;
  isLoading: boolean;
  error: string | null;
  currentStep: number;
  isModalOpen: boolean;
};