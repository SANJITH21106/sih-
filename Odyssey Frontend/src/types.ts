/**
 * MRPL Sovereign AI Workbench - Core TypeScript Definitions
 * 
 * Strict Domain Models and Enum Types according to Backend API Specification.
 */

export type TaskStatus = 
  | 'CREATED'
  | 'PLANNING'
  | 'RUNNING'
  | 'WAITING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED';

export type TaskType = 
  | 'SIMPLE'
  | 'REASONING'
  | 'CODING'
  | 'MATHEMATICAL'
  | 'DOCUMENT'
  | 'MULTIMODAL';

export type AgentName = 
  | 'normal_llm'
  | 'reasoning_agent'
  | 'coding_agent'
  | 'mathematical_agent';

export type ToolName = 
  | 'ocr'
  | 'vision'
  | 'knowledge'
  | 'file_read'
  | 'file_write'
  | 'python_execution';

export type ModelId = 
  | 'general_model'
  | 'reasoning_model'
  | 'coding_model'
  | 'vision_model'
  | 'embedding_model';

export type ArtifactType = 
  | 'docx'
  | 'xlsx'
  | 'pptx'
  | 'pdf'
  | 'txt'
  | 'csv';

export interface PlanStep {
  step: number;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

export interface ToolCall {
  id?: string;
  tool: ToolName | string;
  summary: string;
  status: 'success' | 'failed' | 'executing';
  error?: string;
  timestamp?: string;
}

export interface Source {
  id?: string;
  document_name: string;
  page?: number | string;
  section?: string;
  excerpt: string;
  relevance_score?: number;
}

export interface Artifact {
  id?: string;
  file_name: string;
  file_type: ArtifactType | string;
  download_url: string | null;
  generated: boolean;
  verified: boolean;
}

export interface VerificationCheck {
  name: string;
  passed: boolean;
  details?: string;
}

export interface Verification {
  status: 'PASS' | 'FAIL' | 'PENDING';
  checks: VerificationCheck[];
  summary?: string;
}

export interface TaskState {
  taskId: string | null;
  session_id?: string | null;
  prompt?: string;
  status: TaskStatus;
  taskType: TaskType;
  currentAgent: AgentName | string | null;
  currentModel: ModelId | string | null;
  plan: string[] | null;
  currentStep: number | null;
  toolCalls: ToolCall[];
  sources: Source[];
  artifacts: Artifact[];
  verification: Verification | null;
  answer: string | null;
  error: string | null;
  connection: 'connected' | 'polling' | 'disconnected';
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  files?: Array<{ name: string; size: number; type: string }>;
  taskState?: TaskState;
}

export interface Session {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  messages?: Message[];
}

export interface ModelInfo {
  model_id: ModelId | string;
  model_name: string;
  local_availability: boolean;
  capabilities: string[];
  context_length: number;
  quantization: string;
  memory_requirement: string;
  supported_tasks: TaskType[];
  is_default?: boolean;
}

export interface KnowledgeDocument {
  id: string;
  file_name: string;
  document_type: string;
  chunk_count: number;
  indexed_status: 'INDEXED' | 'INDEXING' | 'FAILED';
  created_at: string;
}

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'offline';
  external_calls_enabled: boolean;
  local_node_id: string;
  gpu_vram_usage: string;
}

export interface User {
  username: string;
  role: 'USER' | 'ADMIN';
  token?: string;
}
