import { MCPClient } from "@mastra/mcp";

export const docsMcp = new MCPClient({
  id: 'mastra-docs',
  servers: {
    mastraDocs: {
      command: 'npx',
      args: ['-y', '@mastra/mcp-docs-server@0.0.0-dataset-demo-20260305035339'],
    },
  },
});
