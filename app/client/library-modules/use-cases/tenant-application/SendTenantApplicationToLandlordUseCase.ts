import { updateTenantApplicationStatus, updateTenantApplicationLinkedTaskId } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { TaskPriority } from "/app/shared/task-priority-identifier";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { TenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication";
import { createTaskForLandlord, updateTaskForLandlord } from "../../domain-models/task/repositories/task-repository";

/*WILL SEPARATE THESE USE CASES INTO SEPARATE FILES LATER*/

export async function sendAcceptedApplicationsToLandlordUseCase(
  propertyId: string,
  landlordId: string,
  streetNumber: string,
  street: string,
  suburb: string,
  province: string,
  postcode: string,
  acceptedApplications: TenantApplication[]
): Promise<{ success: boolean; propertyId: string; acceptedApplications: string[]; applicationCount: number; taskId: string }> {
  validateTaskInputs(propertyId, landlordId);
  ensureNonEmptyApplications(acceptedApplications, 'No accepted applications to send to landlord')

  // Create task for landlord
  const taskName = `Review ${acceptedApplications.length} Tenant Application(s)`;
  const taskDescription = `Review ${acceptedApplications.length} accepted tenant application(s) for property at ${streetNumber} ${street}, ${suburb}, ${province} ${postcode}. Applicants: ${acceptedApplications.map((app: TenantApplication) => app.applicantName).join(', ')}`;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  // Create task for landlord
  const taskResult = await createTaskForLandlord({
    name: taskName,
    description: taskDescription,
    dueDate: dueDate,
    priority: TaskPriority.MEDIUM,
    propertyAddress: `${streetNumber} ${street}, ${suburb}, ${province} ${postcode}`,
    propertyId: propertyId,
    userId: landlordId,
  });

  // Update all accepted applications to LANDLORD_REVIEW status
  const acceptedApplicationIds = acceptedApplications.map((app: TenantApplication) => app.id);
  await updateTenantApplicationStatus(
    acceptedApplicationIds,
    TenantApplicationStatus.LANDLORD_REVIEW,
    2,
    taskResult // Passes the task ID to link applications to the task
  );

  // Update applications to store the linkedTaskId
  for (const applicationId of acceptedApplicationIds) {
    await updateTenantApplicationLinkedTaskId(applicationId, taskResult);
  }

  console.log(`Successfully sent ${acceptedApplications.length} application(s) to landlord ${landlordId} for property ${propertyId}`);

  return {
    success: true,
    propertyId,
    acceptedApplications: acceptedApplicationIds,
    applicationCount: acceptedApplications.length,
    taskId: taskResult
  };
}


export async function sendBackgroundPassedToLandlordUseCase(
  propertyId: string,
  landlordId: string,
  streetNumber: string,
  street: string,
  suburb: string,
  province: string,
  postcode: string,
  passedApplications: TenantApplication[],

): Promise<{ success: boolean; propertyId: string; passedApplications: string[]; applicationCount: number; taskId: string }> {
  validateTaskInputs(propertyId, landlordId);
  ensureNonEmptyApplications(passedApplications, 'No accepted applications to send to landlord')

  const updatedTaskName = `Background Check for ${passedApplications.length} Tenant Application(s)`;
  const updatedTaskDescription = `Background check for ${passedApplications.length} tenant application(s) at ${streetNumber} ${street}, ${suburb}, ${province} ${postcode}. Applicants: ${passedApplications.map(a => a.applicantName).join(', ')}`;
  const updatedDueDate = new Date();
  updatedDueDate.setDate(updatedDueDate.getDate() + 7);

  const existingTaskId = passedApplications[0].linkedTaskId;

  if (!existingTaskId) {
    throw new Error('No linked task ID found for background check applications');
  }

  const taskResult = await updateTaskForLandlord({
    taskId: existingTaskId,
    name: updatedTaskName,
    description: updatedTaskDescription,
    dueDate: updatedDueDate,
    priority: TaskPriority.MEDIUM,
  });

  const ids = passedApplications.map(a => a.id);
  await updateTenantApplicationStatus(
    ids,
    TenantApplicationStatus.FINAL_REVIEW,
    4,
    taskResult
  );
  return {
    success: true,
    propertyId,
    passedApplications: ids,
    applicationCount: passedApplications.length,
    taskId: taskResult
  };
}

export function validateTaskInputs(propertyId: string, landlordId: string): void {
  if (!propertyId) {
    throw new Error('Property ID is required to send applications to landlord');
  }
  if (!landlordId) {
    throw new Error('Property landlord ID is required to send tenant to landlord');
  }

}

export function ensureNonEmptyApplications(apps: TenantApplication[], message: string): void {
  if (!Array.isArray(apps) || apps.length === 0) {
    throw new Error(message);
  }
}
export function calculateDueDate(daysFromNow: number): Date {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysFromNow);
  return dueDate;
}

