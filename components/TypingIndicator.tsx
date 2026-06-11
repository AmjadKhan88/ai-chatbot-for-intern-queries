"use client";

/**
 *
 * Three pulsing dots shown while waiting for the first streamed token.
 * Uses the custom `pulseDot` animation defined in tailwind.config.ts.
 */

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      {/* Bot avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
        IB
      </div>

      <div className="px-4 py-3.5 rounded-2xl rounded-bl-sm bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500"
              style={{
                animation: `pulseDot 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
