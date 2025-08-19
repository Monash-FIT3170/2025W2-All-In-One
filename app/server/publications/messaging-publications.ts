import { Meteor } from "meteor/meteor";
import { ConversationCollection } from "../database/messaging/messaging-collections";
import { MessageCollection } from "../database/messaging/messaging-collections";
import { Role } from "/app/shared/user-role-identifier";

// Publication for conversations based on role and roleId
Meteor.publish("conversations", async function(role: Role, roleId: string) {
  console.log('🔔 SERVER: conversations publication called for role:', role, 'roleId:', roleId);
  
  if (!role || !roleId) {
    console.log('🔔 SERVER: No role or roleId provided, returning ready');
    return this.ready();
  }

  // Return conversations based on user role
  if (role === Role.AGENT) {
    const cursor = ConversationCollection.find({ agentId: roleId });
    const count = await ConversationCollection.find({ agentId: roleId }).countAsync();
    console.log('🔔 SERVER: Returning', count, 'conversations for agent:', roleId);
    return cursor;
  } else if (role === Role.TENANT) {
    const cursor = ConversationCollection.find({ tenantId: roleId });
    const count = await ConversationCollection.find({ tenantId: roleId }).countAsync();
    console.log('🔔 SERVER: Returning', count, 'conversations for tenant:', roleId);
    return cursor;
  } else if (role === Role.LANDLORD) {
    const cursor = ConversationCollection.find({ landlordId: roleId });
    const count = await ConversationCollection.find({ landlordId: roleId }).countAsync();
    console.log('🔔 SERVER: Returning', count, 'conversations for landlord:', roleId);
    return cursor;
  }

  console.log('🔔 SERVER: Unknown role, returning ready');
  return this.ready();
});

// Publication for messages in a specific conversation
Meteor.publish("messages", async function(conversationId: string, role: Role, roleId: string) {
  console.log('💬 SERVER: messages publication called for conversation:', conversationId, 'role:', role, 'roleId:', roleId);
  
  if (!conversationId || !role || !roleId) {
    console.log('💬 SERVER: Missing required parameters, returning ready');
    return this.ready();
  }

  // Check if user is part of this conversation
  const conversation = await ConversationCollection.findOneAsync(conversationId);
  if (!conversation) {
    console.log('💬 SERVER: Conversation not found:', conversationId);
    return this.ready();
  }

  console.log('💬 SERVER: Found conversation:', conversation);

  const hasAccess = 
    (role === Role.AGENT && conversation.agentId === roleId) ||
    (role === Role.TENANT && conversation.tenantId === roleId) ||
    (role === Role.LANDLORD && conversation.landlordId === roleId);

  console.log('💬 SERVER: Access check - role:', role, 'roleId:', roleId, 'hasAccess:', hasAccess);
  console.log('💬 SERVER: Conversation agentId:', conversation.agentId, 'tenantId:', conversation.tenantId);

  if (!hasAccess) {
    console.log('💬 SERVER: No access to conversation, returning ready');
    return this.ready();
  }

  const cursor = MessageCollection.find({ conversationId });
  const count = await MessageCollection.find({ conversationId }).countAsync();
  console.log('💬 SERVER: Returning', count, 'messages for conversation:', conversationId);
  
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
