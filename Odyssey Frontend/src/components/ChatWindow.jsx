import React, { useState, useRef, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { MessageBubble } from './MessageBubble';
import { TaskTracePanel } from './TaskTracePanel';
import { apiCreateTask, apiGetTask } from '../api/client';
import { subscribeToTask } from '../api/taskSocket';
import { mockSimpleFlow, mockComplexFlow, mockFailedFlow } from '../mock/mockTask';

/**
 * ChatWindow Component
 * Main interaction surface supporting real backend task lifecycle streaming,
 * automatic WebSocket + polling fallback, Phase 5 mock flows, and Phase 11 active session binding.
 */
export function ChatWindow({
  activeSession = null,
  onUpdateSessionMessages,
  onAutoRenameSession,
  onCreateSession,
}) {
  const [messages, setMessages] = useState(() => activeSession?.messages || []);
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTaskState, setActiveTaskState] = useState(null);
  const [useMockMode, setUseMockMode] = useState(true); // Default to mock mode for testing; toggleable to Real Backend Mode

  const messagesEndRef = useRef(null);
  const activeUnsubscribeRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const activeTaskIdRef = useRef(null);

  // Scroll helper
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTaskState]);

  // Synchronize messages state whenever activeSession changes
  useEffect(() => {
    stopActiveSubscriptions();
    setActiveTaskState(null);
    setIsExecuting(false);
    setMessages(activeSession?.messages || []);
  }, [activeSession?.session_id]);

  // Comprehensive Cleanup on Unmount
  useEffect(() => {
    return () => {
      stopActiveSubscriptions();
    };
  }, []);

  const stopActiveSubscriptions = () => {
    if (activeUnsubscribeRef.current) {
      activeUnsubscribeRef.current();
      activeUnsubscribeRef.current = null;
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    activeTaskIdRef.current = null;
  };

  // Helper to complete task & append final assistant message to ACTIVE session
  const finalizeTaskExecution = (finalData) => {
    stopActiveSubscriptions();

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isError = finalData.status === 'FAILED' || Boolean(finalData.error);

    const aiMessage = {
      id: `msg-ai-${Date.now()}`,
      sender: 'assistant',
      content: finalData.answer || null,
      timestamp,
      taskState: {
        task_id: finalData.task_id || activeTaskIdRef.current || 'task-real',
        status: isError ? 'FAILED' : 'COMPLETED',
        answer: finalData.answer || null,
        task_type: finalData.task_type || 'DOCUMENT',
        agent: finalData.agent || finalData.current_agent || 'reasoning_agent',
        model: finalData.model || 'reasoning_model',
        plan: finalData.plan || null,
        tool_calls: finalData.tool_calls || finalData.toolCalls || [],
        sources: finalData.sources || [],
        artifacts: finalData.artifacts || [],
        verification: finalData.verification || null,
        error: finalData.error || (isError ? 'Task execution failed' : null),
        errors: finalData.errors || (finalData.error ? [finalData.error] : []),
      },
    };

    setMessages((prev) => {
      const updated = [...prev, aiMessage];
      if (activeSession?.session_id && onUpdateSessionMessages) {
        onUpdateSessionMessages(activeSession.session_id, updated);
      }
      return updated;
    });

    setActiveTaskState(null);
    setIsExecuting(false);
  };

  // Start Polling Fallback (Approx every 2000ms)
  const startPollingFallback = (taskId) => {
    if (pollIntervalRef.current) return;

    console.log(`[ChatWindow] Starting polling fallback for task: ${taskId}`);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const task = await apiGetTask(taskId);
        if (!task) return;

        setActiveTaskState((prev) => ({
          ...(prev || {}),
          status: task.status || prev?.status,
          plan: task.plan || prev?.plan,
          currentStep: task.currentStep || task.current_step || prev?.currentStep,
          currentAgent: task.current_agent || task.agent || prev?.currentAgent,
          toolCalls: task.tool_calls || task.toolCalls || prev?.toolCalls || [],
        }));

        if (task.status === 'COMPLETED' || task.status === 'FAILED') {
          finalizeTaskExecution({
            task_id: taskId,
            status: task.status,
            answer: task.answer,
            plan: task.plan,
            tool_calls: task.tool_calls || task.toolCalls,
            sources: task.sources,
            artifacts: task.artifacts,
            verification: task.verification,
            error: task.error,
          });
        }
      } catch (err) {
        console.warn(`[ChatWindow] Polling error for task ${taskId}:`, err);
      }
    }, 2000);
  };

  // Main Submit Handler
  const handleSend = async (e) => {
    if (e) e.preventDefault();

    const trimmed = inputText.trim();
    if (!trimmed && attachedFiles.length === 0) return;
    if (isExecuting) return;

    stopActiveSubscriptions();

    const userPrompt = trimmed || (attachedFiles.length > 0 ? `Uploaded ${attachedFiles.length} file(s)` : '');
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files: attachedFiles.map((f) => ({ id: f.id, name: f.name, size: f.size })),
    };

    // Auto-rename session if it has default title
    if (
      activeSession &&
      (activeSession.title === 'New Conversation' || activeSession.title === 'New Chat') &&
      onAutoRenameSession
    ) {
      const autoTitle = userPrompt.length > 28 ? `${userPrompt.slice(0, 28)}...` : userPrompt;
      onAutoRenameSession(activeSession.session_id, autoTitle);
    }

    // Append user message & update persistent session store
    const updatedUserMessages = [...messages, userMsg];
    setMessages(updatedUserMessages);
    if (activeSession?.session_id && onUpdateSessionMessages) {
      onUpdateSessionMessages(activeSession.session_id, updatedUserMessages);
    }

    setInputText('');
    setAttachedFiles([]);
    setIsExecuting(true);

    // Initial Active Task State
    setActiveTaskState({
      status: 'PLANNING',
      plan: null,
      currentStep: null,
      currentAgent: null,
      toolCalls: [],
    });

    // --- OPTION A: MOCK FLOW TESTING MODE ---
    if (useMockMode) {
      const lower = userPrompt.toLowerCase();
      let flowRunner = mockComplexFlow;

      if (lower.includes('fail')) {
        flowRunner = mockFailedFlow;
      } else if (lower.includes('what is')) {
        flowRunner = mockSimpleFlow;
      }

      const cancelMock = flowRunner((evt) => {
        if (!evt) return;

        if (evt.event === 'status_change') {
          setActiveTaskState((prev) => ({
            ...(prev || {}),
            status: evt.status || prev?.status,
            currentAgent: evt.current_agent || prev?.currentAgent,
          }));
        } else if (evt.event === 'tool_call') {
          setActiveTaskState((prev) => {
            const existingTools = prev?.toolCalls || [];
            const newTool = {
              id: `tc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              tool: evt.tool,
              summary: evt.summary,
              status: evt.success ? 'success' : 'failed',
              error: evt.error || null,
            };
            return {
              ...(prev || {}),
              toolCalls: [...existingTools, newTool],
            };
          });
        } else if (evt.event === 'final') {
          finalizeTaskExecution(evt);
        }
      });

      activeUnsubscribeRef.current = cancelMock;
      return;
    }

    // --- OPTION B: REAL BACKEND TASK LIFECYCLE ---
    try {
      // Create Real Task with activeSession.session_id
      const taskRes = await apiCreateTask(
        userPrompt,
        attachedFiles.map((f) => f.name),
        activeSession?.session_id || null
      );

      const realTaskId = taskRes.task_id || taskRes.taskId;
      if (!realTaskId) {
        throw new Error('Backend failed to return a valid task_id.');
      }

      activeTaskIdRef.current = realTaskId;
      setActiveTaskState({
        taskId: realTaskId,
        status: 'CREATED',
        plan: null,
        currentStep: null,
        currentAgent: null,
        toolCalls: [],
      });

      // Subscribe to WebSocket Stream
      const unsubscribe = subscribeToTask(
        realTaskId,
        (evt) => {
          if (!evt) return;

          if (evt.event === 'status_change' || evt.status) {
            setActiveTaskState((prev) => ({
              ...(prev || {}),
              status: evt.status || prev?.status,
              currentAgent: evt.current_agent || prev?.currentAgent,
              plan: evt.plan || prev?.plan,
              currentStep: evt.current_step || evt.currentStep || prev?.currentStep,
            }));
          }

          if (evt.event === 'tool_call' || evt.tool) {
            setActiveTaskState((prev) => {
              const existingTools = prev?.toolCalls || [];
              const newTool = {
                id: evt.id || `tc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                tool: evt.tool,
                summary: evt.summary,
                status: evt.success !== false ? 'success' : 'failed',
                error: evt.error || null,
              };
              return {
                ...(prev || {}),
                toolCalls: [...existingTools, newTool],
              };
            });
          }

          if (evt.event === 'final' || evt.status === 'COMPLETED' || evt.status === 'FAILED') {
            finalizeTaskExecution(evt);
          }
        },
        (err) => {
          console.warn('[ChatWindow] WebSocket error encountered. Initiating polling fallback.', err);
          startPollingFallback(realTaskId);
        },
        (isClosedIntentionally) => {
          if (!isClosedIntentionally) {
            console.warn('[ChatWindow] WebSocket connection closed unexpectedly. Initiating polling fallback.');
            startPollingFallback(realTaskId);
          }
        }
      );

      activeUnsubscribeRef.current = unsubscribe;

    } catch (err) {
      console.error('[ChatWindow] Real task execution error:', err);
      finalizeTaskExecution({
        status: 'FAILED',
        error: err.message || 'Real backend task creation failed.',
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isSendDisabled = isExecuting || (!inputText.trim() && attachedFiles.length === 0);

  // Render Empty State if no active session is selected
  if (!activeSession) {
    return (
      <div
        className="chat-window-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          backgroundColor: 'var(--mrpl-bg-light)',
          border: '1px solid var(--mrpl-border)',
          borderRadius: '6px',
          padding: '32px',
          textAlign: 'center',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '32px' }}>💬</div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--mrpl-primary)', margin: 0 }}>
          No Active Conversation
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--mrpl-text-secondary)', maxWidth: '380px', margin: 0 }}>
          Select an existing session from the left sidebar or start a new chat session to initiate an industrial AI workflow.
        </p>
        {onCreateSession && (
          <button
            onClick={onCreateSession}
            className="btn-primary"
            style={{ marginTop: '8px', fontSize: '13px' }}
          >
            ➕ Start a new chat
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="chat-window-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100vh',
        backgroundColor: 'var(--mrpl-bg-light)',
        border: '1px solid var(--mrpl-border)',
        borderRadius: '6px',
        overflow: 'hidden',
      }}
    >
      {/* 1. Header Bar */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--mrpl-bg-main)',
          borderBottom: '1px solid var(--mrpl-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2
            title={activeSession.title}
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--mrpl-primary)',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '300px',
            }}
          >
            {activeSession.title}
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)' }}>
            Sovereign Industrial AI Agent Environment
          </span>
        </div>

        {/* Testing Mode Switch (Mock vs Real Backend) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--mrpl-text-secondary)', fontWeight: 500 }}>
            Mode:
          </span>
          <button
            onClick={() => setUseMockMode(!useMockMode)}
            className="btn-secondary"
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              backgroundColor: useMockMode ? 'var(--mrpl-bg-green-light)' : 'var(--mrpl-bg-main)',
              color: useMockMode ? 'var(--mrpl-primary)' : 'var(--mrpl-text-primary)',
              fontWeight: 600,
            }}
          >
            {useMockMode ? '🧪 Mock Mode (Phase 5)' : '⚡ Real Backend (Phase 8)'}
          </button>
        </div>
      </div>

      {/* 2. Messages History & Live Active Trace */}
      <div
        className="chat-messages-area"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Live Active TaskTracePanel (Shown only while task is running) */}
        {activeTaskState && (
          <div style={{ marginTop: '12px', marginBottom: '12px', maxWidth: '90%' }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--mrpl-primary)',
                marginBottom: '4px',
              }}
            >
              🤖 Assistant ({activeTaskState.taskId ? `Task #${activeTaskState.taskId}` : 'Task in progress...'})
            </div>
            <TaskTracePanel
              status={activeTaskState.status}
              plan={activeTaskState.plan}
              currentStep={activeTaskState.currentStep}
              currentAgent={activeTaskState.currentAgent}
              toolCalls={activeTaskState.toolCalls}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Composer Controls */}
      <div
        className="chat-composer-area"
        style={{
          padding: '12px 16px',
          backgroundColor: 'var(--mrpl-bg-main)',
          borderTop: '1px solid var(--mrpl-border)',
        }}
      >
        <FileUpload
          files={attachedFiles}
          onFilesChange={setAttachedFiles}
          disabled={isExecuting}
        />

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              useMockMode
                ? "Mock Mode: Type prompt ('what is', 'fail', or normal)..."
                : "Real Mode: Submit industrial task to backend..."
            }
            disabled={isExecuting}
            rows={2}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid var(--mrpl-border)',
              resize: 'none',
              outline: 'none',
              backgroundColor: isExecuting ? 'var(--mrpl-bg-light)' : '#ffffff',
            }}
          />
          <button
            type="submit"
            disabled={isSendDisabled}
            className="btn-primary"
            style={{
              padding: '0 20px',
              height: 'auto',
              alignSelf: 'stretch',
              cursor: isSendDisabled ? 'not-allowed' : 'pointer',
              opacity: isSendDisabled ? 0.6 : 1,
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
