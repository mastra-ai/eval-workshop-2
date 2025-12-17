# Creating Scorers

Now that you've identified the most prevalent failure modes, it's time to create scorers to detect them automatically. This allows you to measure improvements as you iterate on your agent.

## Types of Scorers

There are two types of scorers:

### Code-based Scorers

Use JavaScript/TypeScript functions for deterministic evaluation. These are ideal for:
- Pattern matching (regex, string checks)
- Algorithmic evaluations with clear criteria
- Performance-critical scenarios
- Consistent, reproducible results

**Advantages:** Simple to test, cheap to run, fast, and deterministic.

### LLM-as-Judge Scorers

Use an LLM to evaluate responses. These are ideal for:
- Subjective evaluations requiring human-like judgment
- Complex criteria difficult to code algorithmically
- Natural language understanding tasks
- Nuanced context evaluation

**Advantages:** Can handle complex, subjective criteria.

---

**Rule of thumb:** Whenever possible, create a code-based scorer. They are simpler to test and cheaper to run. Only use LLM-as-judge when the evaluation requires human-like reasoning.

---

## The Scorer Pipeline

All Mastra scorers follow a four-step pipeline:

1. **preprocess** (optional): Prepare or transform input/output data
2. **analyze** (optional): Perform evaluation analysis and gather insights
3. **generateScore** (required): Convert analysis into a numerical score
4. **generateReason** (optional): Generate human-readable explanations

Each step can use either **functions** (code-based) or **prompt objects** (LLM-based).

---

## Example: MDX File Path Scorer

One common failure mode we noticed: the docs agent includes file paths ending with `.mdx` instead of proper URL links to documentation.

For example, the agent might say:
> "See `agents/overview.mdx` for more details"

Instead of:
> "See https://mastra.ai/docs/agents for more details"

This is a perfect candidate for a code-based scorer — we can use regex to detect `.mdx` patterns.

### Implementation

Create a new file `src/mastra/scorers/mdx-path-scorer.ts`:

```typescript
import { createScorer } from "@mastra/core/scores";

export const mdxPathScorer = createScorer({
  name: "MDX Path Checker",
  description: "Check if the response contains .mdx file paths instead of proper URLs",
  type: "agent",
})
  .preprocess(({ run }) => {
    // Extract the response text
    const responseText = run.output.text || "";
    
    // Find all .mdx file paths in the response
    const mdxPattern = /[\w\-\/]+\.mdx/gi;
    const mdxMatches = responseText.match(mdxPattern) || [];
    
    return {
      responseText,
      mdxPaths: mdxMatches,
      mdxCount: mdxMatches.length,
    };
  })
  .generateScore(({ results }) => {
    // Score 1 = no .mdx paths (good), Score 0 = has .mdx paths (bad)
    return results.preprocessStepResult.mdxCount === 0 ? 1 : 0;
  })
  .generateReason(({ results, score }) => {
    const { mdxPaths, mdxCount } = results.preprocessStepResult;
    
    if (score === 1) {
      return "No .mdx file paths found. Response uses proper URLs.";
    }
    
    return `Found ${mdxCount} .mdx file path(s) that should be URLs: ${mdxPaths.join(", ")}`;
  });
```

### Running the Scorer

You can test the scorer directly:

```typescript
const result = await mdxPathScorer.run({
  input: [{ role: "user", content: "How do I create an agent?" }],
  output: { 
    text: "See agents/overview.mdx for details on creating agents." 
  },
});

console.log("Score:", result.score); // 0 (bad - contains .mdx)
console.log("Reason:", result.reason); // "Found 1 .mdx file path(s)..."
```

---

## Exercise: Create Your Own Scorer

Based on the failure modes you identified in the previous section, create a code-based scorer for your most common issue.

Ask yourself:
1. Can this failure be detected with a simple pattern or rule?
2. What text patterns indicate the failure?
3. What should the score be? (typically 0 = failure, 1 = success)

If the answer to #1 is "no", you may need an LLM-as-judge scorer instead.

