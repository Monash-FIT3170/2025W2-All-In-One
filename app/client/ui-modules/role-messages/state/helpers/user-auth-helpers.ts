/**
 * Helper functions for user authentication and role management
 * These utilities handle user validation, role identification, and user ID extraction
 */

import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { Role } from "/app/shared/user-role-identifier";

/**
 * Interface for authenticated user context
 */
export interface AuthenticatedUserContext {
  currentUser: Agent | Tenant | Landlord;
  authUser: { role: Role };
  userId: string;
  userRole: string;
}

/**
 * Validates that user is authenticated and returns user context
 */
export function validateAndGetUserContext(
  currentUser: Agent | Tenant | Landlord | null,
  authUser: { role: Role } | null
): AuthenticatedUserContext {
  if (!authUser || !currentUser) {
    throw new Error("User is not authenticated");
  }

  const { userId, userRole } = extractUserIdAndRole(currentUser, authUser.role);

  return {
    currentUser,
    authUser,
    userId,
    userRole
  };
}

/**
 * Extracts user ID and role string from current user based on role
 */
export function extractUserIdAndRole(
  currentUser: Agent | Tenant | Landlord,
  role: Role
): { userId: string; userRole: string } {
  switch (role) {
    case Role.AGENT:
      if ('agentId' in currentUser) {
        return {
          userId: currentUser.agentId,
          userRole: 'agent'
        };
      }
      throw new Error("Invalid agent user data");
    
    case Role.TENANT:
      if ('tenantId' in currentUser) {
        return {
          userId: currentUser.tenantId,
          userRole: 'tenant'
        };
      }
      throw new Error("Invalid tenant user data");
    
    case Role.LANDLORD:
      if ('landlordId' in currentUser) {
        return {
          userId: currentUser.landlordId,
          userRole: 'landlord'
        };
      }
      throw new Error("Invalid landlord user data");
    
    default:
      throw new Error("Unsupported user role");
  }
}

/**
 * Validates conversation ID to ensure it's not null or invalid
 */
export function validateConversationId(conversationId: string): void {
  if (!conversationId || conversationId === 'null' || conversationId === 'undefined') {
    throw new Error("Invalid conversation ID");
  }
}

/**
 * Checks if user has agent role
 */
export function isAgent(role: Role): boolean {
  return role === Role.AGENT;
}

/**
 * Checks if user has tenant role
 */
export function isTenant(role: Role): boolean {
  return role === Role.TENANT;
}

/**
 * Checks if user has landlord role
 */
export function isLandlord(role: Role): boolean {
  return role === Role.LANDLORD;
}
