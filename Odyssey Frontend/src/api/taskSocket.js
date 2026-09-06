/**
 * MRPL Sovereign AI Workbench - WebSocket Client for Real-Time Task Execution Streaming
 * 
 * Manages WebSocket subscriptions to /api/tasks/{task_id}/stream.
 * Emits live event updates to subscribers and handles disconnect callbacks.
 */

import { getToken } from './client';

const WS_BASE_URL = 'ws://localhost:8000';

/**
 * Subscribe to live task execution updates via WebSocket.
 * 
 * @param {string} taskId - The ID of the active task
 * @param {function} onEvent - Callback for received task events
 * @param {function} onError - Callback for socket errors
 * @param {function} onClose - Callback for socket disconnect
 * @returns {function} Unsubscribe function to close socket connection
 */
export function subscribeToTask(taskId, onEvent, onError, onClose) {
  if (!taskId) {
    console.error('Cannot subscribe to WebSocket without a valid taskId');
    return () => {};
  }

  const token = getToken();
  const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';
  const wsUrl = `${WS_BASE_URL}/api/tasks/${taskId}/stream${tokenQuery}`;
  let socket = null;
  let isClosedIntentionally = false;

  try {
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log(`[TaskSocket] Connected to stream for task: ${taskId}`);
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (onEvent) {
          onEvent(payload);
        }
      } catch (err) {
        console.error('[TaskSocket] Error parsing event message:', err, event.data);
      }
    };

    socket.onerror = (err) => {
      console.warn(`[TaskSocket] Error on stream for task ${taskId}:`, err);
      if (onError) {
        onError(err);
      }
    };

    socket.onclose = (event) => {
      console.log(`[TaskSocket] Stream closed for task ${taskId}. Code: ${event.code}`);
      if (onClose) {
        onClose(isClosedIntentionally);
      }
    };

  } catch (err) {
    console.error('[TaskSocket] Failed to create WebSocket connection:', err);
    if (onError) onError(err);
  }

  // Return Unsubscribe function
  return () => {
    isClosedIntentionally = true;
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      socket.close();
      console.log(`[TaskSocket] Intentionally closed stream for task: ${taskId}`);
    }
  };
}
