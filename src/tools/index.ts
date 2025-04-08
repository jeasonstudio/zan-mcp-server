import {
  McpServer,
  ToolCallback,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerEVMTools } from './evm/index.js';

export const registerTools = (server: McpServer, apiKey: string) => {
  registerEVMTools(server, apiKey);
};
