import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { MessagesState } from "../MessagesPageUIState";
import { Conversation, Message } from "../../types";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { ConversationDocument } from "/app/server/database/messaging/models/ConversationDocument";
import { MessageDocument } from "/app/server/database/messaging/models/MessageDocument";
import { ApiProperty } from "/app/shared/api-models/property/ApiProperty";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Role } from "/app/shared/user-role-identifier";

const initialState: MessagesState = {
  isLoading: false,
  conversations: [],
  activeConversationId: null,
  messages: [],
  messageText: "",
  error: null,
  conversationsLoading: false,
  messagesLoading: false,
};

// Helper function to convert ConversationDocument to UI Conversation for Agent view
const convertConversationDocumentToUIConversationForAgent = (
  doc: ConversationDocument,
  tenantProfile?: any
): Conversation => {
  // Generate avatar from name
  const getAvatar = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : `${parts[0][0]}${parts[0][1] || ''}`.toUpperCase();
  };

  // Use real tenant name from profile if available
  const name = tenantProfile 
    ? `${tenantProfile.firstName} ${tenantProfile.lastName}`.trim()
    : `Tenant ${doc.tenantId?.slice(-4) || 'Unknown'}`;
  
  return {
    id: doc._id,
    name,
    role: "Tenant", // For agent conversations, the other party is typically a tenant
    avatar: getAvatar(name),
    lastMessage: doc.lastMessage?.text || "No messages yet",
    timestamp: doc.lastMessage?.timestamp 
      ? new Date(doc.lastMessage.timestamp).toLocaleString()
      : new Date(doc.createdAt).toLocaleString(),
    unreadCount: doc.unreadCounts[doc.agentId] || 0,
  };
};

