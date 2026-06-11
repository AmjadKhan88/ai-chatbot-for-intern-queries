# Internee.pk — Task Guidelines

<!-- ─────────────────────────────────────────────────────────────────────────
  WHY MARKDOWN?
  Markdown files are plain text, which means:
  1. Any team member (even non-developers) can edit them in GitHub or Notepad.
  2. No code changes, no redeployment — just save the file.
  3. Git tracks every change, giving you a full history of updates.
  4. Structured headings let the RAG system retrieve the right section per query.
───────────────────────────────────────────────────────────────────────────── -->

## Task 1 — AI Resume Analyzer

**Objective:** Build a web app that analyzes a resume using an AI model and provides structured feedback.

**Requirements:**
- Accept resume upload (PDF or plain text)
- Send content to a Generative AI API (Gemini or OpenAI)
- Display a score (0–100) with an animated ring or progress bar
- Show actionable feedback: strengths, weaknesses, and improvement suggestions
- Include a dark/light theme toggle

**Tech Stack:** Python (Flask) or Node.js backend, vanilla HTML/CSS/JS or React frontend, Gemini API

**Submission:** GitHub repository link + a short Loom walkthrough video

**Deadline:** 7 days from task assignment date

**Evaluation Criteria:**
- Accuracy of AI feedback (30%)
- UI/UX polish and responsiveness (30%)
- Code quality and comments (20%)
- Readme and documentation (20%)

---

## Task 2 — Advanced Resume Evaluator

**Objective:** Extend Task 1 into a full-featured resume evaluation tool with richer analysis.

**Requirements:**
- Drag-and-drop file upload interface
- Multi-section scoring: Skills, Experience, Education, Keywords, Formatting
- ATS (Applicant Tracking System) compatibility score
- Keyword gap analysis based on a target job description input
- Export results as PDF report

**Tech Stack:** Same as Task 1, plus a PDF generation library (jsPDF, reportlab, etc.)

**Submission:** GitHub repository link + deployed live demo (Vercel / Render / Railway)

**Deadline:** 10 days from task assignment date

**Evaluation Criteria:**
- Feature completeness (35%)
- Live demo accessibility (25%)
- Code structure and modularity (20%)
- Documentation quality (20%)

---

## Task 3 — AI Intern Support Chatbot (Current Task)

**Objective:** Build a RAG-powered chatbot that helps interns find answers about tasks, policies, and guidelines.

**Requirements:**
- Next.js 14 App Router project
- Gemini 2.5 Flash as the LLM
- RAG (Retrieval-Augmented Generation): load a local knowledge base of markdown files
- Semantic keyword matching to find the most relevant context before each AI call
- Streaming responses for a real-time feel
- Dark/light theme with localStorage persistence
- Clean, professional chat UI

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Gemini API (`@google/generative-ai`)

**Submission:** GitHub repository + live deployment + demo video

**Deadline:** 10 days from task assignment date

**Evaluation Criteria:**
- RAG implementation quality (30%)
- Chat UI/UX (25%)
- Code quality and TypeScript usage (25%)
- Documentation (20%)
