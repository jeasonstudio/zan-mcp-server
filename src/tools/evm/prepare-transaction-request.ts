// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/prepare-transaction-request.ts
import { ToolHandler } from '../../utils/types.js';
import { getWalletClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';
import { parseGwei, parseEther } from 'viem';

export const name = 'prepare_transaction_request';

export const description =
  'Prepares a transaction request for signing by populating nonce, gas limit, fee values, and transaction type';

export const paramsSchema = {
  network,
  // Required parameters
  to: z.string().describe('Transaction recipient or contract address'),
  account: z
    .string()
    .optional()
    .describe(
      'Account address to send the transaction from. Default account will be used if not provided'
    ),

  // Optional parameters
  data: z
    .string()
    .optional()
    .describe('Hexadecimal data for calling a function'),
  value: z
    .string()
    .optional()
    .describe('ETH value to send with the transaction'),

  // Gas-related
  gasPrice: z
    .string()
    .optional()
    .describe('Gas price (in Gwei), applies to Legacy transactions'),
  maxFeePerGas: z
    .string()
    .optional()
    .describe(
      'Maximum fee per gas (in Gwei), applies to EIP-1559 transactions'
    ),
  maxPriorityFeePerGas: z
    .string()
    .optional()
    .describe(
      'Maximum priority fee per gas (in Gwei), applies to EIP-1559 transactions'
    ),

  // Other parameters
  nonce: z
    .number()
    .optional()
    .describe('Unique number identifying this transaction'),
  accessList: z
    .array(
      z.object({
        address: z.string(),
        storageKeys: z.array(z.string()),
      })
    )
    .optional()
    .describe('Access list, can be used by EIP-2930 and EIP-1559 transactions'),

  // Parameter selection
  parameters: z
    .array(z.enum(['fees', 'gas', 'nonce', 'type']))
    .optional()
    .describe(
      'Parameters to prepare. For example, ["gas", "nonce"] means only preparing gas and nonce parameters'
    ),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({
    network = 'eth/mainnet',
    to,
    account,
    data,
    value,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    accessList,
    parameters,
  }) => {
    const client = getWalletClient(network, context);

    // Build transaction request object
    const request: any = {
      to,
    };

    // Add account information if the account parameter is provided
    if (account) {
      request.account = account;
    }

    // Add optional parameters if they are provided
    if (data) request.data = data;
    if (value) request.value = parseEther(value);
    if (gasPrice) request.gasPrice = parseGwei(gasPrice);
    if (maxFeePerGas) request.maxFeePerGas = parseGwei(maxFeePerGas);
    if (maxPriorityFeePerGas)
      request.maxPriorityFeePerGas = parseGwei(maxPriorityFeePerGas);
    if (nonce !== undefined) request.nonce = nonce;
    if (accessList) request.accessList = accessList;
    if (parameters) request.parameters = parameters;

    // Prepare the transaction request using prepareTransactionRequest
    const preparedRequest = await client.prepareTransactionRequest(request);

    // Process the returned data
    const result = {
      network,
      preparedRequest,
    };

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify(result),
        },
      ],
    };
  };
