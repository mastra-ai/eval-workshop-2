import { describe, it, expect } from "vitest";
import {
  createTestMessage,
  createAgentTestRun,
} from "@mastra/evals/scorers/utils";
import { linkCheckerScorer } from "./link-checker-scorer";

describe("linkCheckerScorer", () => {
  it("should return score 1 when no links and no tool call", async () => {
    const testRun = createAgentTestRun({
      output: [
        createTestMessage({
          content: "Mastra agents can return structured output using Zod.",
          role: "assistant",
        }),
      ],
    });

    const result = await linkCheckerScorer.run(testRun);
    expect(result.score).toBe(1);
  });

  it("should return score 1 when links present, tool called, all valid", async () => {
    const testRun = createAgentTestRun({
      output: [
        createTestMessage({
          content:
            "Check out https://mastra.ai/docs/agents for more details.",
          role: "assistant",
          toolInvocations: [
            {
              toolCallId: "lc-1",
              toolName: "linkCheckerTool",
              args: { urls: ["https://mastra.ai/docs/agents"] },
              result: {
                results: [
                  { url: "https://mastra.ai/docs/agents", isValid: true },
                ],
              },
              state: "result",
            },
          ],
        }),
      ],
    });

    const result = await linkCheckerScorer.run(testRun);
    expect(result.score).toBe(1);
  });

  it("should return score 1 when links present, tool called, some invalid", async () => {
    const testRun = createAgentTestRun({
      output: [
        createTestMessage({
          content:
            "See https://mastra.ai/docs/agents and https://mastra.ai/docs/bad-page for info.",
          role: "assistant",
          toolInvocations: [
            {
              toolCallId: "lc-2",
              toolName: "linkCheckerTool",
              args: {
                urls: [
                  "https://mastra.ai/docs/agents",
                  "https://mastra.ai/docs/bad-page",
                ],
              },
              result: {
                results: [
                  { url: "https://mastra.ai/docs/agents", isValid: true },
                  { url: "https://mastra.ai/docs/bad-page", isValid: false },
                ],
              },
              state: "result",
            },
          ],
        }),
      ],
    });

    const result = await linkCheckerScorer.run(testRun);
    expect(result.score).toBe(1);
  });

  it("should return score 0 when links present but tool not called", async () => {
    const testRun = createAgentTestRun({
      output: [
        createTestMessage({
          content:
            "Visit https://mastra.ai/docs/agents for documentation.",
          role: "assistant",
        }),
      ],
    });

    const result = await linkCheckerScorer.run(testRun);
    expect(result.score).toBe(0);
  });

  it("should return score 1 when no links but tool called anyway", async () => {
    const testRun = createAgentTestRun({
      output: [
        createTestMessage({
          content: "Mastra is a TypeScript framework for AI agents.",
          role: "assistant",
          toolInvocations: [
            {
              toolCallId: "lc-3",
              toolName: "linkCheckerTool",
              args: { urls: ["https://mastra.ai"] },
              result: {
                results: [
                  { url: "https://mastra.ai", isValid: true },
                ],
              },
              state: "result",
            },
          ],
        }),
      ],
    });

    const result = await linkCheckerScorer.run(testRun);
    expect(result.score).toBe(1);
  });
});
