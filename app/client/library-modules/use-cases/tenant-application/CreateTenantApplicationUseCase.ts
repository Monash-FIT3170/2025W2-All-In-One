import { insertTenantApplication } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { getPropertyById } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { CurrentUserState } from "/app/client/ui-modules/user-authentication/state/CurrentUserState";

export interface CreateTenantApplicationRequest {
  propertyId: string;
  propertyLandlordId: string;
  currentUser: CurrentUserState["currentUser"];
  profileData?: CurrentUserState["profileData"];
}

export interface CreateTenantApplicationResponse {
  applicationId: string;
  applicantName: string;
  propertyId: string;
  propertyLandlordId: string;
  status: TenantApplicationStatus;
}


export function validateCreateTenantApplicationRequest(request: CreateTenantApplicationRequest): void {
  if (!request.currentUser) {
    throw new Error('User must be logged in to apply');
  }

  if (!request.propertyId) {
    throw new Error('Property ID is required to create application');
  }

  if (!request.propertyLandlordId) {
    throw new Error('Property landlord ID is required');
  }
}

export function determineApplicantName(currentUser: any, profileData?: any): string {
  if (profileData?.firstName && profileData?.lastName) {
    return `${profileData.firstName} ${profileData.lastName}`;
  }

  if (currentUser?.tenantId) {
    return `Tenant ${currentUser.tenantId.slice(-4)}`;
  }

  throw new Error('Only tenants can apply for properties. Invalid user type detected.');
}


export async function createTenantApplication(request: CreateTenantApplicationRequest): Promise<CreateTenantApplicationResponse> {

  validateCreateTenantApplicationRequest(request);


  const applicantName = determineApplicantName(request.currentUser, request.profileData);

  // Get property details
  const property = await getPropertyById(request.propertyId);
  const agentId = property.agentId;

  const applicationId = await insertTenantApplication({
    propertyId: request.propertyId,
    applicantName,
    agentId,
    landlordId: request.propertyLandlordId,
  });

  return {
    applicationId,
    applicantName,
    propertyId: request.propertyId,
    propertyLandlordId: request.propertyLandlordId,
    status: TenantApplicationStatus.UNDETERMINED,
  };
}