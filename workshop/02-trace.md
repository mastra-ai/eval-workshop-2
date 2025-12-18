# Generating and Analyzing Traces

In this section, you'll generate traces from your synthetic queries, explore them using different observability providers, and identify errors that you'll later group into failure modes.

## 1. Generate traces

First, start your Mastra server locally:

```bash
pnpm dev
```

Then in a separate terminal, run the trace generation script to send each query to your docs agent:

```bash
pnpm trace-generation
```

This will:
- Load queries from `scripts/queries.json`
- Call the docs agent for each query
- Save results to `scripts/traces.json`
- Generate traces in your configured observability providers

---

## 2. Explore traces in different providers

Open each observability provider to view the generated traces. Compare their interfaces to see which style you prefer.

**Take note:** Which interface do you find most intuitive for debugging? Which provides the best visibility into tool usage and agent reasoning?

---

## 3. Identify the first error

Go through each trace and write down what you notice:

- If the response looks **good**, write "good"
- If there are issues, write down the **first error** you notice

**Why focus on the first error?** Errors often cascade — an early mistake can trigger a chain of subsequent issues. For example:
- Wrong tool selection → missing context → hallucinated answer
- Misunderstood query → irrelevant search → incomplete response

By fixing the root cause (the first error), you may eliminate multiple downstream problems at once.

---

## 4. Group errors into failure modes

Review your list of first errors and group related ones into **failure modes**. A failure mode is a category of similar errors that share a common root cause.

For example, these individual errors:
- "Response says `agents/overview.mdx` instead of URL"
- "Mentions `reference/workflows/step.mdx` file path"
- "Includes path `memory/threads.mdx` in explanation"

...could all be grouped into the failure mode: **"Includes file paths instead of URLs"**

Create your failure mode categories based on the patterns you see in your specific errors.

---

## 6. Rank failure modes by frequency

Create a ranked list of failure modes from most common to least common.

This ranking tells you where to focus your improvement efforts. The most frequent failure modes should be addressed first — either by improving the agent's instructions, adding better tools, or creating targeted scorers.
