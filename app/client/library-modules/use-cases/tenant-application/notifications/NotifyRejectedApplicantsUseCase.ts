import { getTenantApplicationsByPropertyId } from "/app/client/library-modules/domain-models/tenant-application/repositories/tenant-application-repository";
import { apiInsertMessage } from "/app/client/library-modules/apis/messaging/messaging-api";
import { TenantApplication } from "/app/client/library-modules/domain-models/tenant-application/TenantApplication";
import { createAgentTenantConversation } from "/app/client/ui-modules/role-messages/state/helpers/conversation-helpers";
import { getProfileDataById } from "/app/client/library-modules/domain-models/user/role-repositories/profile-data-repository";
import { getAgentByAgentId } from "/app/client/library-modules/domain-models/user/role-repositories/agent-repository";

export type NotifyRejectedApplicantsResult = {
  success: boolean;
  notifiedCount: number;
  message: string;
};

/**
 * Notifies all applicants (except the chosen one) that they were not selected
 * Creates conversations and sends rejection messages through the messaging system
 */

export async function notifyRejectedApplicantsUseCase(
  propertyId: string,
  chosenApplicationId: string,
  agentId: string,
  propertyAddress: string,
): Promise<NotifyRejectedApplicantsResult> {
    try {
        // get all applications for this property
        const allApplications = await getTenantApplicationsByPropertyId(propertyId);


        // filter out chosen applicant and invalid applications (so it's only rejected applicants)
        const applicationsToNotify = allApplications.filter((app: TenantApplication) =>
            app.id !== chosenApplicationId &&
            app.tenantUserId
        );

        // when there are no rejected applicants, return this result
        if (applicationsToNotify.length === 0) {
            return {
                success: false,
                notifiedCount: 0,
                message: 'No rejected applicants to notify'
            };
        }

        // notify each rejected appliant
        const notificationResults = await Promise.allSettled(
            applicationsToNotify.map(app =>
            notifySingleRejectedApplicant(app, agentId, propertyAddress)
            )
        );

        // Process results and create response
        return processNotificationResults(notificationResults, applicationsToNotify);

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
 * Creates a conversation and sends rejection message to specific applicant
 */

async function notifySingleRejectedApplicant(
    app: TenantApplication,
    agentId: string,
    propertyAddress: string
): Promise<void> {
    const tenantId = app.tenantUserId!;

    // Get agent details for the signature
    const agentName = await getAgentDisplayName(agentId);

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
  // Create and send rejection message
  const rejectionMessage = createRejectionMessage(app.applicantName, propertyAddress, agentName);

    // send rejection message
    await apiInsertMessage({
        conversationId: conversation.conversationId,
        text: rejectionMessage,
        senderId: agentId,
        senderRole: 'agent'
    });
    console.log(`Sent rejection notification to ${app.applicantName} (${tenantId})`);
}


/**
 * Gets the display name for an agent
 */
async function getAgentDisplayName(agentId: string): Promise<string> {
    try {
      const agent = await getAgentByAgentId(agentId);
      const profileData = agent ? await getProfileDataById(agent.profileDataId) : null;

      return profileData?.firstName && profileData?.lastName
        ? `${profileData.firstName} ${profileData.lastName}`
        : 'Property Management Team';
    } catch (error) {
      console.error(`Failed to get agent display name for ${agentId}:`, error);
      return 'Property Management Team';
    }
  }



/**
 * Creates the rejection message content
 */
function createRejectionMessage(
    applicantName: string,
    propertyAddress: string,
    agentName: string
  ): string {
    return `Hello ${applicantName},

  Thank you for your interest in the property at ${propertyAddress}.

  After careful consideration, we have selected another applicant for this property. We appreciate the time you took to apply and encourage you to apply to other available properties.

  If you have any questions, please don't hesitate to reach out.

  Best regards,
  ${agentName}`;
  }


/**
 * Processes notification results and creates the final response
 */
function processNotificationResults(
    results: PromiseSettledResult<void>[],
    applications: TenantApplication[]
  ): NotifyRejectedApplicantsResult {
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected');

    const errors = failed.map((result, index) => {
      const app = applications[index];
      return `Failed to notify ${app.applicantName}: ${result.reason}`;
    });

    const message = errors.length > 0
      ? `Notified ${successful} applicants. Errors: ${errors.join(', ')}`
      : `Successfully notified ${successful} applicants`;

    return {
      success: true,
      notifiedCount: successful,
      message
    };
  }