// Helper function to convert ConversationDocument to UI Conversation for Tenant view
const convertConversationDocumentToUIConversationForTenant = (
  doc: ConversationDocument,
  agentProfile?: any
): Conversation => {
  // Generate avatar from name
  const getAvatar = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : `${parts[0][0]}${parts[0][1] || ''}`.toUpperCase();
  };

  // Use real agent name from profile if available
  const name = agentProfile 
    ? `${agentProfile.firstName} ${agentProfile.lastName}`.trim()
    : `Agent ${doc.agentId?.slice(-4) || 'Unknown'}`;
  
  return {
    id: doc._id,
    name,
    role: "Agent", // For tenant conversations, the other party is the agent
    avatar: getAvatar(name),
    lastMessage: doc.lastMessage?.text || "No messages yet",
    timestamp: doc.lastMessage?.timestamp 
      ? new Date(doc.lastMessage.timestamp).toLocaleString()
      : new Date(doc.createdAt).toLocaleString(),
    unreadCount: doc.unreadCounts[doc.tenantId!] || 0,
  };
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      if (!authUser || !currentUser) {
        return rejectWithValue("User is not authenticated");
      }

      // Handle Agent Flow
      if (authUser.role === Role.AGENT) {
        const agent = currentUser as Agent;
        const agentId = agent.agentId;

        // Step 1: Get agent code from current user (already have it)
        const agentCode = agent.agentCode;

        // Step 2.1: Get agent conversations by agent id
        const existingConversations: ConversationDocument[] = await Meteor.callAsync(
          MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_AGENT,
          agentId
        );

        // Step 2.2: Get tenant connections (properties managed by this agent)
        const agentProperties: ApiProperty[] = await Meteor.callAsync(
          MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_AGENT_ID,
          agentId
        );

        // Extract unique tenant IDs from properties
        const tenantConnections = new Set<string>();
        agentProperties.forEach(property => {
          if (property.tenantId && property.tenantId.trim() !== '') {
            tenantConnections.add(property.tenantId);
          }
        });

        // Step 3: Compare tenant connections against existing conversations
        const existingConversationTenantIds = new Set<string>();
        existingConversations.forEach(conversation => {
          if (conversation.tenantId) {
            existingConversationTenantIds.add(conversation.tenantId);
          }
        });

        // Find tenants that don't have conversations yet
        const tenantsWithoutConversations = Array.from(tenantConnections).filter(
          tenantId => !existingConversationTenantIds.has(tenantId)
        );

        // Step 4.2: Create new conversations for tenants without conversations
        const newConversations: ConversationDocument[] = [];
        
        for (const tenantId of tenantsWithoutConversations) {
          try {
            // Find the property for this tenant to get additional context
            const property = agentProperties.find(p => p.tenantId === tenantId);
            
            const newConversationData = {
              agentId: agentId,
              tenantId: tenantId,
              propertyId: property?.propertyId || undefined,
              landlordId: property?.landlordId || undefined,
              unreadCounts: {
                [agentId]: 0,
                [tenantId]: 0
              }
            };

            // The server method now handles duplicate checking, so we can call it directly
            const conversationId = await Meteor.callAsync(
              MeteorMethodIdentifier.CONVERSATION_INSERT,
              newConversationData
            );

            // Only add to newConversations if it's actually a new conversation
            // (server returns existing ID if conversation already exists)
            const isNewConversation = !existingConversations.some(conv => conv._id === conversationId);
            
            if (isNewConversation) {
              const newConversation: ConversationDocument = {
                _id: conversationId,
                agentId: agentId,
                tenantId: tenantId,
                propertyId: property?.propertyId,
                landlordId: property?.landlordId,
                unreadCounts: newConversationData.unreadCounts,
                createdAt: new Date(),
                updatedAt: new Date()
              };

              newConversations.push(newConversation);
            }
          } catch (error) {
            console.error(`Failed to create conversation for tenant ${tenantId}:`, error);
            // Continue with other tenants even if one fails
          }
        }

        // Step 4: Combine existing and new conversations
        const allConversations = [...existingConversations, ...newConversations];

        // Fetch tenant profiles for all conversations to get real names
        const tenantProfiles = new Map<string, any>();
        const uniqueTenantIds = [...new Set(allConversations.map(c => c.tenantId).filter(Boolean))];
        
        await Promise.all(
          uniqueTenantIds.map(async (tenantId) => {
            try {
              const profile = await Meteor.callAsync(
                MeteorMethodIdentifier.PROFILE_GET_BY_TENANT_ID,
                tenantId
              );
              tenantProfiles.set(tenantId!, profile);
            } catch (error) {
              console.error(`Failed to fetch profile for tenant ${tenantId}:`, error);
              // Continue without profile data for this tenant
            }
          })
        );

        // Convert to UI format with real tenant names
        const uiConversations: Conversation[] = allConversations.map(doc => 
          convertConversationDocumentToUIConversationForAgent(
            doc, 
            doc.tenantId ? tenantProfiles.get(doc.tenantId) : undefined
          )
        );

        return uiConversations;
      }

      // Handle Tenant Flow
      else if (authUser.role === Role.TENANT) {
        const tenant = currentUser as Tenant;
        const tenantId = tenant.tenantId;

        // Step 1: Get existing conversations for this tenant
        const existingConversations: ConversationDocument[] = await Meteor.callAsync(
          MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_TENANT,
          tenantId
        );

        // Step 2: If conversation exists, use it
        if (existingConversations.length > 0) {
          // Fetch agent profile for the conversation
          const conversation = existingConversations[0]; // Tenant only has one agent
          let agentProfile = null;
          
          if (conversation.agentId) {
            try {
              agentProfile = await Meteor.callAsync(
                MeteorMethodIdentifier.PROFILE_GET_BY_AGENT_ID,
                conversation.agentId
              );
            } catch (error) {
              console.error(`Failed to fetch profile for agent ${conversation.agentId}:`, error);
            }
          }

          // Convert to UI format
          const uiConversations: Conversation[] = [
            convertConversationDocumentToUIConversationForTenant(conversation, agentProfile)
          ];

          return uiConversations;
        }

        // Step 3: No conversation exists, find the agent from tenant's property
        const tenantProperty: ApiProperty = await Meteor.callAsync(
          MeteorMethodIdentifier.PROPERTY_GET_BY_TENANT_ID,
          tenantId
        );

        if (!tenantProperty || !tenantProperty.agentId) {
          return rejectWithValue("No property or agent found for this tenant");
        }

        // Step 4: Create new conversation with the agent
        const newConversationData = {
          agentId: tenantProperty.agentId,
          tenantId: tenantId,
          propertyId: tenantProperty.propertyId,
          landlordId: tenantProperty.landlordId,
          unreadCounts: {
            [tenantProperty.agentId]: 0,
            [tenantId]: 0
          }
        };

        const conversationId = await Meteor.callAsync(
          MeteorMethodIdentifier.CONVERSATION_INSERT,
          newConversationData
        );

        // Create the conversation document
        const newConversation: ConversationDocument = {
          _id: conversationId,
          agentId: tenantProperty.agentId,
          tenantId: tenantId,
          propertyId: tenantProperty.propertyId,
          landlordId: tenantProperty.landlordId,
          unreadCounts: newConversationData.unreadCounts,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Fetch agent profile
        let agentProfile = null;
        try {
          agentProfile = await Meteor.callAsync(
            MeteorMethodIdentifier.PROFILE_GET_BY_AGENT_ID,
            tenantProperty.agentId
          );
        } catch (error) {
          console.error(`Failed to fetch profile for agent ${tenantProperty.agentId}:`, error);
        }

        // Convert to UI format
        const uiConversations: Conversation[] = [
          convertConversationDocumentToUIConversationForTenant(newConversation, agentProfile)
        ];

        return uiConversations;
      }

      // Unsupported role
      return rejectWithValue("Unsupported user role");

    } catch (error) {
      console.error("Error fetching conversations:", error);
      return rejectWithValue("Failed to fetch conversations");
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      if (!authUser || !currentUser) {
        return rejectWithValue("User is not authenticated");
      }

      // Fetch messages from server
      const messageDocuments: MessageDocument[] = await Meteor.callAsync(
        MeteorMethodIdentifier.MESSAGES_GET_FOR_CONVERSATION,
        conversationId
      );

      // Determine current user's ID for isOutgoing logic
      let currentUserId: string;
      if (authUser.role === Role.AGENT) {
        const agent = currentUser as Agent;
        currentUserId = agent.agentId;
      } else if (authUser.role === Role.TENANT) {
        const tenant = currentUser as Tenant;
        currentUserId = tenant.tenantId;
      } else {
        return rejectWithValue("Unsupported user role");
      }

      // Convert MessageDocument[] to Message[] for UI
      const messages: Message[] = messageDocuments.map(doc => ({
        id: doc._id,
        text: doc.text,
        timestamp: new Date(doc.timestamp).toLocaleString(),
        isOutgoing: doc.senderId === currentUserId,
        isRead: doc.isRead,
      }));

      return { conversationId, messages };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return rejectWithValue("Failed to fetch messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData: { conversationId: string; text: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      if (!authUser || !currentUser) {
        return rejectWithValue("User is not authenticated");
      }

      // Determine sender ID and role based on current user
      let senderId: string;
      let senderRole: string;

      if (authUser.role === Role.AGENT) {
        const agent = currentUser as Agent;
        senderId = agent.agentId;
        senderRole = 'agent';
      } else if (authUser.role === Role.TENANT) {
        const tenant = currentUser as Tenant;
        senderId = tenant.tenantId;
        senderRole = 'tenant';
      } else {
        return rejectWithValue("Unsupported user role");
      }

      // Send message via Meteor method
      const messageId = await Meteor.callAsync(
        MeteorMethodIdentifier.MESSAGE_INSERT,
        {
          conversationId: messageData.conversationId,
          text: messageData.text,
          senderId,
          senderRole,
        }
      );

      // Create UI message object for immediate feedback
      const newMessage: Message = {
        id: messageId,
        text: messageData.text,
        timestamp: new Date().toLocaleString(),
        isOutgoing: true,
        isRead: false,
      };

      return { conversationId: messageData.conversationId, message: newMessage };
    } catch (error) {
      console.error("Error sending message:", error);
      return rejectWithValue("Failed to send message");
    }
  }
);

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload;
    },
    setMessageText(state, action: PayloadAction<string>) {
      state.messageText = action.payload;
    },
    clearMessageText(state) {
      state.messageText = "";
    },
    clearError(state) {
      state.error = null;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    updateConversationLastMessage(state, action: PayloadAction<{ conversationId: string; message: string; timestamp: string }>) {
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        conversation.lastMessage = action.payload.message;
        conversation.timestamp = action.payload.timestamp;
      }
    },
    // New actions for pub/sub integration
    setConversationsFromSubscription(state, action: PayloadAction<ConversationDocument[]>) {
      // Don't override conversations if they're already loaded with proper profile data
      // The subscription is mainly for real-time updates, not initial loading
      if (state.conversations.length > 0) {
        console.log('🔄 Redux: Conversations already loaded with profile data, skipping subscription override');
        return;
      }
      
      // Convert ConversationDocument[] to Conversation[] for UI
      const uiConversations: Conversation[] = action.payload.map(doc => {
        const getAvatar = (name: string) => {
          const parts = name.split(' ');
          return parts.length > 1 
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : `${parts[0][0]}${parts[0][1] || ''}`.toUpperCase();
        };

        // Use basic conversion as fallback - proper names should come from fetchConversations
        const name = `User ${doc.tenantId?.slice(-4) || doc.agentId?.slice(-4) || 'Unknown'}`;
        
        return {
          id: doc._id,
          name,
          role: doc.tenantId ? "Tenant" : doc.agentId ? "Agent" : "User",
          avatar: getAvatar(name),
          lastMessage: doc.lastMessage?.text || "No messages yet",
          timestamp: doc.lastMessage?.timestamp 
            ? new Date(doc.lastMessage.timestamp).toLocaleString()
            : new Date(doc.createdAt).toLocaleString(),
          unreadCount: 0, // Will be calculated based on current user
        };
      });
      
      state.conversations = uiConversations;
    },
    setMessagesFromSubscription(state, action: PayloadAction<{ conversationId: string; messages: MessageDocument[]; currentUserId?: string }>) {
      console.log('🔄 Redux: setMessagesFromSubscription called with', action.payload.messages.length, 'messages');
      
      // Convert MessageDocument[] to Message[] for UI
      const uiMessages: Message[] = action.payload.messages.map(doc => ({
        id: doc._id,
        text: doc.text,
        timestamp: new Date(doc.timestamp).toLocaleString(),
        isOutgoing: action.payload.currentUserId ? doc.senderId === action.payload.currentUserId : false,
        isRead: doc.isRead,
      }));
      
      console.log('🔄 Redux: Setting', uiMessages.length, 'UI messages');
      state.messages = uiMessages;
    },
  },
  extraReducers: (builder) => {
    // Fetch conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.conversationsLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversationsLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.conversationsLoading = false;
        state.error = action.payload as string;
      });

    // Fetch messages
    builder
      .addCase(fetchConversationMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload as string;
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add message immediately for instant feedback, subscription will sync later
        state.messages.push(action.payload.message);
        state.messageText = "";
        console.log('📤 Message sent successfully, added to UI immediately');
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setActiveConversation,
  setMessageText,
  clearMessageText,
  clearError,
  addMessage,
  updateConversationLastMessage,
  setConversationsFromSubscription,
  setMessagesFromSubscription,
} = messagesSlice.actions;

