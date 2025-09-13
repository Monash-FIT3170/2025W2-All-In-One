import { getTenantApplicationsByPropertyId } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { apiInsertConversation, apiInsertMessage } from "/app/client/library-modules/apis/messaging/messaging-api";
import { TenantApplicationStatus } from "/app/shared/api-models/tenant-application/TenantApplicationStatus";
import { TenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication";
import { createAgentTenantConversation } from "/app/client/ui-modules/role-messages/state/helpers/conversation-helpers";
import { getPropertyById } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { getAgentById } from "/app/client/library-modules/domain-models/user/role-repositories/agent-repository";
import { getProfileDataById } from "/app/client/library-modules/domain-models/user/role-repositories/profile-data-repository";

export interface NotifyRejectedApplicantsResult {
  success: boolean;
  notifiedCount: number;
  message: string;
}

/**
 * Notifies all applicants (except the chosen one) that they were not selected
 * Creates conversations and sends rejection messages through the messaging system
 */

export async function notifyRejectedApplicantsUseCase(
    propertyId: string,
    chosenApplicationId: string,
    agentId: string,
    propertyAddress: string
): Promise<NotifyRejectedApplicantsResult> {
    try {
        // Get all applications for this property
        const allApplications = await getTenantApplicationsByPropertyId(propertyId);


        // Remove chosen application from list so it's only rejected applicants
        const applicationsToNotify = allApplications.filter((app: TenantApplication) =>
            app.id !== chosenApplicationId &&
            app.tenantUserId
        );

        if (applicationsToNotify.length === 0) {
            return {
                success: false,
                notifiedCount: 0,
                message: 'No rejected applicants to notify'
            };
        }

        let notifiedCount = 0;
        const errors: string[] = [];

        // notify each rejected appliant
        for (const app of applicationsToNotify) {
            try {
                await notifySingleRejectedApplicant(
                    app,
                    agentId,
                    propertyAddress
                );
                notifiedCount++;
            } catch (error) {
                const errorMsg = `Failed to notify ${app.applicantName}: ${error}`;
                console.error(errorMsg);
                errors.push(errorMsg);
            }
        }
        const message = errors.length > 0
            ? `Notified ${notifiedCount} applicants. Errors: ${errors.join(', ')}`
            : `Successfully notified ${notifiedCount} applicants`;

        return {
            success: true,
            notifiedCount,
            message
            };
    } catch (error) {
        console.error("Error in notifyRejectedApplicantsUseCase:", error);
        return {
          success: false,
          notifiedCount: 0,
          message: `Failed to notify rejected applicants: ${error}`
        };
    }
}
/**
 * Creates a conversation and sends rejection message to a single applicant
 */

async function notifySingleRejectedApplicant(
    app: TenantApplication,
    agentId: string,
    propertyAddress: string
): Promise<void> {
    const tenantId = app.tenantUserId!;

    // Get agent details for the signature
    const agent = await getAgentById(agentId);
    const profileData = agent ? await getProfileDataById(agent.profileDataId) : null;
    const agentName = profileData?.firstName && profileData?.lastName
        ? `${profileData.firstName} ${profileData.lastName}`
        : 'Property Management Team';


    const agentProperties = await getPropertyById(app.propertyId);
    const propertyData = [{
        propertyId: app.propertyId,
        tenantId: tenantId,
        landlordId: app.landlordId
      }];

    // create or get existing convo between agent and specific tenant applicant
    const conversation = await createAgentTenantConversation(
        agentId,
        tenantId,
        propertyData,
        [] // No existing conversations to check against
  );

  if (!conversation){
    throw new Error(`Failed to create conversation with tenant ${tenantId}`);
  }

    // Create rejection message
    const rejectionMessage = `Hello ${app.applicantName},

Thank you for your interest in the property at ${propertyAddress}.

After careful consideration, we have selected another applicant for this property. We appreciate the time you took to apply and encourage you to apply to other available properties.

If you have any questions, please don't hesitate to reach out.

Best regards,
${agentName}`;

    // send rejection message
    await apiInsertMessage({
        conversationId: conversation.conversationId,
        text: rejectionMessage,
        senderId: agentId,
        senderRole: 'agent'
    });
    console.log(`Sent rejection notification to ${app.applicantName} (${tenantId})`);
}