import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { DefaultExporter, Observability } from "@mastra/observability";
import { docsAgent } from "./agents/docs-agent";
import { relevantLinkScorer } from "./scorers/relevant-link-scorer";
import { mdxPathScorer } from "./scorers/mdx-path-scorer";
import { linkCheckerScorer } from "./scorers/link-checker-scorer";

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
        ],
      },
    },
  }),
  scorers: {
    relevantLinkScorer: relevantLinkScorer,
    mdxPathScorer: mdxPathScorer,
    linkCheckerScorer: linkCheckerScorer,
  },
});
