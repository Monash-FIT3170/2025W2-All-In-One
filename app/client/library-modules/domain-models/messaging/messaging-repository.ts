import { ApiConversation } from "/app/shared/api-models/messaging/ApiConversation";
import { ApiMessage } from "/app/shared/api-models/messaging/ApiMessage";
import { Conversation } from "./Conversation";
import { Message } from "./Message";
import { 
  apiGetConversationsForAgent,
  apiGetConversationsForTenant,
  apiGetConversationsForLandlord,
  apiGetMessagesForConversation,
  apiInsertMessage,
  apiInsertConversation,
  apiResetUnreadCount
} from "../../apis/messaging/messaging-api";
import { formatConversationTimestamp } from "/app/client/ui-modules/role-messages/utils/timestamp-utils";
import { ApiProfileData } from "/app/shared/api-models/user/api-roles/ApiProfileData";

// Helper function to generate avatar from name
function getAvatarInitials(name: string): string {
  const parts = name.split(' ');
  return parts.length > 1 
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : `${parts[0][0]}${parts[0][1] || ''}`.toUpperCase();
}

// Helper function to generate display name from profile
function getDisplayName(profile: ApiProfileData | undefined, roleType: string, id: string): string {
  return profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : roleType;
}

// Convert API conversation to domain model
function convertApiConversationToDomain(
  apiConversation: ApiConversation,
  currentUserId: string,
  displayName?: string,
  displayRole?: string
): Conversation {
  const name = displayName || (apiConversation.tenantId ? 'Tenant' : apiConversation.agentId ? 'Agent' : apiConversation.landlordId ? 'Landlord' : 'User');
  const role = displayRole || "User";
  
  // Calculate timestamp - only show if there's an actual message
  let timestamp = '';
  if (apiConversation.lastMessage?.timestamp && 
      apiConversation.lastMessage?.text && 
      apiConversation.lastMessage.text.trim() !== '') {
    timestamp = formatConversationTimestamp(new Date(apiConversation.lastMessage.timestamp));
  }

  return {
    id: apiConversation.conversationId,
    name,
    role,
    avatar: getAvatarInitials(name),
    lastMessage: apiConversation.lastMessage?.text || "No messages yet",
    timestamp,
    unreadCount: apiConversation.unreadCounts[currentUserId] || 0,
  };
}

// Convert API message to domain model
function convertApiMessageToDomain(apiMessage: ApiMessage, currentUserId: string): Message {
  return {
    id: apiMessage.messageId,
    text: apiMessage.text,
    timestamp: new Date(apiMessage.timestamp).toLocaleString(),
    isOutgoing: apiMessage.senderId === currentUserId,
    isRead: apiMessage.isRead,
  };
}

// Repository functions
export async function getConversationsForAgent(agentId: string): Promise<ApiConversation[]> {
  return await apiGetConversationsForAgent(agentId);
}

export async function getConversationsForTenant(tenantId: string): Promise<ApiConversation[]> {
  return await apiGetConversationsForTenant(tenantId);
}

export async function getConversationsForLandlord(landlordId: string): Promise<ApiConversation[]> {
  return await apiGetConversationsForLandlord(landlordId);
}

export async function getMessagesForConversation(conversationId: string, currentUserId: string): Promise<Message[]> {
  const apiMessages = await apiGetMessagesForConversation(conversationId);
  return apiMessages.map(apiMessage => convertApiMessageToDomain(apiMessage, currentUserId));
}

export async function sendMessage(messageData: {
  conversationId: string;
  text: string;
  senderId: string;
  senderRole: string;
}): Promise<string> {
  return await apiInsertMessage(messageData);
}

export async function createConversation(conversationData: {
  agentId: string;
  tenantId?: string;
  landlordId?: string;
  propertyId?: string;
  unreadCounts: Record<string, number>;
}): Promise<string> {
  return await apiInsertConversation(conversationData);
}

export async function resetUnreadCount(conversationId: string, userId: string): Promise<void> {
  return await apiResetUnreadCount(conversationId, userId);
}

// Conversion helpers for UI components
export function convertApiConversationsToAgentView(
  apiConversations: ApiConversation[],
  agentId: string,
  tenantProfiles: Map<string, ApiProfileData>,
  landlordProfiles: Map<string, ApiProfileData>
): Conversation[] {
  return apiConversations.map(apiConversation => {
    if (apiConversation.tenantId) {
      // Agent-Tenant conversation
      const tenantProfile = tenantProfiles.get(apiConversation.tenantId);
      const name = getDisplayName(tenantProfile, "Tenant", apiConversation.tenantId);
      return convertApiConversationToDomain(apiConversation, agentId, name, "Tenant");
    } else if (apiConversation.landlordId) {
      // Agent-Landlord conversation
      const landlordProfile = landlordProfiles.get(apiConversation.landlordId);
      const name = getDisplayName(landlordProfile, "Landlord", apiConversation.landlordId);
      return convertApiConversationToDomain(apiConversation, agentId, name, "Landlord");
    } else {
      // Fallback
      return convertApiConversationToDomain(apiConversation, agentId);
    }
  });
}

export function convertApiConversationsToTenantView(
  apiConversations: ApiConversation[],
  tenantId: string,
  agentProfiles?: Map<string, ApiProfileData> | ApiProfileData
): Conversation[] {
  return apiConversations.map(apiConversation => {
    let agentProfile: ApiProfileData | undefined;

    if (agentProfiles instanceof Map) {
      // Multiple agent profiles
      agentProfile = apiConversation.agentId ? agentProfiles.get(apiConversation.agentId) : undefined;
    } else {
      // Single agent profile (backward compatibility)
      agentProfile = agentProfiles;
    }

    const name = getDisplayName(agentProfile, "Agent", apiConversation.agentId);
    return convertApiConversationToDomain(apiConversation, tenantId, name, "Agent");
  });
}

export function convertApiConversationsToLandlordView(
  apiConversations: ApiConversation[],
  landlordId: string,
  agentProfile?: ApiProfileData
): Conversation[] {
  return apiConversations.map(apiConversation => {
    const name = getDisplayName(agentProfile, "Agent", apiConversation.agentId);
    return convertApiConversationToDomain(apiConversation, landlordId, name, "Agent");
  });
}
