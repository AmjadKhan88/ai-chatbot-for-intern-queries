import { GoogleGenerativeAI } from "@google/generative-ai";
import { retrieveContext } from "@/lib/knowledge-base";
import type { ChatRequest } from "@/lib/types";
import { NextRequest } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("[API/Chat] GEMINI_API_KEY is not set. Add it to .env.local");
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

    // ── RAG: retrieve context ────────────────────────────────────────────────
    const context = retrieveContext(message, 2);

    // Log exactly what context is being sent to Gemini
    console.log("[API/Chat] Context length:", context.length, "chars");
    console.log("[API/Chat] Context preview:", context.slice(0, 200));

    // ── System prompt ────────────────────────────────────────────────────────
    // If context is empty (knowledge base not found), tell Gemini to say so
    // explicitly instead of hallucinating an answer.
    const systemPrompt = context
      ? `You are InternBot, a helpful AI assistant for the Internee.pk internship program.
Answer questions from interns about tasks, policies, deadlines, and guidelines.

INSTRUCTIONS:
- Base your answers on the KNOWLEDGE BASE below.
- Be concise, friendly, and professional.
- Use bullet points for clarity.
- If a question is completely unrelated to the internship, politely say so.

─── KNOWLEDGE BASE ────────────────────────────────────────────────────────────
${context}
───────────────────────────────────────────────────────────────────────────────`
      : `You are InternBot for Internee.pk. The knowledge base files could not be loaded. 
Tell the user there is a server configuration issue and they should contact support@internee.pk.`;

    // ── Call Gemini with streaming ───────────────────────────────────────────
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const geminiHistory = history.slice(-6).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessageStream(message);

    // ── Stream response back ─────────────────────────────────────────────────
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (streamError) {
          console.error("[API/Chat] Stream error:", streamError);
          controller.enqueue(
            encoder.encode("\n\nError generating response. Please try again.")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("[API/Chat] Unhandled error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}