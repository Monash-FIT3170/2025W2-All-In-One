// app/client/library-modules/use-cases/tenant-application/ProcessTenantApplicationWorkflowUseCase.ts
import { updateTenantApplicationStatus } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { apiCreateTaskForLandlord} from "/app/client/library-modules/apis/task/task-api"
import { TaskPriority } from "/app/shared/task-priority-identifier";
import { Role } from "/app/shared/user-role-identifier";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { TenantApplication } from "/app/client/ui-modules/tenant-selection/types/TenantApplication";

export async function acceptTenantApplicationUseCase(applicationId: string): Promise<{ applicationId: string; status: TenantApplicationStatus }> {
  await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.ACCEPTED, 1);
  return { applicationId, status: TenantApplicationStatus.ACCEPTED };
}

export async function rejectTenantApplicationUseCase(applicationId: string): Promise<{ applicationId: string; status: TenantApplicationStatus }> {
  await updateTenantApplicationStatus([applicationId], TenantApplicationStatus.REJECTED, 1);
  return { applicationId, status: TenantApplicationStatus.REJECTED };
}

export async function sendAcceptedApplicationsToLandlordUseCase(
  propertyId: string,
  propertyLandlordId: string,
  streetNumber: string,
  street: string,
  suburb: string,
  province: string,
  postcode: string,
  acceptedApplications: TenantApplication[]
): Promise<{ success: boolean; propertyId: string; acceptedApplications: string[]; applicationCount: number; taskId: string }> {

  if (!propertyId) {
    throw new Error('Property ID is required to send applications to landlord');
  }

  if (!propertyLandlordId) {
    throw new Error('Property landlord ID is required to send tenant to landlord');
  }

  if (acceptedApplications.length === 0) {
    throw new Error('No accepted applications to send to landlord');
  }

  // Create task for landlord
  const taskName = `Review ${acceptedApplications.length} Tenant Application(s)`;
  const taskDescription = `Review ${acceptedApplications.length} accepted tenant application(s) for property at ${streetNumber} ${street}, ${suburb}, ${province} ${postcode}. Applicants: ${acceptedApplications.map((app: TenantApplication) => app.name).join(', ')}`;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  // Create task for landlord
  const taskResult = await apiCreateTaskForLandlord({
    name: taskName,
    description: taskDescription,
    dueDate: dueDate,
    priority: TaskPriority.MEDIUM,
    userId: propertyLandlordId,
    propertyAddress: `${streetNumber} ${street}, ${suburb}, ${province} ${postcode}`,
    propertyId: propertyId,
    userType: Role.LANDLORD,
  });

  // Update all accepted applications to LANDLORD_REVIEW status
  const acceptedApplicationIds = acceptedApplications.map((app: TenantApplication) => app.id);
  await updateTenantApplicationStatus(
    acceptedApplicationIds,
    TenantApplicationStatus.LANDLORD_REVIEW,
    2,
    taskResult // Passes the task ID to link applications to the task
  );

  console.log(`Successfully sent ${acceptedApplications.length} application(s) to landlord ${propertyLandlordId} for property ${propertyId}`);

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