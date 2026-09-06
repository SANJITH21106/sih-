/**
 * MRPL Sovereign AI Workbench - Mock Task Flow Engine
 * 
 * Strict implementation of Phase 2 Mock Task Specification.
 * Provides mock task event stream generators for simple, complex, and failed task flows.
 */

/**
 * 1. mockSimpleFlow
 * Fires directly to exactly ONE `final` event.
 */
export function mockSimpleFlow(onEvent) {
  const finalEvent = {
    event: "final",
    task_id: "mock-simple",
    status: "COMPLETED",
    answer: "(mock) Simple response.",
    task_type: "SIMPLE",
    agent: "normal_llm",
    model: "general_model",
    plan: null,
    tool_calls: [],
    sources: [],
    artifacts: [],
    verification: null,
    errors: [],
    error: null
  };

  if (onEvent) {
    onEvent(finalEvent);
  }

  return () => {};
}

/**
 * 2. mockComplexFlow
 * Fires exact 8-event staggered sequence (~700ms interval):
 * 1. status_change -> PLANNING
 * 2. status_change -> RUNNING (reasoning_agent)
 * 3. tool_call -> ocr (success: true)
 * 4. tool_call -> knowledge (success: true)
 * 5. tool_call -> python_execution (success: true)
 * 6. tool_call -> file_write (success: true)
 * 7. status_change -> VERIFYING
 * 8. final -> COMPLETED with exact mock payload
 */
export function mockComplexFlow(onEvent) {
  const events = [
    {
      event: "status_change",
      status: "PLANNING"
    },
    {
      event: "status_change",
      status: "RUNNING",
      current_agent: "reasoning_agent"
    },
    {
      event: "tool_call",
      tool: "ocr",
      success: true,
      summary: "Extracted text from 3 pages."
    },
    {
      event: "tool_call",
      tool: "knowledge",
      success: true,
      summary: "Retrieved SOP section 4.2."
    },
    {
      event: "tool_call",
      tool: "python_execution",
      success: true,
      summary: "Computed deviation: 4.2%."
    },
    {
      event: "tool_call",
      tool: "file_write",
      success: true,
      summary: "Generated approval_note.docx."
    },
    {
      event: "status_change",
      status: "VERIFYING"
    },
    {
      event: "final",
      task_id: "mock",
      status: "COMPLETED",
      answer: "(mock) Deviation is 4.2%, exceeding the 3% tolerance.",
      task_type: "DOCUMENT",
      agent: "reasoning_agent",
      model: "reasoning_model",

      plan: [
        "Read input file",
        "OCR required pages",
        "Search knowledge base",
        "Calculate deviation",
        "Write DOCX"
      ],

      tool_calls: [],

      sources: [
        {
          document_name: "Mock_SOP.pdf",
          page: 1,
          section: "1.1",
          retrieved_text: "Mock text.",
          relevance_score: 0.8
        }
      ],

      artifacts: [
        {
          artifact_id: "mock_art_1",
          file_name: "approval_note.docx",
          file_type: "docx",
          download_url: "/api/artifacts/mock_art_1"
        }
      ],

      verification: {
        verified: true,
        notes: "Mock check."
      },

      errors: [],
      error: null
    }
  ];

  return runStaggeredSequence(events, onEvent, 700);
}

/**
 * 4. mockFailedFlow
 * Follows same general shape as mockComplexFlow with Python execution failure.
 */
export function mockFailedFlow(onEvent) {
  const events = [
    {
      event: "status_change",
      status: "PLANNING"
    },
    {
      event: "status_change",
      status: "RUNNING",
      current_agent: "reasoning_agent"
    },
    {
      event: "tool_call",
      tool: "ocr",
      success: true,
      summary: "Extracted text from 3 pages."
    },
    {
      event: "tool_call",
      tool: "knowledge",
      success: true,
      summary: "Retrieved SOP section 4.2."
    },
    {
      event: "tool_call",
      tool: "python_execution",
      success: false,
      summary: "Python execution failed.",
      error: "Division by zero in deviation calculation"
    },
    {
      event: "final",
      task_id: "mock-failed",
      status: "FAILED",
      answer: null,
      task_type: "DOCUMENT",
      agent: "reasoning_agent",
      model: "reasoning_model",

      plan: [
        "Read input file",
        "OCR required pages",
        "Search knowledge base",
        "Calculate deviation",
        "Write DOCX"
      ],

      tool_calls: [
        {
          tool: "ocr",
          success: true,
          summary: "Extracted text from 3 pages."
        },
        {
          tool: "knowledge",
          success: true,
          summary: "Retrieved SOP section 4.2."
        },
        {
          tool: "python_execution",
          success: false,
          summary: "Python execution failed.",
          error: "Division by zero in deviation calculation"
        }
      ],

      sources: [],
      artifacts: [],
      verification: null,
      errors: ["Division by zero in deviation calculation"],
      error: "Division by zero in deviation calculation"
    }
  ];

  return runStaggeredSequence(events, onEvent, 700);
}

/**
 * Helper to emit a sequence of events with staggered ~700ms delays.
 */
function runStaggeredSequence(events, onEvent, delayMs) {
  let isCancelled = false;
  const timeouts = [];

  events.forEach((evt, index) => {
    const timer = setTimeout(() => {
      if (!isCancelled && onEvent) {
        onEvent(evt);
      }
    }, (index + 1) * delayMs);
    timeouts.push(timer);
  });

  return () => {
    isCancelled = true;
    timeouts.forEach((t) => clearTimeout(t));
  };
}
