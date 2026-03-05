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

## Example: Link Checker Scorer

One common failure mode we noticed: the docs agent includes URLs in its response without verifying they are valid. The agent has access to a `linkCheckerTool` that performs HTTP HEAD requests to validate URLs — but sometimes it forgets to use it.

This is a perfect candidate for a code-based scorer — we can check if the response contains URLs and whether the `linkCheckerTool` was called.

### Implementation

Create a new file `src/mastra/scorers/link-checker-scorer.ts`:

```typescript
import { createScorer } from "@mastra/core/evals";
import {
  getAssistantMessageFromRunOutput,
  extractToolCalls,
} from "@mastra/evals/scorers/utils";

const URL_PATTERN = /https?:\/\/[^\s\)>\]"'`]+/gi;

export const linkCheckerScorer = createScorer({
  id: "link-checker-scorer",
  description:
    "Check if the agent used the linkCheckerTool to validate URLs when links are present",
  type: "agent",
})
  .preprocess(({ run }) => {
    const assistantMessage =
      getAssistantMessageFromRunOutput(run.output) ?? "";

    const urlMatches = assistantMessage.match(URL_PATTERN) ?? [];
    const hasLinks = urlMatches.length > 0;

    const { tools } = extractToolCalls(run.output);
    const linkCheckerCalled = tools.includes("linkCheckerTool");

    return {
      hasLinks,
      linkCheckerCalled,
      urlCount: urlMatches.length,
    };
  })
  .generateScore(({ results }) => {
    const { hasLinks, linkCheckerCalled } = results.preprocessStepResult;

    // No links in response — nothing to validate
    if (!hasLinks) return 1;

    // Has links — score depends on whether the tool was called
    return linkCheckerCalled ? 1 : 0;
  })
  .generateReason(({ results }) => {
    const { hasLinks, linkCheckerCalled, urlCount } =
      results.preprocessStepResult;

    if (!hasLinks) {
      return "No URLs in the response. Link checking not required.";
    }

    if (linkCheckerCalled) {
      return `linkCheckerTool was called to validate ${urlCount} link(s).`;
    }

    return `Response contains ${urlCount} URL(s) that were not validated.`;
  });
```

### How it works

The scorer uses the **preprocess → generateScore → generateReason** pipeline:

1. **preprocess**: Extracts URLs from the assistant message using regex, and checks if `linkCheckerTool` appears in the tool calls
2. **generateScore**: Returns `1` if there are no links or the tool was called, `0` if links exist but the tool was not called
3. **generateReason**: Explains what happened in plain language

---

## Example: Relevant Link Scorer (LLM-as-Judge)

The link checker scorer tells us whether the agent *validated* its links — but not whether the links are actually *relevant* to the user's question. For that, we need an LLM to judge.

For example, if a user asks "How do I create an agent?" and the response includes a link to the memory docs, that's a valid URL but not a relevant one.

This scorer uses all four pipeline steps, with LLM judges in the **preprocess** and **analyze** steps.

### Implementation

Create a new file `src/mastra/scorers/relevant-link-scorer.ts`:

```typescript
import { createScorer } from "@mastra/core/evals";
import {
  getAssistantMessageFromRunOutput,
  getUserMessageFromRunInput,
} from "@mastra/evals/scorers/utils";
import z from "zod";

export const relevantLinkScorer = createScorer({
  id: "relevant-link-scorer",
  description: "Check if the response contains relevant links",
  type: "agent",
})
  .preprocess({
    description: "Extract links from the response",
    judge: {
      model: "openai/gpt-4o-mini",
      instructions: `You are a precise text parser. Your task is to extract all URLs
from a response along with their surrounding context/description.

Return a JSON object with a links array:
{
  "links": [
    { "link": "<the full URL>", "context": "<the description or surrounding text>" }
  ]
}`,
    },
    outputSchema: z.object({
      links: z.array(z.object({ link: z.string(), context: z.string() })),
    }),
    createPrompt: ({ run }) => {
      const assistantMessage =
        getAssistantMessageFromRunOutput(run.output) ?? "";
      return assistantMessage;
    },
  })
  .analyze({
    description: "Check if each link is relevant to the user's question",
    judge: {
      model: "openai/gpt-4.1",
      instructions: `You are an expert evaluator for a documentation assistant.

For each link, determine if it is relevant to the user's question.

A link is RELEVANT if it directly addresses the user's topic or would help them learn more.
A link is NOT RELEVANT if it's about a different topic or seems randomly included.

Return a JSON object:
{
  "verdicts": [
    { "link": "<URL>", "isRelevant": true | false, "reason": "<brief explanation>" }
  ]
}`,
    },
    outputSchema: z.object({
      verdicts: z.array(
        z.object({
          link: z.string(),
          isRelevant: z.boolean(),
          reason: z.string(),
        })
      ),
    }),
    createPrompt: ({ run, results }) => {
      const userMessage = getUserMessageFromRunInput(run.input) ?? "";
      const linksWithContext = results.preprocessStepResult;
      return `
## User Message
${userMessage}

## Links with Context
${linksWithContext.links
  .map((link) => `${link.link} - ${link.context}`)
  .join("\n")}
`;
    },
  })
  .generateScore(({ results }) => {
    const evaluations = results.analyzeStepResult.verdicts;

    // Binary: 1 if all links relevant, 0 if any are irrelevant
    if (evaluations.some((evaluation) => !evaluation.isRelevant)) {
      return 0;
    }
    return 1;
  })
  .generateReason(({ results, score }) => {
    if (score === 1) {
      return "All links are relevant";
    }
    const irrelevantLinks = results.analyzeStepResult.verdicts
      .filter((evaluation) => !evaluation.isRelevant)
      .map((evaluation) => `${evaluation.link} - ${evaluation.reason}`)
      .join("\n");
    return `Found irrelevant links:\n${irrelevantLinks}`;
  });
```

### How it works

This scorer uses **two LLM judges** in sequence:

1. **preprocess** (LLM — `gpt-4o-mini`): Extracts URLs and their surrounding context from the response
2. **analyze** (LLM — `gpt-4.1`): Judges each link's relevance to the user's question
3. **generateScore** (code): Returns `1` if all links are relevant, `0` if any are irrelevant
4. **generateReason** (code): Lists the irrelevant links and the judge's reasoning

Notice how the `analyze` step receives the output of `preprocess` via `results.preprocessStepResult` — each step can build on the previous one.

---

## Exercise: Create Your Own Scorer

Based on the failure modes you identified in the previous section, create a code-based scorer for your most common issue.

Ask yourself:
1. Can this failure be detected with a simple pattern or rule?
2. What text patterns indicate the failure?
3. What should the score be? (typically 0 = failure, 1 = success)

If the answer to #1 is "no", you may need an LLM-as-judge scorer instead.

