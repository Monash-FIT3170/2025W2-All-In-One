import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { MessagesState } from "../MessagesPageUIState";
import { Conversation } from "/app/client/library-modules/domain-models/messaging/Conversation";
import { Message } from "/app/client/library-modules/domain-models/messaging/Message";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { Role } from "/app/shared/user-role-identifier";
import { formatConversationTimestamp } from "../../utils/timestamp-utils";
import { 
  getConversationsForAgent,
  getConversationsForTenant,
  getConversationsForLandlord,
  getMessagesForConversation,
  sendMessage as sendMessageRepo,
  createConversation,
  resetUnreadCount as resetUnreadCountRepo,
  convertApiConversationsToAgentView,
  convertApiConversationsToTenantView,
  convertApiConversationsToLandlordView
} from "/app/client/library-modules/domain-models/messaging/messaging-repository";
import { ApiConversation } from "/app/shared/api-models/messaging/ApiConversation";
import { apiGetUserAccount } from "/app/client/library-modules/apis/user/user-account-api";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { Meteor } from "meteor/meteor";

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

      // Handle Agent Flow - Agent needs BOTH tenant AND landlord conversations
      if (authUser.role === Role.AGENT) {
        const agent = currentUser as Agent;
        const agentId = agent.agentId;

        // Step 1: Get existing agent conversations
        const existingConversations: ApiConversation[] = await getConversationsForAgent(agentId);

        // Step 2: Get properties managed by this agent
        const agentProperties = await Meteor.callAsync(
          MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_AGENT_ID,
          agentId
        );

        // Step 3: Extract unique tenant and landlord IDs from properties
        const tenantConnections = new Set<string>();
        const landlordConnections = new Set<string>();
        
        agentProperties.forEach((property: any) => {
          if (property.tenantId && property.tenantId.trim() !== '') {
            tenantConnections.add(property.tenantId);
          }
          if (property.landlordId && property.landlordId.trim() !== '') {
            landlordConnections.add(property.landlordId);
          }
        });

        // Step 4: Check existing conversations
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

        // Step 5: Find missing conversations
        const tenantsWithoutConversations = Array.from(tenantConnections).filter(
          tenantId => !existingTenantIds.has(tenantId)
        );
        const landlordsWithoutConversations = Array.from(landlordConnections).filter(
          landlordId => !existingLandlordIds.has(landlordId)
        );

        // Step 6: Create new conversations
        const newConversations: ApiConversation[] = [];
        
        // Create tenant conversations (AGENT ↔ TENANT ONLY)
        for (const tenantId of tenantsWithoutConversations) {
          try {
            const property = agentProperties.find((p: any) => p.tenantId === tenantId);
            
            const newConversationData = {
              agentId: agentId,
              tenantId: tenantId,
              propertyId: property?.propertyId || undefined,
              unreadCounts: {
                [agentId]: 0,
                [tenantId]: 0
              }
            };

            const conversationId = await createConversation(newConversationData);

            const isNewConversation = !existingConversations.some(conv => conv.conversationId === conversationId);
            
            if (isNewConversation) {
              const newConversation: ApiConversation = {
                conversationId: conversationId,
                agentId: agentId,
                tenantId: tenantId,
                propertyId: property?.propertyId,
                unreadCounts: newConversationData.unreadCounts,
                activeUsers: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };

              newConversations.push(newConversation);
            }
          } catch (error) {
            console.error(`Failed to create conversation for tenant ${tenantId}:`, error);
          }
        }

        // Create landlord conversations (AGENT ↔ LANDLORD ONLY)
        for (const landlordId of landlordsWithoutConversations) {
          try {
            const property = agentProperties.find((p: any) => p.landlordId === landlordId);
            
            const newConversationData = {
              agentId: agentId,
              landlordId: landlordId,
              propertyId: property?.propertyId || undefined,
              unreadCounts: {
                [agentId]: 0,
                [landlordId]: 0
              }
            };

            const conversationId = await createConversation(newConversationData);

            const isNewConversation = !existingConversations.some(conv => conv.conversationId === conversationId);
            
            if (isNewConversation) {
              const newConversation: ApiConversation = {
                conversationId: conversationId,
                agentId: agentId,
                landlordId: landlordId,
                propertyId: property?.propertyId,
                unreadCounts: newConversationData.unreadCounts,
                activeUsers: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };

              newConversations.push(newConversation);
            }
          } catch (error) {
            console.error(`Failed to create conversation for landlord ${landlordId}:`, error);
          }
        }

        // Step 7: Combine all conversations
        const allConversations = [...existingConversations, ...newConversations];

        // Step 8: Fetch profiles for both tenants and landlords
        const tenantProfiles = new Map<string, any>();
        const landlordProfiles = new Map<string, any>();
        
        const uniqueTenantIds = [...new Set(allConversations.map(c => c.tenantId).filter(Boolean))];
        const uniqueLandlordIds = [...new Set(allConversations.map(c => c.landlordId).filter(Boolean))];
        
        // Fetch tenant profiles
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
            }
          })
        );

        // Fetch landlord profiles
        await Promise.all(
          uniqueLandlordIds.map(async (landlordId) => {
            try {
              const profile = await Meteor.callAsync(
                MeteorMethodIdentifier.PROFILE_GET_BY_LANDLORD_ID,
                landlordId
              );
              landlordProfiles.set(landlordId!, profile);
            } catch (error) {
              console.error(`Failed to fetch profile for landlord ${landlordId}:`, error);
            }
          })
        );

        // Step 9: Convert to UI format with proper role identification
        const uiConversations: Conversation[] = convertApiConversationsToAgentView(
          allConversations,
          agentId,
          tenantProfiles,
          landlordProfiles
        );

        return uiConversations;
      }

      // Handle Tenant Flow
      else if (authUser.role === Role.TENANT) {
        const tenant = currentUser as Tenant;
        const tenantId = tenant.tenantId;

        // Step 1: Get existing conversations for this tenant
        const existingConversations: ApiConversation[] = await getConversationsForTenant(tenantId);

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
          const uiConversations: Conversation[] = convertApiConversationsToTenantView(
            existingConversations,
            tenantId,
            agentProfile
          );

          return uiConversations;
        }

        // Step 3: No conversation exists, find the agent from tenant's property
        const tenantProperty = await Meteor.callAsync(
          MeteorMethodIdentifier.PROPERTY_GET_BY_TENANT_ID,
          tenantId
        );

        if (!tenantProperty || !tenantProperty.agentId) {
          return rejectWithValue("No property or agent found for this tenant");
        }

        // Step 4: Create new conversation with the agent (AGENT ↔ TENANT ONLY)
        const newConversationData = {
          agentId: tenantProperty.agentId,
          tenantId: tenantId,
          propertyId: tenantProperty.propertyId,
          unreadCounts: {
            [tenantProperty.agentId]: 0,
            [tenantId]: 0
          }
        };

        const conversationId = await createConversation(newConversationData);

        // Create the conversation document
        const newConversation: ApiConversation = {
          conversationId: conversationId,
          agentId: tenantProperty.agentId,
          tenantId: tenantId,
          propertyId: tenantProperty.propertyId,
          unreadCounts: newConversationData.unreadCounts,
          activeUsers: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
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
        const uiConversations: Conversation[] = convertApiConversationsToTenantView(
          [newConversation],
          tenantId,
          agentProfile
        );

        return uiConversations;
      }

      // Handle Landlord Flow
      else if (authUser.role === Role.LANDLORD) {
        const landlord = currentUser as Landlord;
        const landlordId = landlord.landlordId;

        // Step 1: Get existing conversations for this landlord
        const existingConversations: ApiConversation[] = await getConversationsForLandlord(landlordId);

        // Step 2: If conversation exists, use it
        if (existingConversations.length > 0) {
          // Fetch agent profile for the conversation
          const conversation = existingConversations[0]; // Landlord only has one agent
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
          const uiConversations: Conversation[] = convertApiConversationsToLandlordView(
            existingConversations,
            landlordId,
            agentProfile
          );

          return uiConversations;
        }

        // Step 3: No conversation exists, find the agent from landlord's property
        const landlordProperties = await Meteor.callAsync(
          MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_LANDLORD_ID,
          landlordId
        );

        if (!landlordProperties || landlordProperties.length === 0) {
          return rejectWithValue("No properties found for this landlord");
        }

        // Get the first property with an agent
        const landlordProperty = landlordProperties.find((p: any) => p.agentId);

        if (!landlordProperty || !landlordProperty.agentId) {
          return rejectWithValue("No property or agent found for this landlord");
        }

        // Step 4: Create new conversation with the agent (AGENT ↔ LANDLORD ONLY)
        const newConversationData = {
          agentId: landlordProperty.agentId,
          landlordId: landlordId,
          propertyId: landlordProperty.propertyId,
          unreadCounts: {
            [landlordProperty.agentId]: 0,
            [landlordId]: 0
          }
        };

        const conversationId = await createConversation(newConversationData);

        // Create the conversation document
        const newConversation: ApiConversation = {
          conversationId: conversationId,
          agentId: landlordProperty.agentId,
          landlordId: landlordId,
          propertyId: landlordProperty.propertyId,
          unreadCounts: newConversationData.unreadCounts,
          activeUsers: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Fetch agent profile
        let agentProfile = null;
        try {
          agentProfile = await Meteor.callAsync(
            MeteorMethodIdentifier.PROFILE_GET_BY_AGENT_ID,
            landlordProperty.agentId
          );
        } catch (error) {
          console.error(`Failed to fetch profile for agent ${landlordProperty.agentId}:`, error);
        }

        // Convert to UI format
        const uiConversations: Conversation[] = convertApiConversationsToLandlordView(
          [newConversation],
          landlordId,
          agentProfile
        );

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
      // Validate conversationId
      if (!conversationId || conversationId === 'null' || conversationId === 'undefined') {
        console.error("Cannot fetch messages: conversationId is null or undefined");
        return rejectWithValue("Invalid conversation ID");
      }

      const state = getState() as RootState;
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      if (!authUser || !currentUser) {
        return rejectWithValue("User is not authenticated");
      }

      // Determine current user's ID for isOutgoing logic
      let currentUserId: string;
      if (authUser.role === Role.AGENT) {
        const agent = currentUser as Agent;
        currentUserId = agent.agentId;
      } else if (authUser.role === Role.TENANT) {
        const tenant = currentUser as Tenant;
        currentUserId = tenant.tenantId;
      } else if (authUser.role === Role.LANDLORD) {
        const landlord = currentUser as Landlord;
        currentUserId = landlord.landlordId;
      } else {
        return rejectWithValue("Unsupported user role");
      }

      // Fetch messages using repository
      const messages: Message[] = await getMessagesForConversation(conversationId, currentUserId);

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
      } else if (authUser.role === Role.LANDLORD) {
        const landlord = currentUser as Landlord;
        senderId = landlord.landlordId;
        senderRole = 'landlord';
      } else {
        return rejectWithValue("Unsupported user role");
      }

      // Send message via repository
      const messageId = await sendMessageRepo({
        conversationId: messageData.conversationId,
        text: messageData.text,
        senderId,
        senderRole,
      });

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

// Reset unread count when opening a conversation
export const resetUnreadCount = createAsyncThunk(
  "messages/resetUnreadCount",
  async (conversationId: string, { getState, rejectWithValue }) => {
    try {
      // Validate conversationId
      if (!conversationId || conversationId === 'null' || conversationId === 'undefined') {
        console.error("Cannot reset unread count: conversationId is null or undefined");
        return rejectWithValue("Invalid conversation ID");
      }

      const state = getState() as RootState;
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      if (!authUser || !currentUser) {
        return rejectWithValue("User is not authenticated");
      }

      // Determine current user's ID
      let currentUserId: string;
      if (authUser.role === Role.AGENT) {
        const agent = currentUser as Agent;
        currentUserId = agent.agentId;
      } else if (authUser.role === Role.TENANT) {
        const tenant = currentUser as Tenant;
        currentUserId = tenant.tenantId;
      } else if (authUser.role === Role.LANDLORD) {
        const landlord = currentUser as Landlord;
        currentUserId = landlord.landlordId;
      } else {
        return rejectWithValue("Unsupported user role");
      }

      // Reset unread count via repository
      await resetUnreadCountRepo(conversationId, currentUserId);

      return { conversationId, userId: currentUserId };
    } catch (error) {
      console.error("Error resetting unread count:", error);
      return rejectWithValue("Failed to reset unread count");
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
    resetConversationUnreadCount(state, action: PayloadAction<string>) {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
    // New actions for pub/sub integration
    setConversationsFromSubscription(state, action: PayloadAction<{ conversations: ApiConversation[]; currentUserId: string }>) {
      // Always update conversations from subscription for real-time updates
      console.log('🔄 Redux: Updating conversations from subscription with', action.payload.conversations.length, 'conversations');
      
      // Convert ApiConversation[] to Conversation[] for UI
      const uiConversations: Conversation[] = action.payload.conversations.map(doc => {
        const getAvatar = (name: string) => {
          const parts = name.split(' ');
          return parts.length > 1 
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : `${parts[0][0]}${parts[0][1] || ''}`.toUpperCase();
        };

        // Try to preserve existing conversation data (name, role) if available
        const existingConversation = state.conversations.find(c => c.id === doc.conversationId);
        
        // Calculate unread count for current user
        let unreadCount = 0;
        if (doc.unreadCounts && action.payload.currentUserId) {
          unreadCount = doc.unreadCounts[action.payload.currentUserId] || 0;
        }
        
        // Determine timestamp - only show timestamp if there's an actual message
        let timestamp = '';
        if (doc.lastMessage?.timestamp && doc.lastMessage?.text && doc.lastMessage.text.trim() !== '') {
          timestamp = formatConversationTimestamp(new Date(doc.lastMessage.timestamp));
          console.log('🕐 Using lastMessage timestamp:', doc.lastMessage.timestamp, '-> formatted:', timestamp);
        } else {
          timestamp = '';
          console.log('🕐 No timestamp - conversation has no messages:', doc.conversationId);
        }
        
        return {
          id: doc.conversationId,
          name: existingConversation?.name || `User ${doc.tenantId?.slice(-4) || doc.agentId?.slice(-4) || 'Unknown'}`,
          role: existingConversation?.role || (doc.tenantId ? "Tenant" : doc.agentId ? "Agent" : "User"),
          avatar: existingConversation?.avatar || getAvatar(existingConversation?.name || 'User'),
          lastMessage: doc.lastMessage?.text || "No messages yet",
          timestamp,
          unreadCount,
        };
      });
      
      state.conversations = uiConversations;
    },
    setMessagesFromSubscription(state, action: PayloadAction<{ conversationId: string; messages: any[]; currentUserId?: string }>) {
      console.log('🔄 Redux: setMessagesFromSubscription called with', action.payload.messages.length, 'messages');
      
      // Convert message documents to Message[] for UI
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
        
        // Update the conversation tile's last message in real-time with proper formatting
        const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
        if (conversation) {
          conversation.lastMessage = action.payload.message.text;
          conversation.timestamp = formatConversationTimestamp(new Date());
        }
        
        console.log('📤 Message sent successfully, added to UI immediately and updated conversation tile');
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset unread count
    builder
      .addCase(resetUnreadCount.fulfilled, (state, action) => {
        // Reset unread count in UI immediately
        const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
        console.log('🔄 Unread count reset for conversation:', action.payload.conversationId);
      })
      .addCase(resetUnreadCount.rejected, (state, action) => {
        console.error('Failed to reset unread count:', action.payload);
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
  resetConversationUnreadCount,
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
    return state.messages.conversations;
  } else if (role === 'tenant' && currentRole === Role.TENANT) {
    return state.messages.conversations;
  }
  
  return [];
};

export const selectMessagesForCurrentUser = (state: RootState) => {
  return state.messages.messages;
};

export default messagesSlice.reducer;
