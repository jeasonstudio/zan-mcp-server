import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerEVMResources } from './evm/index.js';
import { ZANContext } from '../utils/types.js';

export const registerResources = (server: McpServer, context: ZANContext) => {
  registerEVMResources(server, context);
};
