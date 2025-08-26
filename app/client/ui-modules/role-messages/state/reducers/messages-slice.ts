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
import { ApiConversation } from "/app/shared/api-models/messaging/ApiConversation";

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
      const state = getState() as RootState;
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      // Validate user authentication using helper function
      const userContext = validateAndGetUserContext(currentUser, authUser);

      // Route to appropriate role-specific handler
      if (isAgent(userContext.authUser.role)) {
        return await handleAgentConversations(userContext.currentUser as Agent);
      } else if (isTenant(userContext.authUser.role)) {
        return await handleTenantConversations(userContext.currentUser as Tenant);
      } else if (isLandlord(userContext.authUser.role)) {
        return await handleLandlordConversations(userContext.currentUser as Landlord);
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

      const state = getState() as RootState;
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
      const state = getState() as RootState;
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

      const state = getState() as RootState;
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
    setActiveConversation(state, action: PayloadAction<string>) {
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
    setConversationsFromSubscription(state, action: PayloadAction<{ conversations: ApiConversation[]; currentUserId: string }>) {
      
      // Helper function to generate user avatars from names
      const getAvatar = (name: string) => {
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
          avatar: existingConversation?.avatar || getAvatar(existingConversation?.name || 'User'),
          lastMessage: doc.lastMessage?.text || "No messages yet",
          timestamp,
          unreadCount,
        };
      });
      
      state.conversations = uiConversations;
    },

    /**
     * Updates messages from real-time subscription data
     * Converts server message documents to UI format with proper isOutgoing logic
     */
    setMessagesFromSubscription(state, action: PayloadAction<{ conversationId: string; messages: any[]; currentUserId?: string }>) {
      
      // Convert message documents to Message[] for UI
      const uiMessages: Message[] = action.payload.messages.map(doc => ({
        id: doc._id,
        text: doc.text,
        timestamp: new Date(doc.timestamp).toLocaleString(),
        isOutgoing: action.payload.currentUserId ? doc.senderId === action.payload.currentUserId : false,
        isRead: doc.isRead,
      }));
      
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
