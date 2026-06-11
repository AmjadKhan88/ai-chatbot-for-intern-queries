# Internee.pk — Frequently Asked Questions

## General Questions

**Q: I just joined. Where do I start?**  
A: Start by reading the welcome email from your coordinator — it has your cohort ID, WhatsApp group link, and portal login credentials. Then log into `portal.internee.pk`, navigate to "My Tasks", and read the brief for Task 1 in full before writing any code.

**Q: Can I use ChatGPT or Claude to help me build the tasks?**  
A: Yes! AI tools are allowed and encouraged. The goal is for you to learn how to build production-quality apps *with* AI assistance. What's not allowed is submitting code you don't understand. You should be able to explain every part of your submission if asked.

**Q: Do I need to pay anything?**  
A: The core internship program is free. All APIs used in tasks have free tiers (Gemini API via Google AI Studio, Vercel for deployment, Railway/Render for backend hosting). If a service requires payment, it's not required for the task.

**Q: I missed the deadline. What do I do?**  
A: Contact your coordinator immediately via WhatsApp or email. Late submissions within 24 hours incur a 20% penalty. Beyond 24 hours, they are generally not accepted — but reach out anyway to explain your situation.

---

## Technical Questions

**Q: What version of Node.js should I use?**  
A: Node.js 18 or 20 (LTS). Avoid Node.js 21+ as some packages may have compatibility issues. Use `nvm` to manage versions if needed.

**Q: How do I get a free Gemini API key?**  
A: Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey), sign in with a Google account, and click "Create API Key". The free tier allows generous usage for development — more than enough for these tasks.

**Q: My Vercel deployment is failing. What should I check?**  
A: Common causes: (1) Missing environment variables — add them in Vercel dashboard under Project → Settings → Environment Variables. (2) Build errors — check the Vercel build logs carefully. (3) `node_modules` in your git repo — add it to `.gitignore`. Run `git rm -r --cached node_modules` if it was accidentally committed.

**Q: My app works locally but not in production. Why?**  
A: Most likely an environment variable issue. Make sure every `process.env.VARIABLE` used in your code is added to your deployment platform. Also check that file paths using `path.join` use `process.cwd()` as the base — not `__dirname`, which behaves differently in serverless environments.

**Q: Can I use a different AI model instead of Gemini?**  
A: The task brief specifies Gemini 2.5 Flash as the required model. However, the code architecture is nearly identical for OpenAI — if you want to experiment locally, that's fine. Just ensure your final submission uses Gemini as specified.

**Q: What is RAG and why are we using it for Task 3?**  
A: RAG stands for Retrieval-Augmented Generation. Instead of relying on an AI model's built-in training data, we first retrieve relevant information from our own knowledge base (the markdown files) and inject that context into the prompt. This makes the AI's answers accurate and specific to *our* internship program rather than generic. It's also how production chatbots at companies like Notion, Intercom, and Anthropic's Claude.ai work.

**Q: How do I implement streaming responses?**  
A: In Next.js with the Gemini SDK, use `generateContentStream()` and return a `ReadableStream` from your API route. On the frontend, read the stream using the `fetch` API with `response.body.getReader()` and decode chunks as they arrive. The starter code in this project demonstrates this pattern.

---

## Submission Questions

**Q: What should my README include?**  
A: At minimum: project title and description, tech stack list, screenshot or GIF of the running app, setup instructions (clone → install → env vars → run), and a link to the live demo. A well-written README is 20% of your score.

**Q: Does my demo video need to be edited or professional?**  
A: No. A simple Loom screen recording is perfect. Walk through the features, explain your decisions briefly, and show it working end-to-end. 2–5 minutes is the target length.

**Q: I submitted but forgot to add something. Can I resubmit?**  
A: Yes, if the deadline has not passed. Log back into the portal and update your submission. After the deadline, contact your coordinator.

**Q: Will my certificate mention the specific tasks I completed?**  
A: The certificate confirms completion of the internship track (e.g., "Generative AI"). It does not list individual task names, but your portfolio (GitHub + live demos) serves as proof of the specific work you did.
