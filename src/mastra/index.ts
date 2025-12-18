import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { DefaultExporter, Observability } from "@mastra/observability";
import { LangfuseExporter } from "@mastra/langfuse";
import { BraintrustExporter } from "@mastra/braintrust";
import { docsAgent } from "./agents/docs-agent";
import { relevantLinkScorer } from "./scorers/relevant-link-scorer";
import { mdxPathScorer } from "./scorers/mdx-path-scorer";

export const mastra = new Mastra({
  agents: {
    docsAgent,
  },
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: `file:../../mastra.db`,
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: new Observability({
    configs: {
      all: {
        serviceName: "docs-agent-analysis",
        exporters: [
          new DefaultExporter(),
          new LangfuseExporter({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY,
            secretKey: process.env.LANGFUSE_SECRET_KEY,
            baseUrl: process.env.LANGFUSE_BASE_URL,
          }),
          new BraintrustExporter({
            apiKey: process.env.BRAINTRUST_API_KEY,
            projectName: process.env.BRAINTRUST_PROJECT_NAME,
          }),
        ],
      },
    },
  }),
  scorers: {
    relevantLinkScorer: relevantLinkScorer,
    mdxPathScorer: mdxPathScorer,
  },
});
