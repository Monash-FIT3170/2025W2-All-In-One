import { TenantApplication } from "../types/TenantApplication";
import { FilterType } from "../enums/FilterType";

export type ReviewTenantUiState = {
  applications: TenantApplication[];

  // UI state
  activeFilter: FilterType;
  isLoading: boolean;
  error: string | null;
  currentStep: number;


  isModalOpen: boolean;

  // Application counts for UI display
  acceptedCount: number;
  rejectedCount: number;
  undeterminedCount: number;


  hasAcceptedApplications: boolean;
  canSendToLandlord: boolean;
};