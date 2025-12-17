import { createScorer } from "@mastra/core/evals";
import { extractToolCalls } from "@mastra/evals/scorers/utils";

const relevantLinkScorer = createScorer({
  id: "relevant-link-scorer",
  description: "Check if the response contains relevant links",
  type: "agent",
})
  .preprocess(({ run }) => {
    const toolCalls = extractToolCalls(run.output) ?? [];
    
  })
  .generateScore(({ results }) => {
  })
  .generateReason(({ results }) => {})