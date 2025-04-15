import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ToolDefinition, ZANContext } from '../../utils/types.js';
import { handleError } from '../../utils/error.js';

import * as getChainInfo from './get-chain-info.js';
import * as resolveEns from './resolve-ens.js';
import * as getSupportedNetworks from './get-supported-networks.js';
import * as getContractAddress from './get-contract-address.js';
import * as getAddress from './get-address.js';
import * as createAccessList from './create-access-list.js';
import * as getBalance from './get-balance.js';
import * as getTransactionCount from './get-transaction-count.js';
import * as getBlock from './get-block.js';
import * as getBlockNumber from './get-block-number.js';
import * as getBlockTransactionCount from './get-block-transaction-count.js';
import * as call from './call.js';
import * as estimateGas from './estimate-gas.js';
import * as getGasPrice from './get-gas-price.js';
import * as verifyMessage from './verify-message.js';
import * as verifyTypedData from './verify-typed-data.js';
import * as getTransaction from './get-transaction.js';
import * as getTransactionReceipt from './get-transaction-receipt.js';
import * as signMessage from './sign-message.js';
import * as getLogs from './get-logs.js';

// wallet client
import * as getAddresses from './get-addresses.js';

const tools: ToolDefinition[] = [
  getChainInfo,
  resolveEns,
  getSupportedNetworks,
  getContractAddress,
  getAddress,
  createAccessList,
  getBalance,
  getTransactionCount,
  getBlock,
  getBlockNumber,
  getBlockTransactionCount,
  call,
  estimateGas,
  getGasPrice,
  verifyMessage,
  verifyTypedData,
  getTransaction,
  getTransactionReceipt,
  getLogs,
  // wallet client
  getAddresses,
  signMessage,
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
