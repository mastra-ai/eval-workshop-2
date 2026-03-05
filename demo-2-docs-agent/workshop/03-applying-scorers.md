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

### Sampling

You don't have to score every request. Use `sampling.rate` to control the percentage:

| Rate | Meaning |
|------|---------|
| `1` | Score 100% of requests |
| `0.5` | Score 50% of requests |
| `0.1` | Score 10% of requests |

Lower sampling rates reduce cost and latency, especially for LLM-as-Judge scorers.

---

## Option 2: Run an Experiment

Use Mastra Studio to run an experiment against a dataset with scorers attached. This is useful for:

- Testing changes before deploying
- Comparing agent versions
- Running scheduled evaluation jobs

### Steps

1. Open Mastra Studio at `http://localhost:4111`
2. Navigate to your dataset (or create one — you can import from `csv/queries.csv`)
3. Click **Run Experiment**
4. Select **Agent** as the target type
5. Select **docsAgent** as the target
6. Select the scorers you want to run (e.g., `linkCheckerScorer`, `relevantLinkScorer`)
7. Start the experiment

The experiment sends each dataset item to the agent, records the response, and runs all selected scorers against each result.

### Reviewing results

After the experiment completes, Studio shows:

- **Per-item scores** — each query with its scorer results
- **Aggregate stats** — pass rate, average score, error count
- **Detailed reasons** — why each scorer gave its score

### Comparing experiments

After running multiple experiments (e.g., before and after changing agent instructions), you can compare them in Studio:

1. Go to your dataset's **Experiments** tab
2. Select two experiments to compare
3. Studio shows a side-by-side diff of scores, highlighting regressions and improvements

This makes it easy to validate that a change actually improved quality before deploying.

---

## Comparing the Two Approaches

| | Agent Scorers | Experiments |
|---|---|---|
| **When it runs** | Every `generate()` call | On demand |
| **Use case** | Production monitoring | Pre-deploy testing |
| **Data source** | Live user queries | Dataset |
| **Sampling** | Configurable rate | Always 100% |
| **Output** | Sent to observability tools | Viewable in Studio |

### Recommendation

Use **both**:
1. Run **experiments** before deploying changes to catch regressions
2. Attach **agent scorers** in production to monitor real-world quality

---

## Exercise

1. Add both scorers to your agent with a sampling rate of `1`
2. Run an experiment in Studio with your dataset and scorers
3. Review the scores — which queries failed? Why?
4. Make a change to your agent (e.g., update instructions) and run a new experiment to compare
