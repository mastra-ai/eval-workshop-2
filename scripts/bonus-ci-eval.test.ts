import { describe, it, expect } from "vitest";
import { mastra } from "../src/mastra/index";
import { linkCheckerScorer } from "../src/mastra/scorers/link-checker-scorer";

const DATASET_ID = "0bb79d2f-ec6d-4782-910f-05bcb3d1678b";

describe("CI: link checker eval", () => {
  it("every dataset item should have linkCheckerTool called when links are present", async () => {
    const dataset = await mastra.datasets.get({ id: DATASET_ID });
    const experiment = await dataset.startExperiment({
      name: `ci-link-checker-${new Date().toISOString()}`,
      targetType: "agent",
      targetId: "docsAgent",
      scorers: [linkCheckerScorer],
      maxConcurrency: 3,
    });

    expect(experiment.failedCount).toBe(0);

    for (const result of experiment.results) {
      const linkScore = result.scores.find(
        (s) => s.scorerId === "link-checker-scorer",
      );
      expect(linkScore?.score, `Failed for: ${String(result.input).slice(0, 80)}`).toBe(1);
    }
  }, 120_000);
});
