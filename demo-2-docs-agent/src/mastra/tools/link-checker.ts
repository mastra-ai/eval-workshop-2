import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const linkCheckerTool = createTool({
  id: "linkCheckerTool",
  description:
    "CRITICAL: You MUST use this tool to validate ALL URLs before sharing them in your response. Never share URLs without first validating them with this tool. Pass all URLs at once to validate them in a single call.",
  inputSchema: z.object({
    urls: z.array(z.string()).describe("Array of URLs to validate"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        url: z.string(),
        isValid: z.boolean(),
      })
    ).describe("Validation results for each URL"),
  }),
  execute: async (args) => {
    const results: { url: string; isValid: boolean }[] = [];
    for (const url of args.urls) {
      try {
        const response = await fetch(url, { method: "HEAD" });
        results.push({ url, isValid: response.ok });
      } catch (error) {
        results.push({ url, isValid: false });
      }
    }
    return { results };
  },
});
