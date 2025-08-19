import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { MessagesState } from "../MessagesPageUIState";
import { Conversation, Message } from "../../types";
import { Meteor } from "meteor/meteor";
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

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

// Helper functions to separate concerns
const createErrorConversation = (id: string, name: string, message: string, avatar: string): Conversation => ({
  id,
  name,
  role: "Info",
  avatar,
  lastMessage: message,
  timestamp: "Error",
  unreadCount: 0,
});

const createConversationFromProfile = (
  id: string,
  profile: any,
  role: "Landlord" | "Tenant",
  isNew: boolean = false
): Conversation => ({
  id,
  name: `${profile.firstName} ${profile.lastName}`,
  role,
  avatar: `${profile.firstName?.[0] || role[0]}${profile.lastName?.[0] || role[1]}`,
  lastMessage: isNew ? "Start conversation" : "No messages yet",
  timestamp: isNew ? "New" : "No messages",
  unreadCount: 0,
});

const createConversationFromExisting = (
  conv: any,
  profile: any,
  role: "Landlord" | "Tenant",
  userId: string
): Conversation => ({
  id: conv._id,
  name: `${profile.firstName} ${profile.lastName}`,
  role,
  avatar: `${profile.firstName?.[0] || role[0]}${profile.lastName?.[0] || role[1]}`,
  lastMessage: conv.lastMessage?.text || "No messages yet",
  timestamp: conv.lastMessage?.timestamp 
    ? new Date(conv.lastMessage.timestamp).toLocaleString() 
    : "New",
  unreadCount: conv.unreadCounts?.[userId] || 0,
});

// Async thunk for getting agent data
const getAgentData = async (userId: string) => {
  const agent = await Meteor.callAsync(MeteorMethodIdentifier.AGENT_GET, userId);
  if (!agent || !agent.agentId) {
    throw new Error("Agent profile not found");
  }
  return agent;
};

// Async thunk for getting properties
const getPropertiesForAgent = async (agentId: string) => {
  const properties = await Meteor.callAsync(
    MeteorMethodIdentifier.PROPERTY_GET_ALL_BY_AGENT_ID,
    agentId
  );
  if (properties.length === 0) {
    throw new Error("No properties found");
  }
  return properties;
};

// Async thunk for getting user profiles
const getUserProfiles = async (landlordIds: string[], tenantIds: string[]) => {
  const [landlords, tenants] = await Promise.all([
    Promise.all(
      landlordIds.map(async (id) => {
        try {
          const profile = await Meteor.callAsync(MeteorMethodIdentifier.PROFILE_GET_BY_LANDLORD_ID, id);
          return { landlordId: id, profile };
        } catch (error) {
          return null;
        }
      })
    ),
    Promise.all(
      tenantIds.map(async (id) => {
        try {
          const profile = await Meteor.callAsync(MeteorMethodIdentifier.PROFILE_GET_BY_TENANT_ID, id);
          return { tenantId: id, profile };
        } catch (error) {
          return null;
        }
      })
    )
  ]);

  return {
    landlords: landlords.filter(Boolean),
    tenants: tenants.filter(Boolean)
  };
};

// Async thunk for building conversations
const buildConversationsList = (
  existingConversations: any[],
  landlords: any[],
  tenants: any[],
  userId: string
): Conversation[] => {
  const conversations: Conversation[] = [];

  // Add existing conversations
  for (const conv of existingConversations) {
    if (conv.landlordId) {
      const landlordData = landlords.find(l => l?.landlordId === conv.landlordId);
      if (landlordData?.profile) {
        conversations.push(createConversationFromExisting(conv, landlordData.profile, "Landlord", userId));
      }
    }
    
    if (conv.tenantId) {
      const tenantData = tenants.find(t => t?.tenantId === conv.tenantId);
      if (tenantData?.profile) {
        conversations.push(createConversationFromExisting(conv, tenantData.profile, "Tenant", userId));
      }
    }
  }

  // Add new conversations for users without existing conversations
  const existingLandlordIds = existingConversations.map((c: any) => c.landlordId).filter(Boolean);
  const existingTenantIds = existingConversations.map((c: any) => c.tenantId).filter(Boolean);

  // Add new landlord conversations
  for (const landlordData of landlords) {
    if (landlordData && !existingLandlordIds.includes(landlordData.landlordId)) {
      conversations.push(
        createConversationFromProfile(
          `new_landlord_${landlordData.landlordId}`,
          landlordData.profile,
          "Landlord",
          true
        )
      );
    }
  }

  // Add new tenant conversations
  for (const tenantData of tenants) {
    if (tenantData && !existingTenantIds.includes(tenantData.tenantId)) {
      conversations.push(
        createConversationFromProfile(
          `new_tenant_${tenantData.tenantId}`,
          tenantData.profile,
          "Tenant",
          true
        )
      );
    }
  }

  return conversations;
};