// Export selectors
export const selectMessages = (state: RootState) => state.messages;
export const selectAllConversations = (state: RootState) => state.messages.conversations;
export const selectActiveConversationId = (state: RootState) => state.messages.activeConversationId;
export const selectAllMessages = (state: RootState) => state.messages.messages;
export const selectMessageText = (state: RootState) => state.messages.messageText;
export const selectIsLoading = (state: RootState) => state.messages.isLoading;
export const selectConversationsLoading = (state: RootState) => state.messages.conversationsLoading;
export const selectMessagesLoading = (state: RootState) => state.messages.messagesLoading;
export const selectError = (state: RootState) => state.messages.error;

// Role-based selectors using currentUser role
export const selectConversationsForRole = (role: string) => (state: RootState) => {
  const currentRole = state.currentUser.authUser?.role;
  if (!currentRole) return [];
  
  // For agents, return all conversations (they are already filtered by agent in fetchConversations)
  // For other roles, we can add specific filtering logic later
  if (role === 'agent' && currentRole === Role.AGENT) {
    return state.messages.conversations;
  } else if (role === 'landlord' && currentRole === Role.LANDLORD) {
    // TODO: Implement landlord conversation filtering
    return state.messages.conversations;
  } else if (role === 'tenant' && currentRole === Role.TENANT) {
    // TODO: Implement tenant conversation filtering
    return state.messages.conversations;
  }
  
  return [];
};

export const selectMessagesForCurrentUser = (state: RootState) => {
  return state.messages.messages;
};

export default messagesSlice.reducer;
