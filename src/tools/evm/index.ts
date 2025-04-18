import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ToolDefinition, ZANContext } from '../../utils/types.js';
import { handleError } from '../../utils/error.js';

// public client
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
import * as getLogs from './get-logs.js';

// wallet client
import * as getAddresses from './get-addresses.js';
import * as sendRawTransaction from './send-raw-transaction.js';
import * as sendTransaction from './send-transaction.js';
import * as prepareTransactionRequest from './prepare-transaction-request.js';
import * as signMessage from './sign-message.js';
import * as signTypedData from './sign-typed-data.js';
import * as signTransaction from './sign-transaction.js';

const tools: ToolDefinition[] = [
  // public client
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
  signTypedData,
  signTransaction,
  prepareTransactionRequest,
  sendRawTransaction,
  sendTransaction,
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
