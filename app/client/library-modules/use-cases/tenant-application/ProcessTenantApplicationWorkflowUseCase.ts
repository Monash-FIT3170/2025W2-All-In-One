// app/client/library-modules/use-cases/tenant-application/ProcessTenantApplicationWorkflowUseCase.ts
import { updateTenantApplicationStatus } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { apiCreateTaskForLandlord} from "/app/client/library-modules/apis/task/task-api"
import { TaskPriority } from "/app/shared/task-priority-identifier";
import { Role } from "/app/shared/user-role-identifier";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { TenantApplication } from "/app/client/ui-modules/tenant-selection/types/TenantApplication";
import { createTenantApplication } from "./CreateTenantApplicationUseCase";
import { CurrentUserState } from "/app/client/ui-modules/user-authentication/state/CurrentUserState";

export interface ProcessTenantApplicationRequest {
  propertyId: string;
  propertyLandlordId: string;
  currentUser: CurrentUserState["currentUser"]
  profileData?: CurrentUserState["profileData"]
  authUser: CurrentUserState["authUser"]
  bookedInspections: Set<number>;
}

export interface ProcessTenantApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: string;
}


export function validateUserCanApply(authUser: any, currentUser: any, bookedInspections: Set<number>): void {
  // Check if user is logged in
  if (!currentUser) {
    throw new Error('Please log in to apply for this property.');
  }

  // Check if user is a tenant
  if (authUser && authUser.role !== Role.TENANT) {
    throw new Error('Only tenants can apply for properties.');
  }

  // Check if user has booked an inspection
  if (bookedInspections.size === 0) {
    throw new Error('Please book an inspection before applying for this property.');
  }
}

export async function processTenantApplication(request: ProcessTenantApplicationRequest): Promise<ProcessTenantApplicationResponse> {
  try {
    // Validate user can apply
    validateUserCanApply(request.authUser, request.currentUser, request.bookedInspections);

    // Create tenant application
    const result = await createTenantApplication({
      propertyId: request.propertyId,
      propertyLandlordId: request.propertyLandlordId,
      currentUser: request.currentUser,
      profileData: request.profileData
    });

    return {
      success: true,
      message: 'Application submitted successfully! Your application will be reviewed by the agent.',
      applicationId: result.applicationId
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit application. Please try again.'
    };
  }
}
export async function acceptTenantApplication(applicationId: string): Promise<{ applicationId: string; status: TenantApplicationStatus }> {
  await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.ACCEPTED, 1);
  return { applicationId, status: TenantApplicationStatus.ACCEPTED };
}

export async function rejectTenantApplication(applicationId: string): Promise<{ applicationId: string; status: TenantApplicationStatus }> {
  await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.REJECTED, 1);
  return { applicationId, status: TenantApplicationStatus.REJECTED };
}
export async function sendAcceptedApplicationsToLandlord(
  propertyId: string,
  propertyLandlordId: string,
  propertyAddress: string,
  acceptedApplications: TenantApplication[]
): Promise<{ success: boolean; propertyId: string; acceptedApplications: string[]; applicationCount: number; taskId: string }> {

  if (acceptedApplications.length === 0) {
    throw new Error('No accepted applications to send to landlord');
  }

  // Create task for landlord
  const taskName = `Review ${acceptedApplications.length} Tenant Application(s)`;
  const taskDescription = `Review ${acceptedApplications.length} accepted tenant application(s) for property at ${propertyAddress}. Applicants: ${acceptedApplications.map(app => app.name).join(', ')}`;

  const taskResult = await apiCreateTaskForLandlord({
    name: taskName,
    description: taskDescription,
    dueDate: calculateDueDate(7),
    priority: TaskPriority.MEDIUM,
    propertyAddress,
    propertyId,
    userType: Role.LANDLORD,
    userId: propertyLandlordId,
  });

  // Update applications to LANDLORD_REVIEW status
  const acceptedApplicationIds = acceptedApplications.map(app => app.id);
  await updateTenantApplicationStatus(acceptedApplicationIds, TenantApplicationStatus.LANDLORD_REVIEW, 2, taskResult);

  return {
    success: true,
    propertyId,
    acceptedApplications: acceptedApplicationIds,
    applicationCount: acceptedApplications.length,
    taskId: taskResult
  };
}


export function calculateDueDate(daysFromNow: number): Date {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysFromNow);
  return dueDate;
}