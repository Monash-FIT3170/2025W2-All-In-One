import { CurrentUserState } from "/app/client/ui-modules/user-authentication/state/CurrentUserState";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";

export type CreateTenantApplicationRequest = {
  propertyId: string;
  propertyLandlordId: string;
  currentUser: CurrentUserState["currentUser"];
  profileData?: CurrentUserState["profileData"];
  authUser: CurrentUserState["authUser"];
  bookedInspections: Set<number>;
};

export type CreateTenantApplicationResponse = {
  success: boolean;
  message: string;
  applicationId?: string;
  applicantName?: string;
  propertyId?: string;
  propertyLandlordId?: string;
  status?: TenantApplicationStatus;
};