// Main async thunk - now much cleaner
export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (userId: string, { rejectWithValue }) => {
    try {
      // Step 1: Get agent data
      const agent = await getAgentData(userId);
      const agentId = agent.agentId;

      // Step 2: Get properties
      let properties;
      try {
        properties = await getPropertiesForAgent(agentId);
      } catch (error) {
        return [createErrorConversation("no_properties", "No properties", "You don't have any properties to manage yet", "NP")];
      }

      // Step 3: Extract unique user IDs
      const landlordIds = [...new Set(properties.map((p: any) => p.landlordId).filter(Boolean))];
      const tenantIds = [...new Set(properties.map((p: any) => p.tenantId).filter(Boolean))];

      if (landlordIds.length === 0 && tenantIds.length === 0) {
        return [createErrorConversation("no_contacts", "No contacts", "Your properties don't have landlords or tenants assigned", "NC")];
      }

      // Step 4: Get existing conversations and user profiles in parallel
      const [existingConversations, { landlords, tenants }] = await Promise.all([
        Meteor.callAsync(MeteorMethodIdentifier.CONVERSATIONS_GET_FOR_AGENT, agentId),
        getUserProfiles(landlordIds as string[], tenantIds as string[])
      ]);

      // Step 5: Build final conversations list
      const conversations = buildConversationsList(existingConversations, landlords, tenants, userId);

      console.log("🎉 Final conversations list:", conversations);
      return conversations;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return rejectWithValue("Failed to fetch conversations");
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call to fetch messages
      // For now, return hardcoded mock data to make UI work
      const mockMessages: Message[] = [
        { 
          id: "1", 
          text: "Hello, I need to report a leaking faucet in the kitchen.", 
          timestamp: "Yesterday, 9:15 AM", 
          isOutgoing: true, 
          isRead: true 
        },
        { 
          id: "2", 
          text: "Thank you for reporting this. When would be a good time for a maintenance visit?", 
          timestamp: "Yesterday, 9:45 AM", 
          isOutgoing: false, 
          isRead: false 
        },
        { 
          id: "3", 
          text: "I'm available tomorrow morning or afternoon.", 
          timestamp: "Yesterday, 10:15 AM", 
          isOutgoing: true, 
          isRead: true 
        },
        { 
          id: "4", 
          text: "Perfect! I'll schedule the maintenance visit for tomorrow at 10 AM.", 
          timestamp: "10:30 AM", 
          isOutgoing: false, 
          isRead: false 
        },
        { 
          id: "5", 
          text: "Great, thank you for the quick response!", 
          timestamp: "10:31 AM", 
          isOutgoing: true, 
          isRead: true 
        },
      ];

      return { conversationId, messages: mockMessages };
    } catch (error) {
      return rejectWithValue("Failed to fetch messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData: { conversationId: string; text: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call to send message
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageData.text,
        timestamp: new Date().toLocaleString(),
        isOutgoing: true,
        isRead: false,
      };

      return { conversationId: messageData.conversationId, message: newMessage };
    } catch (error) {
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
        state.messages.push(action.payload.message);
        state.messageText = "";
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

// Fixed role-based selector - now returns all conversations for agents
export const selectConversationsForRole = (role: string) => (state: RootState) => {
  const conversations = state.messages.conversations;
  
  // If no conversations are loaded, return some hardcoded ones for development/testing
  if (conversations.length === 0) {
    return [
      {
        id: "hardcoded_1",
        name: "John Smith",
        role: "Landlord",
        avatar: "JS",
        lastMessage: "Thanks for the quick response about the maintenance request.",
        timestamp: "2 hours ago",
        unreadCount: 1,
      },
      {
        id: "hardcoded_2",
        name: "Sarah Johnson",
        role: "Tenant",
        avatar: "SJ",
        lastMessage: "When can we schedule the property inspection?",
        timestamp: "Yesterday",
        unreadCount: 0,
      },
      {
        id: "hardcoded_3",
        name: "Mike Wilson",
        role: "Landlord",
        avatar: "MW",
        lastMessage: "The new tenant application looks good.",
        timestamp: "3 days ago",
        unreadCount: 2,
      },
    ];
  }
  
  // Return actual conversations if they exist
  return conversations;
};

export const selectMessagesForCurrentUser = (state: RootState) => {
  return state.messages.messages;
};

export default messagesSlice.reducer;
