import { describe, it, expect } from "vitest";
import { createTestMessage, createAgentTestRun } from "@mastra/evals/scorers/utils";
import { mdxPathScorer } from "./mdx-path-scorer";

describe("mdxPathScorer", () => {
  it("should return score 1 when response has no .mdx paths", async () => {
    const testRun = createAgentTestRun({
      output: [
        createTestMessage({
          content: "See https://mastra.ai/docs/agents for details on creating agents.",
          role: "assistant",
        }),
      ],
    });

    const result = await mdxPathScorer.run(testRun);

    expect(result.score).toBe(1);
  });

  it("should return score 0 when response contains .mdx file paths", async () => {
    const testRun = createAgentTestRun({
      output: [
        createTestMessage({
          content: "See agents/overview.mdx for details on creating agents.",
          role: "assistant",
        }),
      ],
    });

    const result = await mdxPathScorer.run(testRun);

    expect(result.score).toBe(0);
  });

  it("should detect multiple .mdx paths in the response", async () => {
    const testRun = createAgentTestRun({
      output: [
        createTestMessage({
          content:
            "Check out workflows/overview.mdx and reference/workflows/step.mdx for more information.",
          role: "assistant",
        }),
      ],
    });

    const result = await mdxPathScorer.run(testRun);

    expect(result.score).toBe(0);
  });

  it("should handle empty response gracefully", async () => {
    const testRun = createAgentTestRun({
      output: [
        createTestMessage({
          content: "",
          role: "assistant",
        }),
      ],
    });

    const result = await mdxPathScorer.run(testRun);

    expect(result.score).toBe(1);
  });

  it("should not match .mdx in the middle of a word", async () => {
    const testRun = createAgentTestRun({
      inputMessages: [
        createTestMessage({ content: "What is MDX?", role: "user" }),
      ],
      output: [
        createTestMessage({
          content: "MDX is a format that lets you use JSX in markdown. Visit https://mdxjs.com for more.",
          role: "assistant",
        }),
      ],
    });

    const result = await mdxPathScorer.run(testRun);

    expect(result.score).toBe(1);
  });
});
