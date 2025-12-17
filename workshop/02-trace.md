# Analyzing Traces

In this section, you'll generate traces from your synthetic queries, explore them using different observability providers, and identify failure modes specific to your application.

## 1. Generate traces

First, start your Mastra server locally:

```bash
pnpm dev
```

Then in a separate terminal, run the trace generation script to send each query to your docs agent:

```bash
pnpm generate-traces
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

## 3. Identify the first failure mode

For each trace, identify the **first failure mode** you notice. A failure mode is any way the agent's response falls short of ideal.

**Why focus on the first failure?** Failures often cascade — an early mistake can trigger a chain of subsequent issues. For example:
- Wrong tool selection → missing context → hallucinated answer
- Misunderstood query → irrelevant search → incomplete response

By fixing the root cause (the first failure), you may eliminate multiple downstream problems at once. This makes debugging more efficient than trying to fix every issue independently.

Go through your traces and for each one, write down the first thing that stands out as problematic.

---

## 4. Catalog all failure modes

Now go through the traces again, this time looking for **all failure modes** present in each response.

For each trace, list every issue you observe:

Common categories you might discover:
- Hallucinated information (made up facts, incorrect API details)
- Incomplete response (missing steps, partial code examples)
- Wrong tool selection (used wrong docs path, missed relevant sections)
- Off-topic response (answered something the user didn't ask)
- Missing context (didn't provide enough background)
- Broken/invalid links
- Outdated information
- Formatting issues

Your failure modes will be specific to your application — don't limit yourself to this list.

---

## 5. Rank failure modes by frequency

Create a ranked list of failure modes from most common to least common:

This ranking tells you where to focus your improvement efforts. The most frequent failure modes should be addressed first — either by improving the agent's instructions, adding better tools, or creating targeted evals.
