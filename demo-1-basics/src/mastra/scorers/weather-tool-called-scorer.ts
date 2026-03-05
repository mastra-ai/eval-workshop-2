import { z } from "zod";
import { createScorer } from "@mastra/core/evals";
import { createToolCallAccuracyScorerCode } from "@mastra/evals/scorers/prebuilt";
import {
  getAssistantMessageFromRunOutput,
  getUserMessageFromRunInput,
} from "@mastra/evals/scorers/utils";

// Custom implementation
export const weatherToolCalledScorer = createScorer({
  id: "weather-tool-called-scorer",
  name: "Weather Tool Called Scorer",
  description: "Checks if the weatherTool was called",
  type: "agent",
})
  .preprocess(({ run }) => {
    console.log("[preprocess] Starting scorer evaluation");
    console.log(
      "[preprocess] Run output:",
      JSON.stringify(run.output, null, 2),
    );
    return {};
  })
  .generateScore(({ run }) => {
    const wasCalled = (run.output || []).some((message) =>
      (message?.content?.toolInvocations || []).some(
        (invocation) => invocation.toolName === "weatherTool",
      ),
    );
    console.log("[generateScore] weatherTool called:", wasCalled);
    return wasCalled ? 1 : 0;
  })
  .generateReason(({ score }) => {
    const reason =
      score === 1 ? "weatherTool was called" : "weatherTool was not called";
    console.log("[generateReason] Reason:", reason);
    return reason;
  });

// // Built-in equivalent
// export const weatherToolCalledScorer = createToolCallAccuracyScorerCode({
//   expectedTool: "weatherTool",
//   strictMode: false,
// });

// LLM-as-judge scorer
export const actionabilityScorer = createScorer({
  id: "actionability-scorer",
  name: "Response Actionability",
  description:
    "Evaluates whether the response helps the user make a decision or take action",
  type: "agent",
  judge: {
    model: "openai/gpt-4o-mini",
    instructions:
      "You evaluate weather assistant responses for actionability. " +
      "A good response doesn't just state facts—it helps the user decide what to do.",
  },
})
  .preprocess(({ run }) => {
    const userMessage = getUserMessageFromRunInput(run.input) || "";
    const assistantMessage = getAssistantMessageFromRunOutput(run.output) || "";
    return { userMessage, assistantMessage };
  })
  .analyze({
    description: "Check if the response provides a recommendation",
    outputSchema: z.object({
      providesRecommendation: z.boolean(),
      reasoning: z.string(),
    }),
    createPrompt: ({ results }) => `
Does this weather assistant response provide a recommendation or suggestion for what the user should do?

User: "${results.preprocessStepResult.userMessage}"
Assistant: "${results.preprocessStepResult.assistantMessage}"

A recommendation is something like "bring an umbrella" or "great day for a hike".
Just stating facts like "it's 72°F" is not a recommendation.
`,
  })
  .generateScore(({ results }) => {
    return results.analyzeStepResult?.providesRecommendation ? 1 : 0;
  })
  .generateReason(({ results }) => {
    return (
      results.analyzeStepResult?.reasoning || "Could not analyze response."
    );
  });

// Scorer that uses ground truth
// Dataset item would have:
//   input: "What is the weather in London?"
//   groundTruth: "London"  <-- the city we expect to see in the response
// export const mentionsCityScorer = createScorer({
//   id: "mentions-city-scorer",
//   name: "Mentions Expected City",
//   description:
//     "Checks if the response mentions the expected city from ground truth",
//   type: "agent",
// })
//   .preprocess(({ run }) => {
//     // groundTruth comes from the dataset
//     const response = getAssistantMessageFromRunOutput(run.output) || "";
//     const expectedCity = (run.groundTruth as string) || "";
//
//     console.log("[preprocess] Expected city (ground truth):", expectedCity);
//     console.log("[preprocess] Agent response:", response);
//
//     return { response, expectedCity };
//   })
//   .generateScore(({ results }) => {
//     const { response, expectedCity } = results.preprocessStepResult;
//     if (!expectedCity) return 0;
//
//     const mentioned = response
//       .toLowerCase()
//       .includes(expectedCity.toLowerCase());
//     console.log("[generateScore] City mentioned:", mentioned);
//     return mentioned ? 1 : 0;
//   })
//   .generateReason(({ results, score }) => {
//     const { expectedCity } = results.preprocessStepResult;
//     const reason =
//       score === 1
//         ? `Response mentions "${expectedCity}"`
//         : `Response does not mention "${expectedCity}"`;
//     console.log("[generateReason]", reason);
//     return reason;
//   });
//
