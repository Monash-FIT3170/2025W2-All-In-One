/**
 * Role-specific conversation handlers
 * These handlers contain the business logic for fetching and managing conversations
 * for different user roles (Agent, Tenant, Landlord)
 */

import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ApiConversation } from "/app/shared/api-models/messaging/ApiConversation";
import { Conversation } from "/app/client/library-modules/domain-models/messaging/Conversation";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { 
  getConversationsForAgent,
  getConversationsForTenant,
  getConversationsForLandlord,
  convertApiConversationsToAgentView,
  convertApiConversationsToTenantView,
  convertApiConversationsToLandlordView
} from "/app/client/library-modules/domain-models/messaging/messaging-repository";
import {
  extractUserConnectionsFromProperties,
  identifyExistingConnections,
  findUsersWithoutConversations,
  createAgentTenantConversation,
  createAgentLandlordConversation,
  fetchUserProfiles,
  fetchAgentProfile,
  createTenantAgentConversation,
  createLandlordAgentConversation
} from "./conversation-helpers";

/**
 * Handles conversation fetching for Agent users
 * Agents need conversations with both tenants and landlords from their managed properties
 */
export async function handleAgentConversations(agent: Agent): Promise<Conversation[]> {
  const agentId = agent.agentId;

  // Step 1: Get existing agent conversations
  const existingConversations: ApiConversation[] = await getConversationsForAgent(agentId);

  // Step 2: Get properties managed by this agent
  const agentProperties = await Meteor.callAsync(
    MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_AGENT_ID,
    agentId
  );

  // Step 3: Extract unique tenant and landlord IDs from properties
  const userConnections = extractUserConnectionsFromProperties(agentProperties);
  
  // Step 4: Check existing conversations to find missing ones
  const existingConnections = identifyExistingConnections(existingConversations);
  
  // Step 5: Find users without conversations
  const usersWithoutConversations = findUsersWithoutConversations(userConnections, existingConnections);

  // Step 6: Create new conversations for users without them
  const newConversations: ApiConversation[] = [];
  
  // Create tenant conversations (AGENT ↔ TENANT ONLY)
  for (const tenantId of usersWithoutConversations.tenantsWithoutConversations) {
    const newConversation = await createAgentTenantConversation(
      agentId, 
      tenantId, 
      agentProperties, 
      existingConversations
    );
    
    if (newConversation) {
      newConversations.push(newConversation);
    }
  }

  // Create landlord conversations (AGENT ↔ LANDLORD ONLY)
  for (const landlordId of usersWithoutConversations.landlordsWithoutConversations) {
    const newConversation = await createAgentLandlordConversation(
      agentId, 
      landlordId, 
      agentProperties, 
      existingConversations
    );
    
    if (newConversation) {
      newConversations.push(newConversation);
    }
  }

  // Step 7: Combine all conversations
  const allConversations = [...existingConversations, ...newConversations];

  // Step 8: Fetch profiles for both tenants and landlords
  const uniqueTenantIds = [...new Set(allConversations.map(c => c.tenantId).filter((id): id is string => Boolean(id)))];
  const uniqueLandlordIds = [...new Set(allConversations.map(c => c.landlordId).filter((id): id is string => Boolean(id)))];
  
  const { tenantProfiles, landlordProfiles } = await fetchUserProfiles(uniqueTenantIds, uniqueLandlordIds);

  // Step 9: Convert to UI format with proper role identification
  return convertApiConversationsToAgentView(
    allConversations,
    agentId,
    tenantProfiles,
    landlordProfiles
  );
}

/**
 * Handles conversation fetching for Tenant users
 */
export async function handleTenantConversations(tenant: Tenant): Promise<Conversation[]> {
  const tenantId = tenant.tenantId;

  // Step 1: Get existing conversations for this tenant
  const existingConversations: ApiConversation[] = await getConversationsForTenant(tenantId);

  // Step 2: If conversation exists, use it
  if (existingConversations.length > 0) {
    // Fetch agent profile for the conversation
    const conversation = existingConversations[0]; // Tenant only has one agent
    const agentProfile = conversation.agentId ? await fetchAgentProfile(conversation.agentId) : null;

    // Convert to UI format
    return convertApiConversationsToTenantView(
      existingConversations,
      tenantId,
      agentProfile
    );
  }

  // Step 3: No conversation exists, find the agent from tenant's property
  const tenantProperty = await Meteor.callAsync(
    MeteorMethodIdentifier.PROPERTY_GET_BY_TENANT_ID,
    tenantId
  );

  if (!tenantProperty || !tenantProperty.agentId) {
    throw new Error("No property or agent found for this tenant");
  }

  // Step 4: Create new conversation with the agent (AGENT ↔ TENANT ONLY)
  const newConversation = await createTenantAgentConversation(tenantId, tenantProperty);

  // Step 5: Fetch agent profile
  const agentProfile = await fetchAgentProfile(tenantProperty.agentId);

  // Step 6: Convert to UI format
  return convertApiConversationsToTenantView(
    [newConversation],
    tenantId,
    agentProfile
  );
}

/**
 * Handles conversation fetching for Landlord users
 */
export async function handleLandlordConversations(landlord: Landlord): Promise<Conversation[]> {
  const landlordId = landlord.landlordId;

  // Step 1: Get existing conversations for this landlord
  const existingConversations: ApiConversation[] = await getConversationsForLandlord(landlordId);

  // Step 2: If conversation exists, use it
  if (existingConversations.length > 0) {
    // Fetch agent profile for the conversation
    const conversation = existingConversations[0]; // Landlord only has one agent
    const agentProfile = conversation.agentId ? await fetchAgentProfile(conversation.agentId) : null;

    // Convert to UI format
    return convertApiConversationsToLandlordView(
      existingConversations,
      landlordId,
      agentProfile
    );
  }

  // Step 3: No conversation exists, find the agent from landlord's properties
  const landlordProperties = await Meteor.callAsync(
    MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_LANDLORD_ID,
    landlordId
  );

  if (!landlordProperties || landlordProperties.length === 0) {
    throw new Error("No properties found for this landlord");
  }

  // Get the first property with an agent
  const landlordProperty = landlordProperties.find((p: any) => p.agentId);

  if (!landlordProperty || !landlordProperty.agentId) {
    throw new Error("No property or agent found for this landlord");
  }

  // Step 4: Create new conversation with the agent (AGENT ↔ LANDLORD ONLY)
  const newConversation = await createLandlordAgentConversation(landlordId, landlordProperty);

  // Step 5: Fetch agent profile
  const agentProfile = await fetchAgentProfile(landlordProperty.agentId);

  // Step 6: Convert to UI format
  return convertApiConversationsToLandlordView(
    [newConversation],
    landlordId,
    agentProfile
  );
}
