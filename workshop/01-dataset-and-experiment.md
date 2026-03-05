# Creating a Dataset and Running an Experiment

In this section, you'll create a dataset of test queries, run an experiment against your docs agent, and analyze the results to identify failure modes.

## 1. Start Mastra Studio

```bash
pnpm dev
```

Open Mastra Studio at `http://localhost:4111`.

---

## 2. Create a dataset

In Studio, navigate to the **Datasets** section and create a new dataset:

- **Name**: Give it a descriptive name (e.g., "docs-agent-queries")
- **Description**: Optional — describe what the dataset tests

Then add items to the dataset. Each item needs an **input** — the query you want to send to the agent. For example:

- "How do I create an agent in Mastra?"
- "What's the difference between agent.generate() and agent.stream()?"
- "How do I add memory to my agent?"

Add 10-20 queries that cover different feature areas and query types (implementation, conceptual, debugging, etc.).

You can also import pre-made queries from the included CSV file: **`csv/queries.csv`**. In Studio, use the **Import CSV** option when adding items to your dataset.

---

## 3. Run an experiment

Once your dataset has items, run an experiment:

1. Go to your dataset in Studio
2. Click **Run Experiment**
3. Select **Agent** as the target type
4. Select **docsAgent** as the target
5. Start the experiment

The experiment will send each dataset item to the agent and record the full response, including tool calls and reasoning.

---

## 4. Review experiment results

After the experiment completes, explore the results in Studio. For each item you can see:

- The user query that was sent
- Which tools the agent called and in what order
- The agent's reasoning and final response
- Any errors or unexpected behavior

---

## 5. Identify the first error

Go through each result and write down what you notice:

- If the response looks **good**, write "good"
- If there are issues, write down the **first error** you notice

**Why focus on the first error?** Errors often cascade — an early mistake can trigger a chain of subsequent issues. For example:
- Wrong tool selection → missing context → hallucinated answer
- Misunderstood query → irrelevant search → incomplete response

By fixing the root cause (the first error), you may eliminate multiple downstream problems at once.

---

## 6. Group errors into failure modes

Review your list of first errors and group related ones into **failure modes**. A failure mode is a category of similar errors that share a common root cause.

For example, these individual errors:
- "Response says `agents/overview.mdx` instead of URL"
- "Mentions `reference/workflows/step.mdx` file path"
- "Includes path `memory/threads.mdx` in explanation"

...could all be grouped into the failure mode: **"Includes file paths instead of URLs"**

Create your failure mode categories based on the patterns you see in your specific errors.

---

## 7. Rank failure modes by frequency

Create a ranked list of failure modes from most common to least common.

This ranking tells you where to focus your improvement efforts. The most frequent failure modes should be addressed first — either by improving the agent's instructions, adding better tools, or creating targeted scorers.
