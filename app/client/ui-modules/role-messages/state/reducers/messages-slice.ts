/**
 * Messages Redux Slice
 * 
 * This slice manages the messaging state for the application, handling:
 * - Conversation fetching and management for different user roles
 * - Message sending and receiving
 * - Real-time updates via subscriptions
 * - Unread count management
 */

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
  getMessagesForConversation,
  sendMessage as sendMessageRepo,
  resetUnreadCount as resetUnreadCountRepo,
} from "/app/client/library-modules/domain-models/messaging/messaging-repository";
import { apiAddActiveUser, apiRemoveActiveUser } from "/app/client/library-modules/apis/messaging/messaging-api";
import { ApiConversation } from "/app/shared/api-models/messaging/ApiConversation";
import { ApiMessage } from "/app/shared/api-models/messaging/ApiMessage";

// Import helper functions
import { 
  validateAndGetUserContext, 
  validateConversationId,
  isAgent,
  isTenant,
  isLandlord
} from "../helpers/user-auth-helpers";
import {
  handleAgentConversations,
  handleTenantConversations,
  handleLandlordConversations
} from "../helpers/role-conversation-handlers";

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

/**
 * Async Thunks - These handle the complex business logic for messaging operations
 */

/**
 * Fetches conversations for the current user based on their role
 */
export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { currentUser: { currentUser: Agent | Tenant | Landlord | null; authUser: { role: Role } | null } };
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      // Validate user authentication using helper function
      const userContext = validateAndGetUserContext(currentUser, authUser);

      // Route to appropriate role-specific handler
      if (isAgent(userContext.authUser.role)) {
        if ('agentId' in userContext.currentUser) {
          return await handleAgentConversations(userContext.currentUser);
        }
        return rejectWithValue("Invalid agent user data");
      } else if (isTenant(userContext.authUser.role)) {
        if ('tenantId' in userContext.currentUser) {
          return await handleTenantConversations(userContext.currentUser);
        }
        return rejectWithValue("Invalid tenant user data");
      } else if (isLandlord(userContext.authUser.role)) {
        if ('landlordId' in userContext.currentUser) {
          return await handleLandlordConversations(userContext.currentUser);
        }
        return rejectWithValue("Invalid landlord user data");
      } else {
        return rejectWithValue("Unsupported user role");
      }

    } catch (error) {
      console.error("Error fetching conversations:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch conversations");
    }
  }
);

/**
 * Fetches messages for a specific conversation
 * Validates conversation ID and user authentication before fetching
 */
export const fetchConversationMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId: string, { getState, rejectWithValue }) => {
    try {
      // Validate conversation ID using helper function
      validateConversationId(conversationId);

      const state = getState() as { currentUser: { currentUser: Agent | Tenant | Landlord | null; authUser: { role: Role } | null } };
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      // Validate user authentication and get user context
      const userContext = validateAndGetUserContext(currentUser, authUser);

      // Fetch messages using repository with current user ID for isOutgoing logic
      const messages: Message[] = await getMessagesForConversation(conversationId, userContext.userId);

      return { conversationId, messages };
    } catch (error) {
      console.error("Error fetching messages:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch messages");
    }
  }
);

/**
 * Sends a message in a conversation
 * Validates user authentication and creates immediate UI feedback
 */
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData: { conversationId: string; text: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { currentUser: { currentUser: Agent | Tenant | Landlord | null; authUser: { role: Role } | null } };
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      // Validate user authentication and get user context
      const userContext = validateAndGetUserContext(currentUser, authUser);

      // Send message via repository
      const messageId = await sendMessageRepo({
        conversationId: messageData.conversationId,
        text: messageData.text,
        senderId: userContext.userId,
        senderRole: userContext.userRole,
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
      return rejectWithValue(error instanceof Error ? error.message : "Failed to send message");
    }
  }
);

/**
 * Resets unread count when opening a conversation
 * Validates conversation ID and user authentication before resetting
 */
export const resetUnreadCount = createAsyncThunk(
  "messages/resetUnreadCount",
  async (conversationId: string, { getState, rejectWithValue }) => {
    try {
      // Validate conversation ID using helper function
      validateConversationId(conversationId);

      const state = getState() as { currentUser: { currentUser: Agent | Tenant | Landlord | null; authUser: { role: Role } | null } };
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      // Validate user authentication and get user context
      const userContext = validateAndGetUserContext(currentUser, authUser);

      // Reset unread count via repository
      await resetUnreadCountRepo(conversationId, userContext.userId);

      return { conversationId, userId: userContext.userId };
    } catch (error) {
      console.error("Error resetting unread count:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Failed to reset unread count");
    }
  }
);

/**
 * Adds current user to active users list when opening a conversation
 * Validates conversation ID and user authentication before adding
 */
