import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerEVMTools } from './evm/index.js';
// import { registerSolanaTools } from './solana/index.js';
import { ZANContext } from '../utils/types.js';
import { registerAdvancedAPITools } from './advanced-api/index.js';

export const registerTools = (server: McpServer, ctx: ZANContext) => {
  registerEVMTools(server, ctx);
  registerAdvancedAPITools(server, ctx);
  // registerSolanaTools(server, ctx);
};
