import { createScorer } from "@mastra/core/evals";
import { getAssistantMessageFromRunOutput } from "@mastra/evals/scorers/utils";

export const mdxPathScorer = createScorer({
  id: "mdx-path-scorer",
  description: "Check if the response contains .mdx file paths instead of proper URLs",
  type: "agent",
})
  .preprocess(({ run }) => {
    // Extract the response text
    const assistantMessage = getAssistantMessageFromRunOutput(run.output) ?? ""

    // Find all .mdx file paths in the response
    const mdxPattern = /[\w\-\/]+\.mdx/gi;
    const mdxMatches = assistantMessage.match(mdxPattern);
    return {
      mdxPaths: mdxMatches,
    };
  })
  .generateScore(({ results }) => {
    const mdxPaths = results.preprocessStepResult.mdxPaths;
    // Score 1 = no .mdx paths (good), Score 0 = has .mdx paths (bad)
    return !mdxPaths || mdxPaths.length === 0 ? 1 : 0;
  })
  .generateReason(({ results }) => {
    const { mdxPaths } = results.preprocessStepResult;

    if (!mdxPaths || mdxPaths.length === 0) {
      return "No .mdx file paths found. Response uses proper URLs.";
    }

    return `Found ${mdxPaths.length} .mdx file path(s) that should be URLs: ${mdxPaths.join(", ")}`;
  });

