"use client";

/**
 * components/MessageBubble.tsx
 *
 * Renders a single chat message with role-based styling.
 * Supports basic markdown rendering for assistant messages:
 * bold (**text**), inline code (`code`), and line breaks.
 */

import type { ChatMessage } from "@/lib/types";

interface Props {
  message: ChatMessage;
}

/**
 * Lightweight markdown-to-JSX converter for assistant messages.
 * Handles: **bold**, `code`, and newlines → <br />.
 * For a production app, replace with the `marked` library + DOMPurify.
 */
function renderMarkdown(text: string) {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Convert inline markdown tokens to React elements
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

    const rendered = parts.map((part, partIdx) => {
      const key = `${lineIdx}-${partIdx}`;
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={key} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={key}
            className="px-1.5 py-0.5 rounded text-xs font-mono bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      // Handle bullet list lines starting with "- "
      if (part.startsWith("- ")) {
        return <span key={key}>• {part.slice(2)}</span>;
      }
      return <span key={key}>{part}</span>;
    });

    return (
      <span key={lineIdx}>
        {rendered}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 animate-slide-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
        }`}
      >
        {isUser ? "U" : "IB"}
      </div>

      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-700 rounded-bl-sm shadow-sm"
          }`}
        >
          {isUser ? (
            message.content
          ) : (
            <span>{renderMarkdown(message.content)}</span>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-zinc-400 dark:text-zinc-600 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
