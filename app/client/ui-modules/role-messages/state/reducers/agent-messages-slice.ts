import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";
import { AgentMessagesState } from "../AgentMessagesPageUIState";
import { Conversation, Message } from "../../types";

const initialState: AgentMessagesState = {
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
export const fetchAgentConversations = createAsyncThunk(
  "agentMessages/fetchConversations",
  async (agentId: string, { rejectWithValue }) => {
    try {
      // TODO: REPLACE WITH ACTUAL API CALL TO GET CONVOS
      // For now, return mock data
      const mockConversations: Conversation[] = [
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
      ];

      return mockConversations;
    } catch (error) {
      return rejectWithValue("Failed to fetch conversations");
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  "agentMessages/fetchMessages",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      // TODO: REPLACE WITH ACTUAL API CALL TO GET MESSAGES 
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
  "agentMessages/sendMessage",
  async (messageData: { conversationId: string; text: string }, { rejectWithValue }) => {
    try {
      // TODO: REPLACE WITH ACTUAL API CALL TO SEND MESSAGES
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

export const agentMessagesSlice = createSlice({
  name: "agentMessages",
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
      .addCase(fetchAgentConversations.pending, (state) => {
        state.conversationsLoading = true;
        state.error = null;
      })
      .addCase(fetchAgentConversations.fulfilled, (state, action) => {
        state.conversationsLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchAgentConversations.rejected, (state, action) => {
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
} = agentMessagesSlice.actions;

// Export selectors
export const selectAgentMessages = (state: RootState) => state.agentMessages;
export const selectConversations = (state: RootState) => state.agentMessages.conversations;
export const selectActiveConversationId = (state: RootState) => state.agentMessages.activeConversationId;
export const selectMessages = (state: RootState) => state.agentMessages.messages;
export const selectMessageText = (state: RootState) => state.agentMessages.messageText;
export const selectIsLoading = (state: RootState) => state.agentMessages.isLoading;
export const selectConversationsLoading = (state: RootState) => state.agentMessages.conversationsLoading;
export const selectMessagesLoading = (state: RootState) => state.agentMessages.messagesLoading;
export const selectError = (state: RootState) => state.agentMessages.error;

export default agentMessagesSlice.reducer; 