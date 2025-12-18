# Generating Synthetic data

## 1. Dimensions of a user query

A dimension is one way that user queries can differ from each other.

For this exercise come up with three dimensions of the Mastra chatbot.

### Example:

#### Dimension 1: Feature Area

**Description:** The main topic or feature the user is asking about.

**Possible Values:**

- Agents
- Workflows
- RAG
- Memory
- Tools & MCP
- Voice
- Deployment
- Observability
- Evals
- Models & Providers
- Server & Client
- Getting Started

#### Dimension 2: Query Intent

**Description:** What the user is trying to accomplish with their question.

**Possible Values:**

- **Conceptual:** "What is X?", "How does X work?"
- **Implementation:** "How do I build/set up X?"
- **Configuration:** "How do I configure X?", "What options exist?"
- **Comparison:** "Difference between X and Y?", "Which should I use?"

#### Dimension 3: Query Clarity

**Description:** How well-formed or challenging the user's query is.

**Possible Values:**

- **Clear & specific:** Well-defined question with enough context
- **Vague/ambiguous:** Unclear what they're actually asking
- **Wrong terminology:** Uses close-but-incorrect terms

---

## 2. Generate tuples using dimensions

Use an LLM to generate random combinations using your dimensions.

See [`scripts/01-tuple-generation.ts`](../scripts/01-tuple-generation.ts) for an example implementation.

You can run the following command to generate your own tuples with the example:

```bash
pnpm tuple-generation
```

## 3. Generate queries from tuples

Use an LLM to generate realistic user queries from your tuples. To make queries more grounded in reality, fetch relevant documentation context using the Mastra MCP docs tool.

The query generation process:

1. **Discover available paths** — Call the docs tool to get the documentation structure
2. **Select relevant paths** — For each tuple, let an LLM pick documentation paths based on the feature area
3. **Fetch documentation** — Retrieve the actual documentation content
4. **Generate query** — Use the tuple dimensions + documentation context to generate a realistic user query

See [`scripts/02-query-generation.ts`](../scripts/02-query-generation.ts) for an example implementation.

You can run the following command to generate queries from your tuples:

```bash
pnpm query-generation
```
