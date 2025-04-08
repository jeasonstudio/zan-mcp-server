import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ToolDefinition } from '../types.js';
import * as getChainInfo from './get-chain-info.js';

const tools: ToolDefinition[] = [getChainInfo];

export const registerEVMTools = (server: McpServer, apiKey: string) => {
  tools.forEach((tool) => {
    server.tool(
      tool.name,
      tool.description,
      tool.paramsSchema,
      async (args: any, extra) => {
        try {
          return tool.handler(apiKey)(args, extra);
        } catch (error) {
          // TODO: handle error properly
          console.error('Error in tool handler:', error);
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Error: ${JSON.stringify(error)}`,
              },
            ],
          };
        }
      }
    );
  });
};
