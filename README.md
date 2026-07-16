# AI Chat Helper

A small full-stack playground for building AI-powered features: a themed customer-support **chatbot** and an AI **review summarizer**.

## Features

### 💬 Chatbot

A support agent for a fictional theme park, **WonderWorld**. It:

- Holds a real multi-turn conversation — instead of resending the full chat history on every request, it uses OpenAI's Responses API `previous_response_id` chaining, so the model keeps context server-side.
- Is grounded in a static knowledge base (`WonderWorld.md`: ticket prices, ride list, hours, dining) injected into the system prompt via a `{{parkInfo}}` placeholder, so it can't wander off-topic or make things up about a park that doesn't exist.
- Has a small UI layer of its own: markdown-rendered replies, a typing indicator, sound effects on send/receive, and copy-to-clipboard that strips out non-selected content.

### ⭐ Review Summarizer

Given a product's customer reviews, it produces a short AI-written summary of the recurring themes.

- Deliberately uses a **different model for a different job**: the chatbot needs a strong conversational model (OpenAI `gpt-4o-mini`), but summarizing a handful of reviews doesn't — that runs locally through **Ollama** with `tinyllama`, so it costs nothing and needs no API key.
- Summaries are cached in the database for 7 days (`Summary` table with an `expiresAt`), so the same product isn't re-summarized on every page load.
- The client toggles between the chatbot and this view with a minimal tab switcher.

## Tech stack

**Backend** — Bun, Express 5, TypeScript, Zod (request validation), Prisma + SQLite, the `openai` SDK (Responses API), `ollama` (local inference)

**Frontend** — React 19, Vite, Tailwind CSS v4, shadcn-style UI primitives (Radix + `class-variance-authority`), TanStack Query, React Hook Form, `react-markdown`, `react-icons`

**Tooling** — Bun workspaces (monorepo), Husky + lint-staged + Prettier (format-on-commit)

## Project structure

```
packages/
  client/   React + Vite frontend
  server/   Express API
    llm/            LLM client + prompt templates (.txt/.md, loaded as plain text)
    controllers/     request handling + validation
    services/        business logic (prompt assembly, caching)
    repositories/     Prisma/data access
    prisma/          schema, migrations, seed script
```

## Getting started

```bash
bun install
```

**Server** — copy the env file and fill in your key:

```bash
cd packages/server
cp .env.example .env   # set OPENAI_API_KEY, leave DATABASE_URL as-is
bunx prisma migrate deploy
bun run db:seed         # seeds one demo product with reviews
bun run dev
```

**Client** (separate terminal):

```bash
cd packages/client
bun run dev
```

The Vite dev server proxies `/api/*` to `localhost:3000`, so just open the client URL it prints.

For the review summarizer to actually generate text (not just fail gracefully), you'll also need [Ollama](https://ollama.com) running locally with the model pulled:

```bash
ollama pull tinyllama
```

## Notable decisions along the way

- **SQLite instead of MySQL** for the review data — MySQL means spinning up a server just to try the demo. SQLite gets you a working app with `bun install` and one migrate command.
- **One shared Prisma client** instead of a `new PrismaClient()` per repository file, to avoid opening redundant connection pools.
- **Consistent error handling** — every controller wraps its LLM/DB calls in try/catch and returns a clean 4xx/5xx instead of leaking a stack trace, and both review endpoints agree on 404 for a missing product.
- **Husky's `bunx` gotcha** — the pre-commit hook originally called `bunx lint-staged`, which works fine from a terminal but fails silently (or loudly) from GUI git clients like VS Code's, because they don't inherit the shell's `PATH` additions (e.g. `~/.bun/bin`). Husky already prepends `node_modules/.bin` to `PATH` itself, so calling `lint-staged` directly sidesteps the problem entirely.
- Known limitation: the chatbot's conversation store is in-memory (a `Map`), so conversations don't survive a server restart — fine for a demo, would need a real store for production.
