/**
 * Notification Bell Redux Slice
 *
 * This slice manages the notification bell state independently from messaging,
 * providing real-time updates for tasks and unread message counts.
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { Task } from "/app/client/library-modules/domain-models/task/Task";
import { Conversation } from "/app/client/library-modules/domain-models/messaging/Conversation";
import { Role } from "/app/shared/user-role-identifier";
import { TaskStatus } from "/app/shared/task-status-identifier";
import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";

interface NotificationState {
  isLoading: boolean;
  tasks: Task[];
  conversations: Conversation[];
  unreadMessageCount: number;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: NotificationState = {
  isLoading: false,
  tasks: [],
  conversations: [],
  unreadMessageCount: 0,
  error: null,
  lastUpdated: null,
};

/**
 * Fetches tasks for the current user based on their role
 */
export const fetchNotificationTasks = createAsyncThunk(
  "notifications/fetchTasks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { currentUser: { currentUser: Agent | Tenant | Landlord | null; authUser: { role: Role } | null } };
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      if (!currentUser || !authUser) {
        return rejectWithValue("User not authenticated");
      }

      // Fetch tasks using existing dashboard task fetching logic
      let tasks: Task[] = [];

      if (authUser.role === Role.AGENT && 'agentId' in currentUser) {
        try {
          // Use the same approach as the agent dashboard but call it properly
          const { getAgentById } = await import("/app/client/library-modules/domain-models/user/role-repositories/agent-repository");

          // Try fetching by userAccountId first, then by agentId if that fails
          let agentData;
          try {
            agentData = await getAgentById(currentUser.userAccountId);
          } catch (error) {
            agentData = await getAgentById(currentUser.agentId);
          }

          if (agentData.tasks && agentData.tasks.length > 0) {
            const { getTaskById } = await import("/app/client/library-modules/domain-models/task/repositories/task-repository");
            const taskPromises = agentData.tasks.slice(0, 5).map((taskId: string) => getTaskById(taskId));
            const taskResults = await Promise.all(taskPromises);
            tasks = taskResults.filter(task => task && task.status !== TaskStatus.COMPLETED);
          }
        } catch (error) {
          tasks = [];
        }
      } else if (authUser.role === Role.TENANT && 'tenantId' in currentUser) {
        try {
          const { getTenantById } = await import("/app/client/library-modules/domain-models/user/role-repositories/tenant-repository");

          // Try fetching by userAccountId first, then by tenantId if that fails
          let tenantData;
          try {
            tenantData = await getTenantById(currentUser.userAccountId);
          } catch (error) {
            tenantData = await getTenantById(currentUser.tenantId);
          }
          if (tenantData.tasks && tenantData.tasks.length > 0) {
            const { getTaskById } = await import("/app/client/library-modules/domain-models/task/repositories/task-repository");
            const taskPromises = tenantData.tasks.slice(0, 5).map((taskId: string) => getTaskById(taskId));
            const taskResults = await Promise.all(taskPromises);
            tasks = taskResults.filter(task => task && task.status !== TaskStatus.COMPLETED);
          }
        } catch (error) {
          tasks = [];
        }
      } else if (authUser.role === Role.LANDLORD && 'landlordId' in currentUser) {
        try {
          const { getLandlordById } = await import("/app/client/library-modules/domain-models/user/role-repositories/landlord-repository");

          // Try fetching by userAccountId first, then by landlordId if that fails
          let landlordData;
          try {
            landlordData = await getLandlordById(currentUser.userAccountId);
          } catch (error) {
            landlordData = await getLandlordById(currentUser.landlordId);
          }
          if (landlordData.tasks && landlordData.tasks.length > 0) {
            const { getTaskById } = await import("/app/client/library-modules/domain-models/task/repositories/task-repository");
            const taskPromises = landlordData.tasks.slice(0, 5).map((taskId: string) => getTaskById(taskId));
            const taskResults = await Promise.all(taskPromises);
            tasks = taskResults.filter(task => task && task.status !== TaskStatus.COMPLETED);
          }
        } catch (error) {
          tasks = [];
        }
      }

      return tasks;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch tasks");
    }
  }
);

/**
 * Updates conversations and calculates unread count for notifications
 */
export const updateNotificationConversations = createAsyncThunk(
  "notifications/updateConversations",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { currentUser: { currentUser: Agent | Tenant | Landlord | null; authUser: { role: Role } | null } };
      const currentUser = state.currentUser.currentUser;
      const authUser = state.currentUser.authUser;

      if (!currentUser || !authUser) {
        return rejectWithValue("User not authenticated");
      }

      // Import messaging repository functions dynamically
      const {
        getConversationsForAgent,
        getConversationsForTenant,
        getConversationsForLandlord,
        convertApiConversationsToAgentView,
        convertApiConversationsToTenantView,
        convertApiConversationsToLandlordView
      } = await import("/app/client/library-modules/domain-models/messaging/messaging-repository");

      let conversations: Conversation[] = [];
      let apiConversations: any[] = [];

      if (authUser.role === Role.AGENT && 'agentId' in currentUser) {
        apiConversations = await getConversationsForAgent(currentUser.agentId);
        conversations = convertApiConversationsToAgentView(apiConversations, currentUser.agentId, new Map(), new Map());
      } else if (authUser.role === Role.TENANT && 'tenantId' in currentUser) {
        apiConversations = await getConversationsForTenant(currentUser.tenantId);
        conversations = convertApiConversationsToTenantView(apiConversations, currentUser.tenantId);
      } else if (authUser.role === Role.LANDLORD && 'landlordId' in currentUser) {
        apiConversations = await getConversationsForLandlord(currentUser.landlordId);
        conversations = convertApiConversationsToLandlordView(apiConversations, currentUser.landlordId);
      }

      // Calculate total unread count
      const unreadMessageCount = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

      return { conversations, unreadMessageCount };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update conversations");
    }
  }
);

/**
 * Redux Slice Definition
 */
export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    /**
     * Updates the unread message count
     */
    setUnreadMessageCount(state, action: PayloadAction<number>) {
      state.unreadMessageCount = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Updates conversations for notifications
     */
    setNotificationConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
      // Recalculate unread count when conversations are updated
      state.unreadMessageCount = action.payload.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Updates tasks for notifications
     */
    setNotificationTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    /**
     * Clears any error messages
     */
    clearNotificationError(state) {
      state.error = null;
    },

    /**
     * Manually trigger a refresh of notification data
     */
    refreshNotifications(state) {
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchNotificationTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchNotificationTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update conversations
    builder
      .addCase(updateNotificationConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNotificationConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload.conversations;
        state.unreadMessageCount = action.payload.unreadMessageCount;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateNotificationConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

/**
 * Action Exports
 */
export const {
  setUnreadMessageCount,
  setNotificationConversations,
  setNotificationTasks,
  clearNotificationError,
  refreshNotifications,
} = notificationSlice.actions;

/**
 * Selector Functions
 */
export const selectNotificationTasks = (state: RootState) => state.notifications.tasks;
export const selectNotificationConversations = (state: RootState) => state.notifications.conversations;
export const selectUnreadMessageCount = (state: RootState) => state.notifications.unreadMessageCount;
export const selectNotificationLoading = (state: RootState) => state.notifications.isLoading;
export const selectNotificationError = (state: RootState) => state.notifications.error;
export const selectNotificationLastUpdated = (state: RootState) => state.notifications.lastUpdated;

export default notificationSlice.reducer;
