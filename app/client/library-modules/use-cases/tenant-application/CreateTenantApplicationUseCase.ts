import { insertTenantApplication } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { getPropertyById } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { Role } from "/app/shared/user-role-identifier";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { CreateTenantApplicationRequest, CreateTenantApplicationResponse } from "./models/TenantApplicationsData";
import { Agent } from "../../domain-models/user/Agent";
import { Tenant } from "../../domain-models/user/Tenant";
import { Landlord } from "../../domain-models/user/Landlord";
import { UserAccount } from "../../domain-models/user/UserAccount";
import { ProfileData } from "../../domain-models/user/ProfileData";

export async function createTenantApplicationUseCase(request: CreateTenantApplicationRequest): Promise<CreateTenantApplicationResponse> {
    try {
      // Validate user can apply
      validateUserCanApply(request.authUser, request.currentUser, request.bookedInspections);

      // Validate request
      validateCreateTenantApplicationRequest(request);

      // Determine applicant name
      const applicantName = determineApplicantName(request.currentUser, request.profileData);

      // Get property details
      const property = await getPropertyById(request.propertyId);
      const agentId = property.agentId;

      // Create application
      const applicationId = await insertTenantApplication({
        propertyId: request.propertyId,
        applicantName,
        agentId,
        landlordId: request.propertyLandlordId,
        tenantUserId: request.tenantUserId,
      });

      return {
        success: true,
        message: 'Application submitted successfully! Your application will be reviewed by the agent.',
        applicationId,
        applicantName,
        propertyId: request.propertyId,
        propertyLandlordId: request.propertyLandlordId,
        tenantUserId: request.tenantUserId,
        status: TenantApplicationStatus.UNDETERMINED,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit application. Please try again.'
      };
    }
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

export function validateUserCanApply(authUser: UserAccount | null, currentUser: Agent | Tenant | Landlord | null, bookedInspections: Set<number>): void {
  if (!currentUser) {
    throw new Error('Please log in to apply for this property.');
  }

  if (authUser && authUser.role !== Role.TENANT) {
    throw new Error('Only tenants can apply for properties.');
  }

  if (bookedInspections.size === 0) {
    throw new Error('Please book an inspection before applying for this property.');
  }
}

export function determineApplicantName(currentUser: Agent | Tenant| Landlord | null, profileData?: ProfileData | null): string {
  if (profileData?.firstName && profileData?.lastName) {
    return `${profileData.firstName} ${profileData.lastName}`;
  }

  if (currentUser && 'tenantId' in currentUser) {
    return `Tenant ${currentUser.tenantId.slice(-4)}`;
  }

  throw new Error('Only tenants can apply for properties. Invalid user type detected.');
}

