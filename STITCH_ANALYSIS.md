# MRPL Sovereign AI — Stitch Analysis & Component Interface Specifications

This document presents a comprehensive technical breakdown and strict component type interface specification for the two Stitch projects of **Mangalore Refinery and Petrochemicals Limited (MRPL) Sovereign AI**:
1. **MRPL Sovereign AI Workbench** (`projects/15798712520824066315`)
2. **MRPL Sovereign AI Admin UI** (`projects/12010221685232450459`)

All component inputs and prop types documented below strictly implement the authoritative domain contracts defined in `types.ts` (`c:\Users\Sanjith\Documents\test frontend\Odyssey Frontend\src\types.ts`).

---

## 1. Core Data Models (`types.ts` Baseline Contracts)

To prevent catastrophic breaking changes across the application state and backend API integration, all components MUST consume these unmutated TypeScript domain types:

```typescript
export type TaskStatus = 'CREATED' | 'PLANNING' | 'RUNNING' | 'WAITING' | 'VERIFYING' | 'COMPLETED' | 'FAILED';
export type TaskType = 'SIMPLE' | 'REASONING' | 'CODING' | 'MATHEMATICAL' | 'DOCUMENT' | 'MULTIMODAL';
export type AgentName = 'normal_llm' | 'reasoning_agent' | 'coding_agent' | 'mathematical_agent';
export type ToolName = 'ocr' | 'vision' | 'knowledge' | 'file_read' | 'file_write' | 'python_execution';
export type ModelId = 'general_model' | 'reasoning_model' | 'coding_model' | 'vision_model' | 'embedding_model';
export type ArtifactType = 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'txt' | 'csv';

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
```

---

## 2. Workbench Specifications & Component Prop Contracts

* **Project ID**: `projects/15798712520824066315`
* **Primary Route**: `/workbench`

### Component Prop Definitions (Strict `types.ts` Integration)

1. **`TopHeader`**
   ```typescript
   interface TopHeaderProps {
     currentUser: User | null;
     health: HealthStatus | null;
     onLogout: () => void;
   }
   ```

2. **`SessionSidebar`**
   ```typescript
   interface SessionSidebarProps {
     sessions: Session[];
     activeSessionId: string | null;
     onSelectSession: (sessionId: string) => void;
     onCreateSession: () => void;
     onRenameSession: (sessionId: string, newTitle: string) => void;
     onDeleteSession: (sessionId: string) => void;
   }
   ```

3. **`ChatWindow`**
   ```typescript
   interface ChatWindowProps {
     activeSession: Session | null;
     onUpdateSessionMessages: (sessionId: string, messages: Message[]) => void;
     onAutoRenameSession: (sessionId: string, newTitle: string) => void;
     onCreateSession: () => void;
   }
   ```

4. **`MessageBubble`**
   ```typescript
   interface MessageBubbleProps {
     message: Message;
   }
   ```

5. **`TaskTracePanel`**
   ```typescript
   interface TaskTracePanelProps {
     taskState: TaskState;
   }
   ```

6. **`MessageComposer`** (FileUpload)
   ```typescript
   interface MessageComposerProps {
     onSendMessage: (prompt: string, files: Array<{ name: string; size: number; type: string }>) => void;
     disabled?: boolean;
   }
   ```

7. **`SourceList`**
   ```typescript
   interface SourceListProps {
     sources: Source[];
   }
   ```

8. **`ArtifactCard`**
   ```typescript
   interface ArtifactCardProps {
     artifact: Artifact;
   }
   ```

---

## 3. Admin UI Specifications & Component Prop Contracts

* **Project ID**: `projects/12010221685232450459`
* **Routes**: `/admin/users`, `/admin/external-api`, `/admin/models`, `/admin/knowledge-base`, `/admin/sovereignty`, `/admin/chat`

### Component Prop Definitions (Strict `types.ts` Integration)

1. **`AdminHeader`**
   ```typescript
   interface AdminHeaderProps {
     currentUser: User;
     healthStatus: HealthStatus | null;
     onLogout: () => void;
   }
   ```

2. **`AdminNavTabs`**
   ```typescript
   interface AdminNavTabsProps {
     activeTab: 'users' | 'external-api' | 'models' | 'knowledge-base' | 'sovereignty' | 'chat';
     onTabChange: (tabKey: string) => void;
     modelCount: number;
     docCount: number;
     airGapActive: boolean;
   }
   ```

3. **`UsersView`**
   ```typescript
   interface UsersViewProps {
     usersList: User[];
     onAddUser: (user: User) => Promise<void>;
     onRemoveUser: (username: string) => Promise<void>;
   }
   ```

4. **`ExternalApiView`**
   ```typescript
   interface ExternalApiViewProps {
     healthStatus: HealthStatus | null;
     airGapEnforced: boolean;
   }
   ```

5. **`ModelRegistryPanel` (ModelsView)**
   ```typescript
   interface ModelRegistryPanelProps {
     models: ModelInfo[] | null;
     onAddModel?: (model: ModelInfo) => Promise<void>;
   }
   ```

