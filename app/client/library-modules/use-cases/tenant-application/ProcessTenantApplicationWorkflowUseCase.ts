// app/client/library-modules/use-cases/tenant-application/ProcessTenantApplicationWorkflowUseCase.ts
import { updateTenantApplicationStatus } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { apiCreateTaskForLandlord} from "/app/client/library-modules/apis/task/task-api"
import { TaskPriority } from "/app/shared/task-priority-identifier";
import { Role } from "/app/shared/user-role-identifier";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { TenantApplication } from "/app/client/ui-modules/tenant-selection/types/TenantApplication";


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