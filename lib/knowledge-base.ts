import fs from "fs";
import path from "path";

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
}

export function loadKnowledgeBase(): KnowledgeDocument[] {
  // Try multiple possible paths — Next.js cwd() can differ between dev and prod
  const possiblePaths = [
    path.join(process.cwd(), "knowledge-base"),
    path.join(process.cwd(), "public", "knowledge-base"),
    path.join(__dirname, "..", "..", "knowledge-base"),
    path.join(__dirname, "..", "knowledge-base"),
  ];

  let knowledgeDir: string | null = null;

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      knowledgeDir = p;
      console.log("[KnowledgeBase] Found at:", p);
      break;
    }
  }

  if (!knowledgeDir) {
    console.error(
      "[KnowledgeBase] CRITICAL: Could not find knowledge-base folder.\n" +
      "Tried paths:\n" + possiblePaths.join("\n") +
      "\nMake sure the /knowledge-base folder is in your project root."
    );
    return [];
  }

  try {
    const files = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith(".md"));
    console.log("[KnowledgeBase] Found files:", files);

    if (files.length === 0) {
      console.error("[KnowledgeBase] No .md files found in:", knowledgeDir);
      return [];
    }

    return files.map((filename) => {
      const id = filename.replace(".md", "");
      const title = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");
      const filePath = path.join(knowledgeDir!, filename);
      const content = fs.readFileSync(filePath, "utf-8");
      console.log(`[KnowledgeBase] Loaded: ${filename} (${content.length} chars)`);
      return { id, title, content };
    });
  } catch (error) {
    console.error("[KnowledgeBase] Error reading files:", error);
    return [];
  }
}

export function retrieveContext(query: string, topK: number = 2): string {
  const documents = loadKnowledgeBase();

  if (documents.length === 0) {
    console.error("[KnowledgeBase] retrieveContext: No documents loaded — returning empty context");
    return "";
  }

  console.log(`[KnowledgeBase] retrieveContext: ${documents.length} docs loaded for query: "${query}"`);

  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "i", "my", "me",
    "do", "does", "can", "how", "what", "when", "where", "why", "who",
    "to", "of", "in", "on", "at", "for", "with", "about", "and", "or", "get",
  ]);

  const keywords = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length >= 2 && !stopWords.has(word));

  console.log("[KnowledgeBase] Keywords extracted:", keywords);

  // If no keywords, return ALL documents
  if (keywords.length === 0) {
    return documents.map((d) => `## ${d.title}\n\n${d.content}`).join("\n\n---\n\n");
  }

  const scored = documents.map((doc) => {
    const lowerContent = doc.content.toLowerCase();
    const score = keywords.reduce((total, keyword) => {
      const matches = (lowerContent.match(new RegExp(keyword, "g")) || []).length;
      return total + matches;
    }, 0);
    console.log(`[KnowledgeBase] Score for "${doc.id}": ${score}`);
    return { doc, score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  const topDocs = sorted.slice(0, topK).filter((item) => item.score > 0).map((item) => item.doc);

  // ALWAYS fall back to all documents if nothing scored — never return empty
  const selectedDocs = topDocs.length > 0 ? topDocs : documents;
  console.log("[KnowledgeBase] Selected docs:", selectedDocs.map((d) => d.id));

  return selectedDocs.map((d) => `## ${d.title}\n\n${d.content}`).join("\n\n---\n\n");
}