export const addActiveUser = createAsyncThunk(
  "messages/addActiveUser",
  async (conversationId: string, { getState, rejectWithValue }) => {
    try {
      // Validate conversation ID using helper function
      validateConversationId(conversationId);

      const state = getState() as { currentUser: { currentUser: Agent | Tenant | Landlord | null; authUser: { role: Role } | null } };
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      // Validate user authentication and get user context
      const userContext = validateAndGetUserContext(currentUser, authUser);

      // Add user to active users via API
      await apiAddActiveUser(conversationId, userContext.userId);

      return { conversationId, userId: userContext.userId };
    } catch (error) {
      console.error("Error adding active user:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Failed to add active user");
    }
  }
);

/**
 * Removes current user from active users list when leaving a conversation
 * Validates conversation ID and user authentication before removing
 */
export const removeActiveUser = createAsyncThunk(
  "messages/removeActiveUser",
  async (conversationId: string, { getState, rejectWithValue }) => {
    try {
      // Validate conversation ID using helper function
      validateConversationId(conversationId);

      const state = getState() as { currentUser: { currentUser: Agent | Tenant | Landlord | null; authUser: { role: Role } | null } };
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      // Validate user authentication and get user context
      const userContext = validateAndGetUserContext(currentUser, authUser);

      // Remove user from active users via API
      await apiRemoveActiveUser(conversationId, userContext.userId);

      return { conversationId, userId: userContext.userId };
    } catch (error) {
      console.error("Error removing active user:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Failed to remove active user");
    }
  }
);

/**
 * Updates conversation metadata (names, avatars) for conversations that need profile data
 * Called when new conversations appear via real-time subscriptions
 */
export const updateConversationMetadata = createAsyncThunk(
  "messages/updateConversationMetadata",
  async (_, { getState, dispatch }) => {
    try {
      const state = getState() as { messages: MessagesState; currentUser: { currentUser: Agent | Tenant | Landlord | null; authUser: { role: Role } | null } };
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;
      const conversations = state.messages.conversations;

      // Validate user authentication
      if (!currentUser || !authUser) {
        return;
      }

      // Find conversations that need metadata updates (have generic names like "User C8Hd")
      const conversationsNeedingUpdate = conversations.filter(conv =>
        conv.name.startsWith('User ') && conv.name.length <= 10 // Generic names are short
      );

      if (conversationsNeedingUpdate.length === 0) {
        return;
      }

      // For all roles, dispatch fetchConversations to get proper metadata
      // This ensures profile data is fetched and conversation names are updated
      dispatch(fetchConversations());

    } catch (error) {
      console.error("Error updating conversation metadata:", error);
    }
  }
);

/**
 * Redux Slice Definition
 * Contains reducers for synchronous state updates and real-time subscription handling
 */
export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    /**
     * Sets the currently active conversation ID
     * Used when user selects a conversation to view
     */
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
    },

    /**
     * Updates the message text being typed by the user
     * Used for controlled input in the message text field
     */
    setMessageText(state, action: PayloadAction<string>) {
      state.messageText = action.payload;
    },

    /**
     * Clears the message text field
     * Used after sending a message or canceling input
     */
    clearMessageText(state) {
      state.messageText = "";
    },

    /**
     * Clears any error messages from the state
     * Used to dismiss error notifications
     */
    clearError(state) {
      state.error = null;
    },

    /**
     * Adds a new message to the current conversation
     * Used for optimistic updates when sending messages
     */
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },

    /**
     * Updates the last message and timestamp for a conversation
     * Used to update conversation tiles when new messages arrive
     */
    updateConversationLastMessage(state, action: PayloadAction<{ conversationId: string; message: string; timestamp: string }>) {
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        conversation.lastMessage = action.payload.message;
        conversation.timestamp = action.payload.timestamp;
      }
    },

    /**
     * Resets the unread count for a specific conversation
     * Used when user opens a conversation to mark it as read
     */
    resetConversationUnreadCount(state, action: PayloadAction<string>) {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    /**
     * Updates conversations from real-time subscription data
     * Converts API format to UI format and preserves existing conversation metadata
     */
    setConversationsFromSubscription(state, action: PayloadAction<{ conversations: ApiConversation[]; currentUserId: string; dispatch?: any }>) {

      // Helper function to generate user avatars from names
      const getAvatarInitials = (name: string) => {
        const parts = name.split(' ');
        return parts.length > 1
          ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
          : `${parts[0][0]}${parts[0][1] || ''}`.toUpperCase();
      };

      // Convert ApiConversation[] to Conversation[] for UI
      const uiConversations: Conversation[] = action.payload.conversations.map(doc => {
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
        } else {
          timestamp = '';
        }

        return {
          id: doc.conversationId,
          name: existingConversation?.name || `User ${doc.tenantId?.slice(-4) || doc.agentId?.slice(-4) || 'Unknown'}`,
          role: existingConversation?.role || (doc.tenantId ? "Tenant" : doc.agentId ? "Agent" : "User"),
          avatar: existingConversation?.avatar || getAvatarInitials(existingConversation?.name || 'User'),
          lastMessage: doc.lastMessage?.text || "No messages yet",
          timestamp,
          unreadCount,
        };
      });

      state.conversations = uiConversations;

      // Check if any conversations have generic names and need metadata updates
      const hasGenericNames = uiConversations.some(conv =>
        conv.name.startsWith('User ') && conv.name.length <= 10
      );

      // If we have conversations with generic names and a dispatch function, update metadata
      if (hasGenericNames && action.payload.dispatch) {
        console.log("Detected conversations with generic names, updating metadata");
        // Use setTimeout to avoid dispatching during reducer execution
        setTimeout(() => {
          action.payload.dispatch(updateConversationMetadata());
        }, 100);
      }
    },

    /**
     * Updates messages from real-time subscription data
     * Converts server message documents to UI format with proper isOutgoing logic
     * Also marks previous messages as read when recipient responds
     */
    setMessagesFromSubscription(state, action: PayloadAction<{ conversationId: string; messages: ApiMessage[]; currentUserId?: string }>) {

      // Convert API messages to Message[] for UI
      const uiMessages: Message[] = action.payload.messages.map(doc => ({
        id: doc.messageId,
        text: doc.text,
        timestamp: new Date(doc.timestamp).toLocaleString(),
        isOutgoing: action.payload.currentUserId ? doc.senderId === action.payload.currentUserId : false,
        isRead: doc.isRead,
      }));

      // If we have a current user, mark previous outgoing messages as read
      // when the other user sends a new message (they've clearly read the conversation)
      if (action.payload.currentUserId && uiMessages.length > 0) {
        // Find the latest incoming message
        const latestIncomingMessage = uiMessages
          .filter(msg => !msg.isOutgoing)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        if (latestIncomingMessage) {
          // Mark all previous outgoing messages as read
          uiMessages.forEach(msg => {
            if (msg.isOutgoing && new Date(msg.timestamp) <= new Date(latestIncomingMessage.timestamp)) {
              msg.isRead = true;
            }
          });
        }
      }

      // Replace messages array with subscription data (this is the authoritative source)
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
        // Only add message if it doesn't already exist (prevent duplicates from race conditions)
        const messageExists = state.messages.some(msg => msg.id === action.payload.message.id);
        if (!messageExists) {
          state.messages.push(action.payload.message);
        }
        state.messageText = "";
        
        // Update the conversation tile's last message in real-time with proper formatting
        const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
        if (conversation) {
          conversation.lastMessage = action.payload.message.text;
          conversation.timestamp = formatConversationTimestamp(new Date());
        }
        
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
      })
      .addCase(resetUnreadCount.rejected, (state, action) => {
        console.error('Failed to reset unread count:', action.payload);
      });
  },
});

