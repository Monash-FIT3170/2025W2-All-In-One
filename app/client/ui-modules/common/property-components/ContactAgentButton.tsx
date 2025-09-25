import React from "react";
import {
  ThemedButton,
  ThemedButtonVariant,
} from "/app/client/ui-modules/theming/components/ThemedButton";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router";
import { NavigationPath } from "/app/client/navigation";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { fetchConversations } from "/app/client/ui-modules/role-messages/state/reducers/messages-slice";
import { apiGetConversationsForTenant, apiInsertConversation } from "/app/client/library-modules/apis/messaging/messaging-api";
import { Role } from "/app/shared/user-role-identifier";

export function ContactAgentButton({
  propertyId,
  agentId,
  className="",
}: {
  propertyId: string;
  agentId: string;
  className?: string;
}): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.currentUser.currentUser);
  const authUser = useAppSelector((state) => state.currentUser.authUser);

  const handleClick = async () => {
    if (!currentUser || !authUser || authUser.role !== Role.TENANT) {
      console.error("User not authenticated or not a tenant");
      return;
    }

    const tenantId = (currentUser as any).tenantId;

    try {
      // Get existing conversations for this tenant
      const existingConversations = await apiGetConversationsForTenant(tenantId);

      // Check if tenant already has a conversation with this agent
      const existingConversation = existingConversations.find(
        conv => conv.agentId === agentId
      );

      let conversationId: string;

      if (existingConversation) {
        // Use existing conversation
        conversationId = existingConversation.conversationId;
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

        try {
          conversationId = await apiInsertConversation(newConversationData);
        } catch (insertError) {
          console.error("Failed to create conversation:", insertError);
          throw insertError;
        }

        // Refresh conversations to include the new one
        await dispatch(fetchConversations()).unwrap();
      }

      // Navigate to messages page with conversationId in state
      navigate(NavigationPath.TenantMessages, {
        state: { conversationId, agentId, shouldAutoSelect: true }
      });
    } catch (error) {
      console.error("Error handling contact agent:", error);
      // Fallback to just navigating to messages
      navigate(NavigationPath.TenantMessages);
    }
  };
  return (
    <ThemedButton
      variant={ThemedButtonVariant.SECONDARY}
      onClick={handleClick}
      className={twMerge("w-[128px]", className)}
    >
      <span className="text-[14px]">Contact Agent</span>
    </ThemedButton>
  );
}
