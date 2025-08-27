import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { ProfileData } from "/app/client/library-modules/domain-models/user/ProfileData"
import { UserAccount } from "/app/client/library-modules/domain-models/user/UserAccount";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";

type RoleUser = Agent | Tenant | Landlord;

export type CreateTenantApplicationRequest = {
  propertyId: string;
  propertyLandlordId: string;
  currentUser: RoleUser | null;
  profileData?: ProfileData | null;
  authUser: UserAccount | null;
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