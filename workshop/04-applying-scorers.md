# Part 4: Applying Scorers

Now that you've built scorers, there are two ways to use them:

1. **Attach to an Agent** for online evals
2. **Run in a batch eval** for offline evals

## Option 1: Attach Scorers to an Agent

Add scorers directly to your agent definition. They'll run on every `generate()` call.

```typescript
import { Agent } from "@mastra/core/agent";
import { mdxPathScorer } from "../scorers/mdx-path-scorer";
import { relevantLinkScorer } from "../scorers/relevant-link-scorer";

export const docsAgent = new Agent({
  id: "docsAgent",
  name: "docsAgent",
  model: "openai/gpt-4o",
  instructions: `...`,
  tools: { /* ... */ },
  scorers: {
    mdxPathScorer: {
      scorer: mdxPathScorer,
      sampling: {
        type: "ratio",
        rate: 1, // Score 100% of requests (use 0.1 for 10%, etc.)
      },
    },
    relevantLinkScorer: {
      scorer: relevantLinkScorer,
      sampling: {
        type: "ratio",
        rate: 1,
      },
    },
  },
});
```

### When to use this approach

- **Production monitoring** Track quality metrics in real-time
- **Continuous evaluation** Every interaction gets scored automatically
- **Observability integration** Scores flow to Langfuse, Braintrust, etc.

### Sampling

You don't have to score every request. Use `sampling.rate` to control the percentage:

| Rate | Meaning |
|------|---------|
| `1` | Score 100% of requests |
| `0.5` | Score 50% of requests |
| `0.1` | Score 10% of requests |

Lower sampling rates reduce cost and latency, especially for LLM-as-Judge scorers.

---

## Option 2: Run Batch Evals

Use `runEvals` to score a dataset all at once. This is useful for:

- Testing changes before deploying
- Comparing agent versions
- Running scheduled evaluation jobs

```typescript
import { runEvals } from "@mastra/core/evals";
import { mastra } from "../src/mastra";
import { mdxPathScorer } from "../src/mastra/scorers/mdx-path-scorer";
import { relevantLinkScorer } from "../src/mastra/scorers/relevant-link-scorer";
import { allQueries } from "./queries";

const docsAgent = mastra.getAgent("docsAgent");

// Prepare your test data
const data = allQueries.map((item) => ({
  input: item.query,
  groundTruth: item.query, // Optional: expected output for comparison
}));

// Run the evaluation
const result = await runEvals({
  data,
  target: docsAgent,
  scorers: [mdxPathScorer, relevantLinkScorer],
  onItemComplete: ({ scorerResults }) => {
    // Log progress as each item completes
    console.log(`MDX Path: ${scorerResults["mdx-path-scorer"].score}`);
    console.log(`Links: ${scorerResults["relevant-link-scorer"].score}`);
  },
});

console.log(JSON.stringify(result, null, 2));
```

### The `runEvals` function

| Parameter | Description |
|-----------|-------------|
| `data` | Array of `{ input, groundTruth? }` objects |
| `target` | The agent to evaluate |
| `scorers` | Array of scorer functions to run |
| `onItemComplete` | Callback after each item is scored (optional) |

### Run it

```bash
pnpm run-evals
```

---

## Comparing the Two Approaches

| | Agent Scorers | Batch Evals |
|---|---|---|
| **When it runs** | Every `generate()` call | On demand |
| **Use case** | Production monitoring | Pre-deploy testing |
| **Data source** | Live user queries | Synthetic dataset |
| **Sampling** | Configurable rate | Always 100% |
| **Output** | Sent to observability tools | Returned as JSON |

### Recommendation

Use **both**:
1. Run **batch evals** before deploying changes to catch regressions
2. Attach **agent scorers** in production to monitor real-world quality

---

## Exercise

1. Add both scorers to your agent with a sampling rate of `1`
2. Run `pnpm run-evals` on your query dataset
3. Review the scores which queries failed? Why?
4. Check your observability tool (Langfuse/Braintrust) to see the scores attached to traces
