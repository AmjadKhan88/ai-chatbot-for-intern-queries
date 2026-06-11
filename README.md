# InternBot — AI Intern Support Chatbot

> Internee.pk Task 3 — RAG-powered chatbot built with Next.js 14 + Gemini 2.5 Flash

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google)

---

## What is this?

InternBot is an AI assistant for Internee.pk interns. It answers questions about tasks, deadlines, policies, and program guidelines using **Retrieval-Augmented Generation (RAG)** — meaning it searches a local knowledge base before calling the Gemini API, so answers are always accurate and specific to this program.

---

## Features

- 🤖 **RAG pipeline** — retrieves relevant markdown sections before each AI call
- ⚡ **Streaming responses** — text appears token-by-token for a real-time feel
- 🌙 **Dark/light theme** — persisted to localStorage, respects system preference
- 📝 **Editable knowledge base** — update `.md` files without redeploying
- 💬 **Suggested questions** — quick-start prompts for new users
- 📱 **Fully responsive** — works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Model | Gemini 2.5 Flash (`gemini-2.5-flash`) |
| AI SDK | `@google/generative-ai` |
| RAG | Keyword-based retriever (built-in, no vector DB needed) |
| Deployment | Vercel |

---

## Project Structure

```
internee-chatbot/
├── app/
│   ├── api/chat/route.ts     # Streaming API route with RAG
│   ├── layout.tsx            # Root layout, theme flash prevention
│   ├── page.tsx              # Home page
│   └── globals.css           # Tailwind base + custom styles
├── components/
│   ├── ChatInterface.tsx     # Main chat UI + streaming logic
│   ├── MessageBubble.tsx     # Individual message renderer
│   ├── ThemeProvider.tsx     # Dark/light theme context
│   └── TypingIndicator.tsx   # Animated loading dots
├── lib/
│   ├── knowledge-base.ts     # File loader + RAG retriever
│   └── types.ts              # Shared TypeScript types
├── knowledge-base/           # ← Edit these to update the chatbot's knowledge
│   ├── tasks.md
│   ├── policies.md
│   └── faq.md
└── .env.local.example
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/internee-chatbot.git
cd internee-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your Gemini API key

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace the placeholder:

```
GEMINI_API_KEY=your_actual_key_here
```

Get a free key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How RAG Works (in this project)

1. User sends a message (e.g. *"What is the Task 3 deadline?"*)
2. The API route calls `retrieveContext()` in `lib/knowledge-base.ts`
3. The retriever reads all `.md` files from `/knowledge-base` using Node.js `fs`
4. Each file is scored by keyword overlap with the query
5. The top 2 most relevant documents are concatenated into a context string
6. That context is injected into Gemini's system prompt
7. Gemini generates a response grounded in the retrieved content
8. The response streams back to the client chunk by chunk

---

## Updating the Knowledge Base

Just edit the markdown files in `/knowledge-base/`. Changes take effect on the next request — **no rebuild or redeployment needed.**

You can also add new files:
```bash
touch knowledge-base/mentors.md
# Add content, commit, and push — the retriever picks it up automatically
```

---

## Deployment (Vercel)

```bash
npm run build   # Verify build passes locally first
```

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add `GEMINI_API_KEY` in **Project Settings → Environment Variables**
4. Deploy — done!

---

## License

MIT — built for the Internee.pk Generative AI Internship, Task 3.