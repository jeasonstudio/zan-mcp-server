import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerEVMTools } from './evm/index.js';
// import { registerSolanaTools } from './solana/index.js';
import { ZANContext } from '../utils/types.js';

export const registerTools = (server: McpServer, ctx: ZANContext) => {
  registerEVMTools(server, ctx);
  // registerSolanaTools(server, ctx);
};