6. **`KnowledgeBasePanel` (KnowledgeBaseView)**
   ```typescript
   interface KnowledgeBasePanelProps {
     documents: KnowledgeDocument[] | null;
     onUploadDocument?: (file: File) => Promise<void>;
     onReindexDocument?: (docId: string) => Promise<void>;
   }
   ```

7. **`SovereigntyView`**
   ```typescript
   interface SovereigntyViewProps {
     healthStatus: HealthStatus | null;
     loopbackSockets: Array<{ name: string; endpoint: string; status: 'AUTHORIZED' | 'BLOCKED' }>;
   }
   ```

8. **`EmbeddedChatView`**
   ```typescript
   interface EmbeddedChatViewProps {
     activeSession: Session | null;
     onUpdateSessionMessages: (sessionId: string, messages: Message[]) => void;
   }
   ```

---

## 4. Shared Design System Tokens

The visual design parameters extracted directly from Stitch UI screens:

* **Primary Colors**: `#3F7D20` (Primary Green), `#2F6418` (Dark Green), `#EAF3E5` (Light Accent Tint).
* **Surfaces**: `#F7F9F5` (Base Background Canvas), `#FFFFFF` (Card & Surface Elevation).
* **Text**: `#30342D` (Primary Slate), `#68705C` (Secondary Slate), `#717A6A` (Muted Slate).
* **Border**: `#D9E2D3` (1px Hairline Border).
* **Typography**:
  * Headings: `Public Sans` / `IBM Plex Sans`
  * Body: `Inter` / `IBM Plex Sans`
  * Hashes & Data: `JetBrains Mono`
* **Iconography**: Google Material Symbols Outlined (`16px`, `18px`, `20px`, `24px`).

---

## 5. Screen-by-Screen Functional Specifications

### Screen 1: MRPL Sovereign AI Workbench (`/workbench`)
* **Screen Title**: `MRPL Sovereign AI Workbench` (`6cfbc81d71c14bad99a5f9057fdb1947`)
* **Layout**: 2-Column Responsive Workspace (288px Left Session Drawer, Fluid Centered Stream).
* **Header**: Logo, Enterprise title, status indicator badge, user username pill, logout button.
* **Stream Area**: System welcome card, operator prompt bubbles with file attachments, real-time `TaskTracePanel` (showing `TaskState` steps, tool calls, and agent handoffs), and Markdown response container.
* **Composer**: Fixed bottom input box with file upload chips and keyboard submit (`Enter` to send).

### Screen 2: MRPL Sovereign AI Admin Console (`/admin/*`)
* **Screen Title**: `MRPL Sovereign AI Workbench - Full Admin Console` (`e0b16d1de6cb4499b6db0eec0f3edf57`)
* **Layout**: 6-Tab SPA Architecture with persistent top header, horizontal pill tabs, dynamic breadcrumb pathing, and mutually exclusive viewports.
* **Views**:
  1. `Users`: Operator search bar, department role filter, user directory grid, `AddUserModal`.
  2. `External API Calls`: Air-gap status banner (`Disabled / Blocked`), 3 telemetry status cards, loopback sockets.
  3. `Models`: Registered Ollama models table, capability chips, VRAM gauge (`103.8 GB / 160 GB`), `AddModelModal`.
  4. `Knowledge Base`: Drag & drop file upload zone, Qdrant vector index telemetry, document registry grid.
  5. `Sovereignty`: Verified air-gap banner, 3 telemetry monitor cards.
  6. `Chat`: Fully functional embedded operator chat environment.

---

## 6. Implementation Architecture & Next Steps

```
src/
├── types.ts                     <-- (CRITICAL) Authoritative domain types (UNTOUCHED)
├── api/
│   ├── client.js
│   └── taskSocket.js
├── utils/
│   └── sessionStore.js
├── components/
│   ├── TopHeader.jsx
│   ├── LocalOnlyBadge.jsx
│   ├── SessionSidebar.jsx
│   ├── ChatWindow.jsx
│   ├── MessageBubble.jsx
│   ├── TaskTracePanel.jsx
│   ├── FileUpload.jsx
│   ├── ModelRegistryPanel.jsx
│   ├── KnowledgeBasePanel.jsx
│   ├── admin/
│   │   ├── AdminNavTabs.jsx
│   │   ├── UsersView.jsx
│   │   ├── ExternalApiView.jsx
│   │   ├── ModelsView.jsx
│   │   ├── KnowledgeBaseView.jsx
│   │   └── SovereigntyView.jsx
│   └── modals/
│       ├── AddUserModal.jsx
│       └── AddModelModal.jsx
├── App.jsx
└── main.jsx
```

### Implementation Execution Order:
1. Verify `types.ts` is untouched and imported in components requiring type guarantees.
2. Align `ChatWindow.jsx`, `MessageBubble.jsx`, `TaskTracePanel.jsx`, `ModelRegistryPanel.jsx`, and `KnowledgeBasePanel.jsx` props strictly to `types.ts`.
3. Create `AdminNavTabs.jsx` and Admin sub-views (`UsersView`, `ExternalApiView`, `ModelsView`, `KnowledgeBaseView`, `SovereigntyView`).
4. Wire up route isolation in `App.jsx` (`/workbench` and `/admin/:tab`).
5. Validate against `npm run dev` with zero runtime prop or type errors.
