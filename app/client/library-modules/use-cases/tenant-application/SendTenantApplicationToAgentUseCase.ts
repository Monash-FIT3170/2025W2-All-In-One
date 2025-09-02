import { updateTenantApplicationStatus, updateTenantApplicationLinkedTaskId } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { createTaskForAgent, updateTaskForAgent } from "/app/client/library-modules/domain-models/task/repositories/task-repository";
import { getPropertyById, updatePropertyTenantId } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { TaskPriority } from "/app/shared/task-priority-identifier";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { TenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication";

/*WILL SEPARATE THESE USE CASES INTO SEPARATE FILES LATER*/

export async function sendApprovedApplicationsToAgentUseCase(
    propertyId: string,
    propertyLandlordId: string,
    streetNumber: string,
    street: string,
    suburb: string,
    province: string,
    postcode: string,
    approvedApplications: TenantApplication[]
  ): Promise<{ success: boolean; propertyId: string; approvedApplications: string[]; applicationCount: number; taskId: string }> {
    validateTaskInputs(propertyId, propertyLandlordId);
    ensureNonEmptyApplications(approvedApplications, 'No approved applications to send to agent for background check');

    const taskName = `Perform Background Check on ${approvedApplications.length} Tenant Application(s)`;
    const taskDescription =
      `Perform background checks on ${approvedApplications.length} landlord approved tenant application(s) ` +
      `for property at ${streetNumber} ${street}, ${suburb}, ${province} ${postcode}. ` +
      `Applicants: ${approvedApplications.map((app: TenantApplication) => app.applicantName).join(', ')}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // Get property to find agent ID
    const property = await getPropertyById(propertyId);
    const agentId = property.agentId;

    // Create task for agent
    const taskResult = await createTaskForAgent({
      name: taskName,
      description: taskDescription,
      dueDate: dueDate,
      priority: TaskPriority.MEDIUM,
      propertyAddress: `${streetNumber} ${street}, ${suburb}, ${province} ${postcode}`,
      propertyId: propertyId,
      userId: agentId,
    });

    // Update all approved applications to BACKGROUND_CHECK_PENDING status
    const approvedApplicationIds = approvedApplications.map((app: TenantApplication) => app.id);
    await updateTenantApplicationStatus(
      approvedApplicationIds,
      TenantApplicationStatus.BACKGROUND_CHECK_PENDING,
      3,
      taskResult // This stores the taskId in the existing taskId field
    );

    for (const applicationId of approvedApplicationIds) {
        await updateTenantApplicationLinkedTaskId(applicationId, taskResult);
    }

    console.log(`Successfully sent ${approvedApplications.length} application(s) to agent for background check for property ${propertyId}`);

    return {
      success: true,
      propertyId,
      approvedApplications: approvedApplicationIds,
      applicationCount: approvedApplications.length,
      taskId: taskResult
    };
  }

  export async function sendFinalApprovedApplicationToAgentUseCase(
    propertyId: string,
    propertyLandlordId: string,
    streetNumber: string,
    street: string,
    suburb: string,
    province: string,
    postcode: string,
    finalApprovedApplications: TenantApplication[]
  ): Promise<{ success: boolean; propertyId: string; applicationId: string; taskId: string }> {
    validateTaskInputs(propertyId, propertyLandlordId);
    ensureSingleFinalApprovedApplication(finalApprovedApplications);

    const chosenApplication = finalApprovedApplications[0];

    // Update property's tenantId with the chosen tenant's user ID
    if (chosenApplication.tenantUserId) {
      console.log('=== PROPERTY TENANT ID UPDATE ===');
      console.log('Property ID:', propertyId);
      console.log('Current Tenant ID:', chosenApplication.tenantUserId);
      console.log('Application Status:', chosenApplication.status);

      await updatePropertyTenantId(propertyId, chosenApplication.tenantUserId);

      const updatedProperty = await getPropertyById(propertyId);
      console.log('Updated Property Details:', updatedProperty);
      console.log('New Tenant ID in Property:', updatedProperty.tenantId);
      console.log('=== END PROPERTY UPDATE ===');
    } else {
      console.log('No tenantUserId found in chosen application');
    }

    const updatedTaskName = `Process Final Tenant Selection`;
    const updatedTaskDescription = `Process final tenant selection for ${chosenApplication.applicantName} at ${streetNumber} ${street}, ${suburb}, ${province} ${postcode}`;
    const updatedDueDate = new Date();
    updatedDueDate.setDate(updatedDueDate.getDate() + 3);

    const existingTaskId = chosenApplication.linkedTaskId;

    if (!existingTaskId) {
        throw new Error('No linked task ID found for final approved applications');
      }
    // Create task for agent
    const taskResult = await updateTaskForAgent({
      taskId: existingTaskId,
      name: updatedTaskName,
      description: updatedTaskDescription,
      dueDate: updatedDueDate,
      priority: TaskPriority.MEDIUM,
    });

    const applicationId = chosenApplication.id;
    await updateTenantApplicationStatus(
      [applicationId],
      TenantApplicationStatus.TENANT_CHOSEN,
      5,
      taskResult
    );

    console.log(`Successfully sent final approved application to agent for property ${propertyId}`);

    return {
      success: true,
      propertyId,
      applicationId,
      taskId: taskResult
    };
  }
function validateTaskInputs(propertyId: string, propertyLandlordId: string): void {
  if (!propertyId) {
    throw new Error('Property ID is required to send applications to agent');
  }

  if (!propertyLandlordId) {
    throw new Error('Property landlord ID is required to send applications to agent');
  }
}

function ensureNonEmptyApplications(applications: TenantApplication[], errorMessage: string): void {
  if (applications.length === 0) {
    throw new Error(errorMessage);
  }
}

function ensureSingleFinalApprovedApplication(applications: TenantApplication[]): void {
    if (applications.length === 0) {
      throw new Error('No final approved applications to send to agent');
    }

    if (applications.length > 1) {
      throw new Error('Only one applicant can be chosen for final approval');
    }
  }