import { createAgentTestRun, createTestMessage } from "@mastra/evals/scorers/utils";
import { relavantLinkScorerDataset } from "./relavant-link-scorer-dataset";
import { describe, it } from "vitest";
import { relevantLinkScorer } from "./relevant-link-scorer";

const testMessages = relavantLinkScorerDataset.map((item) => {
    return createTestMessage({
        role: 'assistant',
        content: item.response,
        toolInvocations: item.toolCalls.map((toolCall) => {
            return {
                toolCallId: toolCall.toolName,
                toolName: toolCall.toolName,
                args: toolCall.toolCallArgs,
                result: {},
                state: 'result',
            }
        })
    })
})


describe('relevantLinkScorer', () => {
    it('should return score 1 when response has no relevant links', async () => {
        const testRun = createAgentTestRun({
            output: [testMessages[0]],
        })

        const result = await relevantLinkScorer.run(testRun);

        console.log(JSON.stringify(result, null, 2))
    }, 10000)
})
