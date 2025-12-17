# Doc Agent Eval Workshop

A hands-on workshop for learning how to evaluate AI agents using Mastra. This project includes a documentation agent and a complete evaluation pipeline.

## Prerequisites

- Node.js >= 22.13.0
- pnpm >= 10.23.0

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Required: OpenAI API key for the docs agent
OPENAI_API_KEY=your-openai-api-key

# Optional: Langfuse for observability
LANGFUSE_PUBLIC_KEY=your-langfuse-public-key
LANGFUSE_SECRET_KEY=your-langfuse-secret-key
LANGFUSE_BASE_URL=https://cloud.langfuse.com

# Optional: Braintrust for observability
BRAINTRUST_API_KEY=your-braintrust-api-key
BRAINTRUST_PROJECT_NAME=your-project-name
```

### 3. Start the development server

```bash
pnpm dev
```

This starts the Mastra server at `http://localhost:4111`.

## The Docs Agent

The docs agent (`src/mastra/agents/docs-agent.ts`) is an AI assistant specialized in Mastra documentation. It uses:

- **Model**: OpenAI GPT-5.1
- **Tools**:
  - `mastraDocsTool` - Search and retrieve Mastra documentation
  - `mastraBlogTool` - Search Mastra blog posts
  - `mastraExamplesTool` - Find code examples
  - `linkCheckerTool` - Validate URLs before sharing

The agent is configured to:
- Always use tools to find accurate information
- Provide complete code examples with imports
- Include verified links in every response
- Never include `.mdx` file paths (uses proper URLs instead)

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Mastra development server |
| `pnpm build` | Build the project |
| `pnpm test` | Run tests with Vitest |
| `pnpm tuple-generation` | Generate dimension tuples for synthetic queries |
| `pnpm query-generation` | Generate synthetic user queries from tuples |
| `pnpm generate-traces` | Run queries against the agent to generate traces |

## Workshop Documentation

The `workshop/` directory contains step-by-step guides for the evaluation process:

### [01-synthetic-dataset.md](workshop/01-synthetic-dataset.md)
Learn how to create a synthetic dataset for testing your agent:
1. Define dimensions of user queries (feature area, intent, clarity)
2. Generate tuples using those dimensions
3. Create realistic queries from tuples using documentation context

### [02-trace.md](workshop/02-trace.md)
Generate and analyze traces to identify failure modes:
1. Run queries against your agent to generate traces
2. Explore traces in different observability providers (Langfuse, Braintrust, Mastra Studio)
3. Identify the first failure mode in each trace
4. Catalog and rank failure modes by frequency

### [03-create-scorer.md](workshop/03-create-scorer.md)
Create custom scorers to detect failure modes:
1. Understand code-based vs LLM-as-judge scorers
2. Learn the four-step scorer pipeline
3. Build a code-based scorer (example: detecting `.mdx` paths)

## Project Structure

```
├── src/mastra/
│   ├── agents/
│   │   └── docs-agent.ts       # The documentation agent
│   ├── scorers/
│   │   └── mdx-path-scorer.ts  # Example code-based scorer
│   ├── tools/
│   │   ├── docs.ts             # MCP docs client
│   │   └── link-checker.ts     # URL validation tool
│   └── index.ts                # Mastra configuration
├── scripts/
│   ├── 01-tuple-generation.ts  # Generate dimension tuples
│   ├── 02-query-generation.ts  # Generate queries from tuples
│   ├── 03-generate-traces.ts   # Run queries and collect traces
│   ├── tuples.json             # Generated tuples
│   ├── queries.json            # Generated queries
│   └── traces.json             # Collected traces
└── workshop/
    ├── 01-synthetic-dataset.md
    ├── 02-trace.md
    └── 03-create-scorer.md
```

## Observability

The project is configured to export traces to multiple providers:

- **Mastra Studio** - Built-in at `http://localhost:4111`
- **Langfuse** - Cloud-based observability platform
- **Braintrust** - AI evaluation and monitoring

Configure the environment variables above to enable each provider.

