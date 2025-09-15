/**
 * Utility functions for formatting timestamps in messaging
 */

/**
 * Formats a timestamp according to messaging requirements:
 * - Today: Show only time (e.g., "10:30 AM")
 * - Yesterday: Show "Yesterday" and time (e.g., "Yesterday 10:30 AM")
 * - Older: Show only date (e.g., "Mar 25")
 */
export function formatMessageTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  if (isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Check if it's today
  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Check if it's yesterday
  if (messageDate.getTime() === yesterday.getTime()) {
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `Yesterday ${time}`;
  }

  // For older messages, show only date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats a timestamp for the conversation list (last message time)
 */
export function formatConversationTimestamp(timestamp: Date | string): string {
  return formatMessageTimestamp(timestamp);
}

/**
 * Formats a timestamp for individual messages in the chat window
 */
export function formatChatMessageTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  if (isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // For messages in chat window, always show time for today and yesterday
  if (messageDate.getTime() >= today.getTime() - 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // For older messages in chat, show date and time
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
