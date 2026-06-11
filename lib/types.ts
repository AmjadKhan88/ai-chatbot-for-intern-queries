/**
 * Shared TypeScript types used across the app.
 */

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  /** ISO timestamp for display */
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  /** Conversation history for multi-turn context (last N turns) */
  history: Array<{ role: MessageRole; content: string }>;
}