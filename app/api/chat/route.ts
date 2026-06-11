/**
 * app/api/chat/route.ts
 *
 * POST /api/chat
 *
 * This is a Next.js 14 App Router Route Handler (the modern replacement for
 * pages/api routes). It handles chat requests by:
 *
 *   1. Parsing the user's message from the request body
 *   2. Running the RAG retriever to find relevant knowledge base sections
 *   3. Building a system prompt that injects the retrieved context
 *   4. Calling the Gemini 2.5 Flash model with streaming enabled
 *   5. Returning a ReadableStream so the frontend can display text progressively
 *
 * Streaming is important for UX — without it, users see nothing until the
 * entire response is generated (2–8 seconds). With streaming, text appears
 * token by token, which feels instantaneous.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveContext } from "@/lib/knowledge-base";
import type { ChatRequest } from "@/lib/types";
import { NextRequest } from "next/server";

// Validate that the API key is present at startup
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "[API/Chat] GEMINI_API_KEY is not set. Add it to .env.local"
  );
}

const genAI = new GoogleGenerativeAI(apiKey ?? "");

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, history = [] } = body;

    if (!message?.trim()) {
      return new Response(
        JSON.stringify({ error: "Message cannot be empty." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── Step 1: RAG — Retrieve relevant context ─────────────────────────────
    // Before calling the LLM, we search our knowledge base for content that
    // is semantically related to the user's question. This retrieved text is
    // then injected into the system prompt, giving the model accurate, specific
    // information it couldn't know from training alone.
    const context = retrieveContext(message, 2);

    // ── Step 2: Build the system prompt ─────────────────────────────────────
    const systemPrompt = `You are InternBot, a helpful AI assistant for the Internee.pk internship program.
Your job is to answer questions from interns about tasks, policies, deadlines, and program guidelines.

INSTRUCTIONS:
- Only answer questions related to the internship program.
- Base your answers primarily on the KNOWLEDGE BASE sections provided below.
- Be concise, friendly, and professional — you are speaking to student developers.
- If the answer is not in the knowledge base, say: "I don't have that information in my knowledge base. Please contact your coordinator at support@internee.pk."
- Use bullet points and short paragraphs for clarity.
- Never invent deadlines, policies, or task requirements that aren't in the knowledge base.

─── KNOWLEDGE BASE ─────────────────────────────────────────────────────────────
${context}
────────────────────────────────────────────────────────────────────────────────
`;

    // ── Step 3: Call Gemini with streaming ──────────────────────────────────
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // Build Gemini-compatible conversation history (last 6 turns for context)
    const geminiHistory = history.slice(-6).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history: geminiHistory });

    const result = await chat.sendMessageStream(message);

    // ── Step 4: Return a ReadableStream ─────────────────────────────────────
    // We create a web-standard ReadableStream that forwards each chunk from
    // the Gemini stream to the client. The client reads this incrementally.
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (streamError) {
          console.error("[API/Chat] Stream error:", streamError);
          controller.enqueue(
            encoder.encode(
              "\n\nSorry, I encountered an error while generating a response. Please try again."
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Tell the client this is a stream, not a single JSON response
        "Transfer-Encoding": "chunked",
        // Prevent Vercel / CDN from buffering the entire stream before sending
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("[API/Chat] Unhandled error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}