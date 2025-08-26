/**
 * Helper functions for conversation management and data transformation
 * These utilities handle the complex logic for creating conversations,
 * fetching user profiles, and converting between API and UI formats.
 */

import { 
  apiInsertConversation,
} from "/app/client/library-modules/apis/messaging/messaging-api";
import { 
  apiGetProfileByAgentId,
  apiGetProfileByTenantId,
  apiGetProfileByLandlordId
} from "/app/client/library-modules/apis/user/user-account-api";
import { ApiConversation } from "/app/shared/api-models/messaging/ApiConversation";

/**
 * Interface for property data from server
 */
interface PropertyData {
  propertyId: string;
  tenantId?: string;
  landlordId?: string;
  agentId?: string;
}

/**
 * Interface for new conversation data
 */
interface NewConversationData {
  agentId: string;
  tenantId?: string;
  landlordId?: string;
  propertyId?: string;
  unreadCounts: Record<string, number>;
}

/**
 * Extracts unique tenant and landlord IDs from agent properties used for the conversation list
 */
export function extractUserConnectionsFromProperties(agentProperties: PropertyData[]) {
  const tenantConnections = new Set<string>();
  const landlordConnections = new Set<string>();
  
  agentProperties.forEach((property) => {
    if (property.tenantId && property.tenantId.trim() !== '') {
      tenantConnections.add(property.tenantId);
    }
    if (property.landlordId && property.landlordId.trim() !== '') {
      landlordConnections.add(property.landlordId);
    }
  });

  return { tenantConnections, landlordConnections };
}

/**
 * Identifies existing user connections from conversations - this is usd avoiding duplicate conversations
 */
export function identifyExistingConnections(existingConversations: ApiConversation[]) {
  const existingTenantIds = new Set<string>();
  const existingLandlordIds = new Set<string>();
  
  existingConversations.forEach(conversation => {
    if (conversation.tenantId) {
      existingTenantIds.add(conversation.tenantId);
    }
    if (conversation.landlordId) {
      existingLandlordIds.add(conversation.landlordId);
    }
  });

  return { existingTenantIds, existingLandlordIds };
}

/**
 * Finds users who don't have conversations yet to then create conversations for them
 */
export function findUsersWithoutConversations(
  userConnections: { tenantConnections: Set<string>; landlordConnections: Set<string> },
  existingConnections: { existingTenantIds: Set<string>; existingLandlordIds: Set<string> }
) {
  const tenantsWithoutConversations = Array.from(userConnections.tenantConnections).filter(
    tenantId => !existingConnections.existingTenantIds.has(tenantId)
  );
  
  const landlordsWithoutConversations = Array.from(userConnections.landlordConnections).filter(
    landlordId => !existingConnections.existingLandlordIds.has(landlordId)
  );

  return { tenantsWithoutConversations, landlordsWithoutConversations };
}

/**
 * Creates a new conversation between agent and tenant
 */
