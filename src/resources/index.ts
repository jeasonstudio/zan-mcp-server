import {
  McpServer,
  ToolCallback,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerEVMResources } from './evm/index.js';

export const registerResources = (server: McpServer, apiKey: string) => {
  registerEVMResources(server, apiKey);
};
