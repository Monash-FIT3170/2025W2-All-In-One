import { Meteor } from "meteor/meteor";
import { ConversationCollection } from "../database/messaging/messaging-collections";
import { MessageCollection } from "../database/messaging/messaging-collections";
import { Role } from "/app/shared/user-role-identifier";
import { UserAccountCollection } from "../database/user/user-collections";
import { AgentCollection } from "../database/user/user-collections";
import { TenantCollection } from "../database/user/user-collections";
import { LandlordCollection } from "../database/user/user-collections";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";

// Helper function to get user role and role ID
async function getUserRoleInfo(userId: string): Promise<{ role: Role; roleId: string } | null> {
  try {
    // Get user account to determine role
    const userAccount = await UserAccountCollection.findOneAsync({ userId });
    if (!userAccount) {
      return null;
    }

    const role = userAccount.role;
    let roleId: string;

    // Get the specific role document to get the role ID
    if (role === Role.AGENT) {
      const agent = await AgentCollection.findOneAsync({ userAccountId: userId });
      if (!agent) return null;
      roleId = agent._id; // Use _id as the role ID
    } else if (role === Role.TENANT) {
      const tenant = await TenantCollection.findOneAsync({ userAccountId: userId });
      if (!tenant) return null;
      roleId = tenant._id; // Use _id as the role ID
    } else if (role === Role.LANDLORD) {
      const landlord = await LandlordCollection.findOneAsync({ userAccountId: userId });
      if (!landlord) return null;
      roleId = landlord._id; // Use _id as the role ID
    } else {
      return null;
    }

    return { role, roleId };
  } catch (error) {
    console.error("Error getting user role info:", error);
    return null;
  }
}

// Publication for conversations based on user role
Meteor.publish("conversations", async function() {
  if (!this.userId) {
    return this.ready();
  }

  const userInfo = await getUserRoleInfo(this.userId);
  if (!userInfo) {
    return this.ready();
  }

  const { role, roleId } = userInfo;

  // Return conversations based on user role
  if (role === Role.AGENT) {
    return ConversationCollection.find({ agentId: roleId });
  } else if (role === Role.TENANT) {
    return ConversationCollection.find({ tenantId: roleId });
  } else if (role === Role.LANDLORD) {
    return ConversationCollection.find({ landlordId: roleId });
  }

  return this.ready();
});

// Publication for messages in a specific conversation
Meteor.publish("messages", async function(conversationId: string) {
  if (!this.userId || !conversationId) {
    return this.ready();
  }

  const userInfo = await getUserRoleInfo(this.userId);
  if (!userInfo) {
    return this.ready();
  }

  const { role, roleId } = userInfo;

  // Check if user is part of this conversation
  const conversation = await ConversationCollection.findOneAsync(conversationId);
  if (!conversation) {
    return this.ready();
  }

  const hasAccess = 
    (role === Role.AGENT && conversation.agentId === roleId) ||
    (role === Role.TENANT && conversation.tenantId === roleId) ||
    (role === Role.LANDLORD && conversation.landlordId === roleId);

  if (!hasAccess) {
    return this.ready();
  }

  return MessageCollection.find({ conversationId });
});

// Publication for real-time conversation updates (last message, unread counts)
Meteor.publish("conversationUpdates", async function() {
  if (!this.userId) {
    return this.ready();
  }

  const userInfo = await getUserRoleInfo(this.userId);
  if (!userInfo) {
    return this.ready();
  }

  const { role, roleId } = userInfo;

  // Return conversations with only essential fields for real-time updates
  if (role === Role.AGENT) {
    return ConversationCollection.find(
      { agentId: roleId },
      { fields: { lastMessage: 1, unreadCounts: 1, updatedAt: 1 } }
    );
  } else if (role === Role.TENANT) {
    return ConversationCollection.find(
      { tenantId: roleId },
      { fields: { lastMessage: 1, unreadCounts: 1, updatedAt: 1 } }
    );
  } else if (role === Role.LANDLORD) {
    return ConversationCollection.find(
      { landlordId: roleId },
      { fields: { lastMessage: 1, unreadCounts: 1, updatedAt: 1 } }
    );
  }

  return this.ready();
});