export async function createAgentTenantConversation(
  agentId: string,
  tenantId: string,
  agentProperties: PropertyData[],
  existingConversations: ApiConversation[]
): Promise<ApiConversation | null> {
  try {
    const property = agentProperties.find((p) => p.tenantId === tenantId);
    
    const newConversationData: NewConversationData = {
      agentId: agentId,
      tenantId: tenantId,
      propertyId: property?.propertyId || undefined,
      unreadCounts: {
        [agentId]: 0,
        [tenantId]: 0
      }
    };

    const conversationId = await apiInsertConversation(newConversationData);

    // Check if this is truly a new conversation
    const isNewConversation = !existingConversations.some(conv => conv.conversationId === conversationId);
    
    if (isNewConversation) {
      return {
        conversationId: conversationId,
        agentId: agentId,
        tenantId: tenantId,
        propertyId: property?.propertyId,
        unreadCounts: newConversationData.unreadCounts,
        activeUsers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to create conversation for tenant ${tenantId}:`, error);
    return null;
  }
}

/**
 * Creates a new conversation between agent and landlord
 */
export async function createAgentLandlordConversation(
  agentId: string,
  landlordId: string,
  agentProperties: PropertyData[],
  existingConversations: ApiConversation[]
): Promise<ApiConversation | null> {
  try {
    const property = agentProperties.find((p) => p.landlordId === landlordId);
    
    const newConversationData: NewConversationData = {
      agentId: agentId,
      landlordId: landlordId,
      propertyId: property?.propertyId || undefined,
      unreadCounts: {
        [agentId]: 0,
        [landlordId]: 0
      }
    };

    const conversationId = await apiInsertConversation(newConversationData);

    // Check if this is truly a new conversation
    const isNewConversation = !existingConversations.some(conv => conv.conversationId === conversationId);
    
    if (isNewConversation) {
      return {
        conversationId: conversationId,
        agentId: agentId,
        landlordId: landlordId,
        propertyId: property?.propertyId,
        unreadCounts: newConversationData.unreadCounts,
        activeUsers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    return null;
  } catch (error) {
    console.error(`Failed to create conversation for landlord ${landlordId}:`, error);
    return null;
  }
}

/**
 * Fetches user profiles for tenants and landlords to show on the conversation list
 */
export async function fetchUserProfiles(tenantIds: string[], landlordIds: string[]) {
  const tenantProfiles = new Map<string, any>();
  const landlordProfiles = new Map<string, any>();
  
  // Fetch tenant profiles
  await Promise.all(
    tenantIds.map(async (tenantId) => {
      try {
        const profile = await apiGetProfileByTenantId(tenantId);
        tenantProfiles.set(tenantId, profile);
      } catch (error) {
        console.error(`Failed to fetch profile for tenant ${tenantId}:`, error);
      }
    })
  );

  // Fetch landlord profiles
  await Promise.all(
    landlordIds.map(async (landlordId) => {
      try {
        const profile = await apiGetProfileByLandlordId(landlordId);
        landlordProfiles.set(landlordId, profile);
      } catch (error) {
        console.error(`Failed to fetch profile for landlord ${landlordId}:`, error);
      }
    })
  );

  return { tenantProfiles, landlordProfiles };
}

/**
 * Fetches agent profile by agent ID
 */
export async function fetchAgentProfile(agentId: string) {
  try {
    return await apiGetProfileByAgentId(agentId);
  } catch (error) {
    console.error(`Failed to fetch profile for agent ${agentId}:`, error);
    return null;
  }
}

/**
 * Creates a new conversation for tenant with their agent
 */
export async function createTenantAgentConversation(tenantId: string, tenantProperty: PropertyData) {
  const newConversationData: NewConversationData = {
    agentId: tenantProperty.agentId!,
    tenantId: tenantId,
    propertyId: tenantProperty.propertyId,
    unreadCounts: {
      [tenantProperty.agentId!]: 0,
      [tenantId]: 0
    }
  };

  const conversationId = await apiInsertConversation(newConversationData);

  return {
    conversationId: conversationId,
    agentId: tenantProperty.agentId!,
    tenantId: tenantId,
    propertyId: tenantProperty.propertyId,
    unreadCounts: newConversationData.unreadCounts,
    activeUsers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Creates a new conversation for landlord with their agent
 */
export async function createLandlordAgentConversation(landlordId: string, landlordProperty: PropertyData) {
  const newConversationData: NewConversationData = {
    agentId: landlordProperty.agentId!,
    landlordId: landlordId,
    propertyId: landlordProperty.propertyId,
    unreadCounts: {
      [landlordProperty.agentId!]: 0,
      [landlordId]: 0
    }
  };

  const conversationId = await apiInsertConversation(newConversationData);

  return {
    conversationId: conversationId,
    agentId: landlordProperty.agentId!,
    landlordId: landlordId,
    propertyId: landlordProperty.propertyId,
    unreadCounts: newConversationData.unreadCounts,
    activeUsers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
