import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ZANContext } from '../utils/types.js';
import { registerEVMPrompts } from './evm.js';

export const registerPrompts = (server: McpServer, context: ZANContext) => {
  registerEVMPrompts(server, context);
};
