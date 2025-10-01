import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { useLocation } from "react-router";
import { selectConversation, fetchConversations } from "../state/reducers/messages-slice";
import { apiGetConversationsForTenant, apiInsertConversation } from "/app/client/library-modules/apis/messaging/messaging-api";
import { Role } from "/app/shared/user-role-identifier";

type UserRole = 'agent' | 'landlord' | 'tenant';

interface UseContactAgentHandlerProps {
  role: UserRole;
}

/**
 * Hook to handle contact agent functionality - creates/selects conversations when navigating from ContactAgentButton
 * This is used when tenants want to contact agents about properties
 */
export function useContactAgentHandler({ role }: UseContactAgentHandlerProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Selectors
  const activeConversationId = useAppSelector((state) => state.messages.activeConversationId);
  const authUser = useAppSelector((state) => state.currentUser.authUser);
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);

  useEffect(() => {
    const state = location.state as { agentId?: string; propertyId?: string } | null;

    if (role === 'tenant' && state?.agentId && state?.propertyId && currentUser && authUser?.role === Role.TENANT) {
      const tenantId = (currentUser as any).tenantId;
      const { agentId, propertyId } = state;

      const handleConversation = async () => {
        try {
          // Get existing conversations for this tenant
          const existingApiConversations = await apiGetConversationsForTenant(tenantId);

          // Check if tenant already has a conversation with this agent
          const existingApiConversation = existingApiConversations.find(conv => conv.agentId === agentId);

          if (existingApiConversation) {
            // Select existing conversation
            if (activeConversationId !== existingApiConversation.conversationId) {
              dispatch(selectConversation(existingApiConversation.conversationId));
            }
          } else {
            // Create new conversation
            const newConversationData = {
              agentId: agentId,
              tenantId: tenantId,
              propertyId: propertyId,
              unreadCounts: {
                [agentId]: 0,
                [tenantId]: 0
              }
            };

            const conversationId = await apiInsertConversation(newConversationData);

            // Refresh conversations to include the new one
            await dispatch(fetchConversations()).unwrap();

            // Select the new conversation
            dispatch(selectConversation(conversationId));
          }
        } catch (error) {
          console.error("Error handling conversation from navigation:", error);
        }
      };

      handleConversation();
    }
  }, [location.state, role, currentUser, authUser, activeConversationId, dispatch]);
}
