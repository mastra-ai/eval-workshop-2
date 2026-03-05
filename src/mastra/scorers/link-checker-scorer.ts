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
