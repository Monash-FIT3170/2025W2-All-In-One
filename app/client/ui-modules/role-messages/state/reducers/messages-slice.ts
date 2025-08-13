import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { MessagesState } from "../MessagesPageUIState";
import { Conversation, Message } from "../../types";

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
  async (userId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call to fetch conversations
      // For now, return mock data for all roles
      const mockConversations: Conversation[] = [
        // Agent conversations
        {
          id: "1",
          name: "John Smith",
          role: "Property Manager",
          avatar: "JS",
          lastMessage: "I'll schedule the maintenance visit",
          timestamp: "10:30 AM",
          unreadCount: 2,
        },
        {
          id: "2",
          name: "Sarah Johnson",
          role: "Leasing Agent",
          avatar: "SJ",
          lastMessage: "Your lease renewal documents are",
          timestamp: "Yesterday",
          unreadCount: 1,
        },
        {
          id: "3",
          name: "Michael Chen",
          role: "Maintenance Supervisor",
          avatar: "MC",
          lastMessage: "The repair has been completed. Please",
          timestamp: "Mar 25",
          unreadCount: 0,
        },
        // Landlord conversations
        {
          id: "4",
          name: "Alex Carter",
          role: "Agent",
          avatar: "AC",
          lastMessage: "Tenant application received",
          timestamp: "09:20 AM",
          unreadCount: 0,
        },
        {
          id: "5",
          name: "Priya Singh",
          role: "Tenant",
          avatar: "PS",
          lastMessage: "Rent paid for April",
          timestamp: "Yesterday",
          unreadCount: 0,
        },
        {
          id: "6",
          name: "David Wilson",
          role: "Maintenance",
          avatar: "DW",
          lastMessage: "Inspection scheduled Fri 2 PM",
          timestamp: "Mar 24",
          unreadCount: 1,
        },
        // Tenant conversations
        {
          id: "7",
          name: "Emma Thompson",
          role: "Property Manager",
          avatar: "ET",
          lastMessage: "Your maintenance request has been approved",
          timestamp: "Mar 23",
          unreadCount: 0,
        },
        {
          id: "8",
          name: "James Brown",
          role: "Maintenance",
          avatar: "JB",
          lastMessage: "We'll fix the leak tomorrow",
          timestamp: "Mar 22",
          unreadCount: 0,
        },
      ];

      return mockConversations;
    } catch (error) {
      return rejectWithValue("Failed to fetch conversations");
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call to fetch messages
      // For now, return mock data
      const mockMessages: Message[] = [
        { id: "1", text: "Hello, I need to report a leaking faucet in the kitchen.", timestamp: "Yesterday, 9:15 AM", isOutgoing: true, isRead: true },
        { id: "2", text: "Thank you for reporting this. When would be a good time for a maintenance visit?", timestamp: "Yesterday, 9:45 AM", isOutgoing: false, isRead: false },
        { id: "3", text: "I'm available tomorrow morning or afternoon.", timestamp: "Yesterday, 10:15 AM", isOutgoing: true, isRead: true },
        { id: "4", text: "Please let me know if that works for you.", timestamp: "10:31 AM", isOutgoing: false, isRead: false },
        { id: "5", text: "I'll schedule the maintenance visit for tomorrow at 10 AM.", timestamp: "10:30 AM", isOutgoing: false, isRead: false },
        { id: "6", text: "I'll schedule the maintenance visit.", timestamp: "10:30 AM", isOutgoing: false, isRead: false },
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

// Role-based selectors using currentUser role
export const selectConversationsForRole = (role: string) => (state: RootState) => {
  const currentRole = state.currentUser.authUser?.role;
  if (!currentRole) return [];
  
  // Filter conversations based on role
  // This logic can be customized based on your business rules
  return state.messages.conversations.filter((c: Conversation) => {
    // For now, simple role matching - can be enhanced later
    if (role === 'agent') {
      return c.role === 'Property Manager' || c.role === 'Leasing Agent' || c.role === 'Maintenance Supervisor';
    } else if (role === 'landlord') {
      return c.role === 'Agent' || c.role === 'Tenant' || c.role === 'Maintenance';
    } else if (role === 'tenant') {
      return c.role === 'Property Manager' || c.role === 'Maintenance';
    }
    return false;
  });
};

export const selectMessagesForCurrentUser = (state: RootState) => {
  return state.messages.messages;
};

export default messagesSlice.reducer; 