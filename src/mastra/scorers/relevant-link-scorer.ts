import { createScorer } from "@mastra/core/evals";
import {
  getAssistantMessageFromRunOutput,
  getUserMessageFromRunInput,
} from "@mastra/evals/scorers/utils";
import z from "zod";

export const relevantLinkScorer = createScorer({
  id: "relevant-link-scorer",
  description: "Check if the response contains relevant links",
  type: "agent",
})
  .preprocess({
    description: "Extract links from the response",
    judge: {
      model: "openai/gpt-4o-mini",
      instructions: `You are a precise text parser. Your task is to extract all URLs from a response along with their surrounding context/description.
  
OUTPUT FORMAT:
Return a JSON object with a links array:
{
  "links": [
  {
    "link": "<the full URL>",
    "context": "<the description or surrounding text>"
    }
  ]
}

EXAMPLE INPUT:
## Helpful Links
- Quick Start example repo (shows basic agent setup):  
  https://github.com/mastra-ai/mastra/tree/main/examples/quick-start

**Blog Posts**
- "Introducing Output Processors" – background on structured outputs:  
  https://mastra.ai/blog/announcing-output-processors

EXAMPLE OUTPUT:
{
  "links": [
    {
      "link": "https://github.com/mastra-ai/mastra/tree/main/examples/quick-start",
      "context": "Quick Start example repo (shows basic agent setup)"
    },
    {
      "link": "https://mastra.ai/blog/announcing-output-processors",
      "context": "Introducing Output Processors – background on structured outputs"
    }
  ],
}
`,
    },
    outputSchema: z.object({
      links: z.array(z.object({ link: z.string(), context: z.string() })),
    }),
    createPrompt: ({ run }) => {
      const assistantMessage =
        getAssistantMessageFromRunOutput(run.output) ?? "";

      return `
${assistantMessage}
`;
    },
  })
  .analyze({
    description: "Check if the response contains relevant links",
    judge: {
      model: "openai/gpt-5.1",
      instructions: `You are an expert evaluator for a documentation assistant.
    
    TASK: For each link in the response, determine if it is relevant to the user's question.
    
    EVALUATION CRITERIA:
    A link is RELEVANT (true) if:
    - It directly addresses the user's question topic
    - It would help the user learn more about what they asked
    - The link's description/context matches the subject of the question
    
    A link is NOT RELEVANT (false) if:
    - It's about a different topic than the user asked
    - It doesn't help answer the question
    - It seems randomly included or off-topic
    
    INPUT FORMAT:
    You will receive:
    - User Message: The original question
    - Links with Context: Each link with its surrounding description from the response
    
    OUTPUT FORMAT:
    Return a JSON array. For each link, provide:
    {
      "verdicts": [
        {
          "link": "<the URL>",
          "isRelevant": true | false,
          "reason": "<brief explanation>"
        }
      ]
    }
    
    EXAMPLE INPUT:
    ## User Message
    How do I create an agent that returns structured JSON output using a Zod schema?
    
    ## Links with Context
    https://mastra.ai/blog/announcing-output-processors - Introducing Output Processors – background on structured/processed outputs and validation
    https://mastra.ai/docs/memory - Learn about memory and conversation history
    
    EXAMPLE OUTPUT:
    {
      "verdicts": [
        {
          "link": "https://mastra.ai/blog/announcing-output-processors",
          "isRelevant": true,
          "reason": "Context mentions 'structured outputs' and 'validation' which relates to structured JSON with Zod"
        },
        {
          "link": "https://mastra.ai/docs/memory",
          "isRelevant": false,
          "reason": "Memory/conversation history is unrelated to structured JSON output or Zod schemas"
        }
      ]
    }`,
    },
    outputSchema: z.object({
      verdicts: z.array(
        z.object({
          link: z.string(),
          isRelevant: z.boolean(),
          reason: z.string(),
        })
      ),
    }),
    createPrompt: ({ run, results }) => {
      const userMessage = getUserMessageFromRunInput(run.input) ?? "";
      const linksWithContext = results.preprocessStepResult;
      return `
## User Message
${userMessage}

## Links with Context
${linksWithContext.links
  .map((link) => `${link.link} - ${link.context}`)
  .join("\n")}
`;
    },
  })
  .generateScore(({ results }) => {
    const evaluations = results.analyzeStepResult.verdicts;

    if (evaluations.some((evaluation) => !evaluation.isRelevant)) {
      return 0;
    }
    return 1;
  })
  .generateReason(({ results, score }) => {
    if (score === 1) {
      return "All links are relevant";
    }
    const irrelevantLinks = results.analyzeStepResult.verdicts
      .filter((evaluation) => !evaluation.isRelevant)
      .map((evaluation) => `${evaluation.link} - ${evaluation.reason}`)
      .join("\n");
    return `Found ${irrelevantLinks.length} irrelevant links:
    ${irrelevantLinks}`;
  });
