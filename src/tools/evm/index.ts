import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ToolDefinition, ZANContext } from '../../utils/types.js';
import { handleError } from '../../utils/error.js';

import * as getChainInfo from './get-chain-info.js';
import * as resolveEns from './resolve-ens.js';
import * as getSupportedNetworks from './get-supported-networks.js';
import * as getContractAddress from './get-contract-address.js';

const tools: ToolDefinition[] = [
  getChainInfo,
  resolveEns,
  getSupportedNetworks,
  getContractAddress,
];

export const registerEVMTools = (server: McpServer, ctx: ZANContext) => {
  tools.forEach((tool) => {
    server.tool(
      `evm_${tool.name}`,
      tool.description,
      tool.paramsSchema,
      async (args: any, extra) => {
        try {
          return tool.handler(ctx)(args, extra);
        } catch (error) {
          return handleError(error);
        }
      }
    );
  });
};
