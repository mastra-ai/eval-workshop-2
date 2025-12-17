import { MCPClient } from "@mastra/mcp";

export const docsMcp = new MCPClient({
  id: 'mastra-docs',
  servers: {
    mastraDocs: {
      command: 'npx',
      args: ['-y', '@mastra/mcp-docs-server@latest'],
    },
  },
});
