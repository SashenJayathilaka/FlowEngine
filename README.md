# 🛠️ FlowEngine — Visual Workflow Automation Platform

> An enterprise-grade, visual node-based workflow automation engine inspired by **n8n** and **Zapier**. Construct asynchronous execution pipelines, integrate AI models, trigger webhooks, and execute robust background jobs with real-time UI updates.

---

## ⚡ Tech Stack & Badges

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.3-F55C7A?style=for-the-badge)](https://better-auth.com)
[![Inngest](https://img.shields.io/badge/Inngest-3.44-4F46E5?style=for-the-badge)](https://inngest.com)
[![tRPC](https://img.shields.io/badge/tRPC-11.0-39A9DB?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io)
[![Sentry](https://img.shields.io/badge/Sentry-10.20-362D59?style=for-the-badge&logo=sentry&logoColor=white)](https://sentry.io)
[![Polar.sh](https://img.shields.io/badge/Polar.sh-0.35-4A90E2?style=for-the-badge)](https://polar.sh)

## ✨ Key Features

- 🎨 **Visual Node Editor (`@xyflow/react`)**: High-performance drag-and-drop workflow canvas supporting custom node connections, inline payload preview, live state updates, zoom controls, and validation alerts.
- 🔄 **Topological DAG Solver**: Intelligent Directed Acyclic Graph (DAG) sorting via `toposort` to automatically order dependencies, resolve step data inputs, and reject workflows with circular loops.
- 📡 **Real-Time Execution Streaming**: Leverages `@inngest/realtime` middleware to stream execution step statuses (`RUNNING`, `SUCCESS`, `FAILED`), node output payloads, and logs back to the active client window live.
- 🔐 **AES-256 Encrypted Credential Vault**: Secure API key storage using symmetric encryption (`cryptr`). Decryption takes place dynamically inside isolated step executors in the background engine.
- 🤖 **Multi-Model AI Nodes**: Native support for **OpenAI**, **Google Gemini**, **Anthropic Claude**, and **DeepSeek** powered by the Vercel AI SDK.
- ⚡ **Webhook & Event Triggers**: Built-in trigger nodes for manual runs, incoming HTTP requests, Google Form responses, and Stripe Webhook events.
- 💳 **Monetization & Billing Portal**: Subscription management and checkout links powered by `Polar.sh` integration in Better Auth.
- 🛡️ **End-to-End Type Safety**: End-to-end type safety spanning database models (Prisma), API procedures (tRPC), form validations (Zod), and client state management (Jotai & TanStack Query).
- 📈 **Observability & Crash Reporting**: Sentry SDK integration across client, server, and edge runtimes for real-time error tracking and performance profiling.

---

## 📐 System Architecture

### 🌀 Execution Sequence Flow

The diagram below details the communication between the React client, Next.js tRPC procedures, PostgreSQL database, Inngest background engine, and external API providers during workflow runs:

```mermaid
sequenceDiagram
    autonumber
    actor User as Web Client
    participant Server as Next.js (tRPC)
    participant DB as PostgreSQL (Prisma)
    participant Inngest as Inngest Engine
    participant Ext as External API / LLM

    User->>Server: Trigger Workflow (Manual / Webhook)
    Server->>DB: Create Execution Record (Status: RUNNING)
    Server->>Inngest: Send "workflows/execute.workflow" event
    Inngest-->>Server: Event Acknowledged & Queued
    Note over Inngest: Topological Sort (toposort) of DAG nodes
    loop For each sorted Node step
        Inngest->>DB: Fetch node credential (encrypted payload)
        DB-->>Inngest: Return encrypted string
        Note over Inngest: Decrypt credential key via AES-256
        Inngest->>Ext: Execute Node Action (OpenAI, Slack, HTTP, etc.)
        Ext-->>Inngest: Return output response payload
        Inngest->>User: Stream progress & step logs in real time
    end
    Inngest->>DB: Update Execution Record (Status: SUCCESS / FAILED)
    Inngest->>User: Broadcast final execution completion
```

### 🗄️ Database Schema ERD

Entity relationships mapping Users, Credentials, Workflows, Nodes, Connections, and Execution Logs:

```mermaid
erDiagram
    user ||--o{ session : "has sessions"
    user ||--o{ account : "owns accounts"
    user ||--o{ workflow : "creates workflows"
    user ||--o{ credential : "registers credentials"
    workflow ||--o{ node : "contains nodes"
    workflow ||--o{ connection : "links nodes"
    workflow ||--o{ execution : "logs runs"
    credential ||--o{ node : "assigns keys"
    node ||--o{ connection : "sources/targets"
```

---

## 🔌 Supported Nodes & Integrations

| Category | Node Name | Type | Icon | Capabilities & Description |
| :--- | :--- | :--- | :---: | :--- |
| **Triggers** | **Manual Trigger** | Trigger | 🖱️ | Initiates immediate workflow execution manually from the canvas UI. |
| | **HTTP Request** | Trigger | 🌐 | Triggers workflow on incoming HTTP GET/POST calls with request body parsing. |
| | **Google Forms** | Trigger | 📋 | Starts execution automatically upon new Google Forms responses. |
| | **Stripe** | Trigger | 💳 | Listens to Stripe Webhook events (e.g., checkout.session.completed). |
| **Actions** | **OpenAI** | Action | 🤖 | Generates completions and structured outputs using GPT-4o / GPT-4o-mini models. |
| | **Gemini** | Action | ♊ | Runs prompts using Google Gemini models via Vercel AI SDK. |
| | **Anthropic** | Action | 🧠 | Powers text processing with Claude 3.5 Sonnet / Claude 3 Opus. |
| | **DeepSeek** | Action | 🐳 | Executes reasoning and coding tasks with DeepSeek-R1 / DeepSeek-V3. |
| | **Discord** | Action | 💬 | Dispatches formatted messages and webhooks to Discord channels. |
| | **Slack** | Action | 📢 | Posts automated notifications and message blocks to Slack channels. |

---

## 📂 Project Structure

```text
.
├── app/                  # Next.js App Router (pages, auth routes, webhooks, dashboards)
├── components/           # UI components (shadcn/ui, modals, dialogs, layout wrappers)
├── config/               # Application configuration constants and environment maps
├── features/             # Domain-driven modular architecture
│   ├── auth/             # Better Auth forms, session hooks, OAuth providers
│   ├── credential/       # Encrypted credential management & creation forms
│   ├── editor/           # React Flow canvas, node overlays, sidebars, context menus
│   ├── execution/        # Node executor logic, payload resolvers, action handlers
│   ├── subscriptions/    # Polar.sh checkout handlers, billing portals, tier badges
│   ├── triggers/         # Webhook parsers, manual, Stripe & Google Form trigger logic
│   └── workflows/        # Workflow CRUD procedures, list views, run triggers
├── hooks/                # Reusable React hooks (realtime subscriptions, canvas state)
├── inngest/              # Inngest background engine configuration, functions & utils
├── lib/                  # Shared utilities (Prisma client, encryption, tRPC setup)
├── prisma/               # Database schema definition (schema.prisma) & migrations
├── public/               # Static public assets (brand logos, screenshots, SVGs)
├── trpc/                 # tRPC router declarations, routers, and procedure definitions
├── biome.json            # Code formatting and linting rules configuration
├── next.config.ts        # Next.js configuration overlay with Sentry instrumentation
└── package.json          # Project dependencies, scripts, and package metadata
```

---

## 🛠️ Environment Configuration

Create a `.env.local` file in the root directory by duplicating `.env.example`:

```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentication (Better Auth - GitHub & Google OAuth)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Monetization (Polar.sh Subscriptions)
POLAR_ACCESS_TOKEN="your_polar_access_token"
POLAR_SUCCESS_URL="http://localhost:3000/billing/success"

# Security (AES-256 Symmetric Key for API Credential Encryption)
ENCRYPTION_KEY="your_secure_random_32_byte_string_here"

# Inngest Orchestration (Required in production, optional locally)
INNGEST_EVENT_KEY=""
INNGEST_SIGNING_KEY=""
```

---

## 🚀 Quick Start & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/SashenJayathilaka/N8N-Zapier-Clone.git
cd N8N-Zapier-Clone
npm install
```

### 2. Prepare Database Schema
Ensure your PostgreSQL database (e.g. Neon, Supabase, or local instance) is accessible, then push the schema:
```bash
npx prisma db push
```

### 3. Launch Development Environment

Run the combined Next.js app and local **Inngest Dev Server**:
```bash
npm run dev:all
```

Access the local services:
- 🌐 **FlowEngine App**: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Inngest Dev Console**: [http://localhost:8288](http://localhost:8288) *(Monitor queued background steps & step outputs)*

---

## 💻 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts Next.js development server with Turbopack fast refresh |
| `dev:all` | `npm run dev:all` | Launches Next.js + Inngest Dev Engine concurrently |
| `dev:ngrok` | `npm run dev:ngrok` | Starts Next.js and creates an ngrok tunnel on port 3000 |
| `dev:all:ngrok` | `npm run dev:all:ngrok` | Runs Next.js + Inngest + Ngrok tunnel for live webhook testing |
| `build` | `npm run build` | Compiles production build using Next.js Turbopack |
| `start` | `npm run start` | Boots production application server |
| `lint` | `npm run lint` | Runs Biome linter to enforce code quality and syntax rules |
| `format` | `npm run format` | Runs Biome code formatter with auto-fix enabled |

---

## 🔒 Security & Data Encryption

1. **At-Rest Encryption**: User credentials (such as OpenAI, Anthropic, or Gemini API keys) are symmetrically encrypted using AES-256 before write operations to PostgreSQL.
2. **On-The-Fly Decryption**: Key decryption occurs exclusively inside server-side Inngest step functions during node execution and is never exposed to the client bundle.
3. **Session Integrity**: Powered by Better Auth with secure HTTP-only cookies, anti-CSRF protection, and optional OAuth provider verification.

---

## 📄 License

This repository is released under the [MIT License](LICENSE). Feel free to adapt, extend, and deploy FlowEngine in your own projects!