/**
 * Action Exports
 * These actions can be dispatched from components to update the messaging state
 */
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

/**
 * Selector Functions
 * These functions extract specific pieces of state for use in components
 * They provide a clean interface for accessing messaging data
 */

/**
 * Selects all conversations for the current user
 * Returns an array of Conversation objects formatted for UI display
 */
export const selectAllConversations = (state: RootState) => state.messages.conversations;

/**
 * Selects the ID of the currently active conversation
 * Returns null if no conversation is selected
 */
export const selectActiveConversationId = (state: RootState) => state.messages.activeConversationId;

/**
 * Selects all messages for the currently active conversation
 * Returns an array of Message objects formatted for UI display
 */
export const selectAllMessages = (state: RootState) => state.messages.messages;

/**
 * Selects the current message text being typed by the user
 * Used for controlled input components
 */
export const selectMessageText = (state: RootState) => state.messages.messageText;

/**
 * Selects the loading state for message sending operations
 * True when a message is being sent
 */
export const selectIsLoading = (state: RootState) => state.messages.isLoading;

/**
 * Selects the loading state for conversation fetching operations
 * True when conversations are being loaded
 */
export const selectConversationsLoading = (state: RootState) => state.messages.conversationsLoading;

/**
 * Selects the loading state for message fetching operations
 * True when messages for a conversation are being loaded
 */
export const selectMessagesLoading = (state: RootState) => state.messages.messagesLoading;

/**
 * Selects any error messages from messaging operations
 * Returns null if no errors are present
 */
export const selectError = (state: RootState) => state.messages.error;

/**
 * Role-based selector that filters conversations based on user role
 * @param role - The role to filter conversations for ('agent', 'tenant', 'landlord')
 * @returns A selector function that returns conversations for the specified role
 * 
 * Note: Currently returns all conversations as they are already filtered by role
 * in the fetchConversations thunk. This selector provides future extensibility
 * for additional role-based filtering if needed.
 */
export const selectConversationsForRole = (role: string) => (state: RootState) => {
  const currentRole = state.currentUser.authUser?.role;
  if (!currentRole) return [];
  
  // Conversations are already filtered by role in fetchConversations
  // This selector ensures type safety and provides a consistent interface
  if (role === 'agent' && currentRole === Role.AGENT) {
    return state.messages.conversations;
  } else if (role === 'landlord' && currentRole === Role.LANDLORD) {
    return state.messages.conversations;
  } else if (role === 'tenant' && currentRole === Role.TENANT) {
    return state.messages.conversations;
  }
  
  return [];
};

export default messagesSlice.reducer;
