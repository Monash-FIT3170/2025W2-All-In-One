import { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { ConversationCollection, MessageCollection } from '../collections/messaging-collections';
import { useAppDispatch } from '/app/client/store';
import { 
  setConversationsFromSubscription, 
  setMessagesFromSubscription,
  addMessage,
  updateConversationLastMessage 
} from '../state/reducers/messages-slice';

// Hook for managing messaging subscriptions and real-time updates
export function useMessagingSubscriptions(activeConversationId: string | null) {
  const dispatch = useAppDispatch();

  // Subscribe to conversations
  const conversationsReady = useTracker(() => {
    const handle = Meteor.subscribe('conversations');
    return handle.ready();
  }, []);

  // Subscribe to messages for active conversation
  const messagesReady = useTracker(() => {
    if (!activeConversationId) return true;
    const handle = Meteor.subscribe('messages', activeConversationId);
    return handle.ready();
  }, [activeConversationId]);

  // Get conversations from local collection (reactive)
  const conversations = useTracker(() => {
    if (!conversationsReady) return [];
    return ConversationCollection.find({}).fetch();
  }, [conversationsReady]);

  // Get messages from local collection (reactive)
  const messages = useTracker(() => {
    if (!activeConversationId || !messagesReady) return [];
    return MessageCollection.find(
      { conversationId: activeConversationId },
      { sort: { timestamp: 1 } }
    ).fetch();
  }, [activeConversationId, messagesReady]);

  // Update Redux store when conversations change
  useEffect(() => {
    if (conversationsReady && conversations.length > 0) {
      dispatch(setConversationsFromSubscription(conversations));
    }
  }, [conversations, conversationsReady, dispatch]);

  // Update Redux store when messages change
  useEffect(() => {
    if (messagesReady && activeConversationId) {
      dispatch(setMessagesFromSubscription({ conversationId: activeConversationId, messages }));
    }
  }, [messages, messagesReady, activeConversationId, dispatch]);

  return {
    conversationsReady,
    messagesReady,
    conversations,
    messages
  };
}
