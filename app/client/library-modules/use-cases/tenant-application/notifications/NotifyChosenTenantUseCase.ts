import { getAgentByAgentId } from "/app/client/library-modules/domain-models/user/role-repositories/agent-repository";
import { getPropertyById } from "/app/client/library-modules/domain-models/property/repositories/property-repository";
import { getProfileDataById } from "/app/client/library-modules/domain-models/user/role-repositories/profile-data-repository";
import { apiInsertMessage } from "/app/client/library-modules/apis/messaging/messaging-api";
import { createAgentTenantConversation } from "/app/client/ui-modules/role-messages/state/helpers/conversation-helpers";


export async function notifyChosenTenantUseCase(
  propertyId: string,
  chosenTenantUserId: string,
  chosenTenantName: string,
): Promise<void> {
  try {
    // Get property details
    const property = await getPropertyById(propertyId);
    const agentName = await getAgentDisplayName(property.agentId);

    // Prepare property data for conversation creation
    const propertyData = [{
      propertyId: propertyId,
      tenantId: chosenTenantUserId,
      agentId: property.agentId
    }];

    // Create conversation between agent and chosen tenant
    const conversation = await createAgentTenantConversation(
        property.agentId,
        chosenTenantUserId,
        propertyData,
        [] // No existing conversations to check against
    );

    if (conversation) {

      // Create acceptance message
      const acceptanceMessage = createAcceptanceMessage(chosenTenantName, property, agentName);

      // Send the acceptance message
      await apiInsertMessage({
        conversationId: conversation.conversationId,
        text: acceptanceMessage,
        senderId: property.agentId,
        senderRole: 'agent'
      });

      console.log(`Successfully notified chosen tenant ${chosenTenantName} for property ${propertyId}`);
    } else {
      console.error(`Failed to create conversation with chosen tenant ${chosenTenantName}`);
    }
  } catch (error) {
    console.error("Failed to notify chosen tenant:", error);
    throw error;
  }
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
 * Creates the acceptance message content
 */
function createAcceptanceMessage(
  chosenTenantName: string,
  property: any, // You might want to type this properly
  agentName: string
): string {
  return `Congratulations ${chosenTenantName}!

You have been selected as the tenant for the property at ${property.streetnumber} ${property.streetname}, ${property.suburb}, ${property.province}.

We're excited to have you as our tenant! Please contact me to discuss the next steps and arrange for lease signing.

Best regards,
${agentName}`;
}
