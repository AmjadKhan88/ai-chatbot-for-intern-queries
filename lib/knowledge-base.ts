/**
 * lib/knowledge-base.ts
 *
 * Loads markdown files from /knowledge-base at RUNTIME using Node.js fs.
 *
 * ─── WHY RUNTIME LOADING? ───────────────────────────────────────────────────
 * At build time, Next.js bundles code into static assets. If we imported
 * the markdown content at build time (e.g. via import), the content would be
 * frozen into the bundle. Any update to the .md files would require a full
 * redeploy.
 *
 * By reading files with fs.readFileSync() inside a server-side function, the
 * files are read fresh on each request (or can be cached with revalidation).
 * This means a coordinator can update tasks.md on the server and interns
 * immediately get the new content — no code change, no redeployment needed.
 * ────────────────────────────────────────────────────────────────────────────
 */

import fs from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KnowledgeDocument {
  /** Filename without extension (e.g. "tasks", "policies") */
  id: string;
  /** Human-readable title derived from the filename */
  title: string;
  /** Full markdown content of the file */
  content: string;
}

// ─── File Loader ─────────────────────────────────────────────────────────────

/**
 * Reads all .md files from /knowledge-base and returns them as structured
 * documents. Called at runtime, never at build time.
 *
 * process.cwd() returns the project root in both local dev and Vercel
 * serverless environments — safer than __dirname for Next.js projects.
 */
export function loadKnowledgeBase(): KnowledgeDocument[] {
  const knowledgeDir = path.join(process.cwd(), "knowledge-base");

  try {
    const files = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith(".md"));

    return files.map((filename) => {
      const id = filename.replace(".md", "");
      const title = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");
      const filePath = path.join(knowledgeDir, filename);
      const content = fs.readFileSync(filePath, "utf-8");

      return { id, title, content };
    });
  } catch (error) {
    console.error("[KnowledgeBase] Failed to load files:", error);
    return [];
  }
}

// ─── RAG Retriever ────────────────────────────────────────────────────────────

/**
 * Retrieves the most relevant context from the knowledge base for a given query.
 *
 * This is a lightweight keyword-based retriever. In production, you would
 * replace this with vector embeddings (e.g. using Gemini's embedding API +
 * a vector store like Pinecone or Supabase pgvector). For an internship
 * project, keyword scoring is accurate enough and has zero external dependencies.
 *
 * Scoring strategy:
 * - Each keyword from the query is searched across each document's content.
 * - Matches are case-insensitive.
 * - Documents are ranked by total keyword hit count.
 * - The top N documents are returned as a combined context string.
 *
 * @param query    - The user's message
 * @param topK     - How many documents to return (default: 2)
 * @returns        - A formatted string ready to inject into the LLM prompt
 */
export function retrieveContext(query: string, topK: number = 2): string {
  const documents = loadKnowledgeBase();

  if (documents.length === 0) {
    return "No knowledge base documents found.";
  }

  // Tokenize the query into meaningful keywords (skip stop words)
  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "i", "my", "me",
    "do", "does", "can", "how", "what", "when", "where", "why", "who",
    "to", "of", "in", "on", "at", "for", "with", "about", "and", "or",
  ]);

  const keywords = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  if (keywords.length === 0) {
    // No meaningful keywords — return all documents as context
    return documents.map((d) => `## ${d.title}\n\n${d.content}`).join("\n\n---\n\n");
  }

  // Score each document by keyword frequency
  const scored = documents.map((doc) => {
    const lowerContent = doc.content.toLowerCase();
    const score = keywords.reduce((total, keyword) => {
      // Count all occurrences of this keyword in the document
      const matches = (lowerContent.match(new RegExp(keyword, "g")) || []).length;
      return total + matches;
    }, 0);

    return { doc, score };
  });

  // Sort descending by score and take the top K
  const topDocs = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((item) => item.score > 0) // Only include docs with actual matches
    .map((item) => item.doc);

  // If no documents had any keyword matches, fall back to all documents
  const selectedDocs = topDocs.length > 0 ? topDocs : documents;

  return selectedDocs
    .map((d) => `## ${d.title}\n\n${d.content}`)
    .join("\n\n---\n\n");
}