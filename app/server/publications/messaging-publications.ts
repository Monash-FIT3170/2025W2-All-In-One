import { Meteor } from "meteor/meteor";
import { ConversationCollection } from "../database/messaging/messaging-collections";
import { MessageCollection } from "../database/messaging/messaging-collections";
import { Role } from "/app/shared/user-role-identifier";

// Publication for conversations based on role and roleId
Meteor.publish("conversations", async function(role: Role, roleId: string) {
  
  if (!role || !roleId) {
    return this.ready();
  }

  // Return conversations based on user role
  if (role === Role.AGENT) {
    const cursor = ConversationCollection.find({ agentId: roleId });
    return cursor;
  } else if (role === Role.TENANT) {
    const cursor = ConversationCollection.find({ tenantId: roleId });
    return cursor;
  } else if (role === Role.LANDLORD) {
    const cursor = ConversationCollection.find({ landlordId: roleId });
    return cursor;
  }

  return this.ready();
});

// Publication for messages in a specific conversation
Meteor.publish("messages", async function(conversationId: string, role: Role, roleId: string) {
  
  if (!conversationId || !role || !roleId) {
    return this.ready();
  }

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

  const cursor = MessageCollection.find({ conversationId });
  
  return cursor;
});

// Publication for real-time conversation updates (last message, unread counts)
Meteor.publish("conversationUpdates", function(role: Role, roleId: string) {
  if (!role || !roleId) {
    return this.ready();
  }

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
