// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/send-transaction.ts
import { ToolHandler } from '../../utils/types.js';
import {
  getAccount,
  getWalletClient,
  jsonStringify,
  network,
} from '../../utils/evm.js';
import { z } from 'zod';
import { Hex } from 'viem';

export const name = 'send_transaction';

export const description =
  'Signs and sends a transaction to the network. Returns the transaction hash.';

export const paramsSchema = {
  network,
  to: z.string().describe('The recipient address of the transaction'),
  value: z
    .string()
    .optional()
    .describe('The value (in wei) to be sent with the transaction'),
  data: z.string().optional().describe('The transaction data (hex encoded)'),
  gas: z.string().optional().describe('Gas limit for the transaction'),
  gasPrice: z
    .string()
    .optional()
    .describe('Gas price for the transaction in wei'),
  maxFeePerGas: z
    .string()
    .optional()
    .describe('Maximum fee per gas for EIP-1559 transactions'),
  maxPriorityFeePerGas: z
    .string()
    .optional()
    .describe('Maximum priority fee per gas for EIP-1559 transactions'),
  nonce: z.number().optional().describe('Nonce for the transaction'),
  chain: z
    .string()
    .optional()
    .describe('Chain ID for the transaction (overrides network chain ID)'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({
    network = 'eth/mainnet',
    to,
    value,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    chain,
  }) => {
    if (!to.startsWith('0x')) {
      throw new Error(
        'Invalid recipient address. Must be a hex string starting with 0x'
      );
    }

    const client = getWalletClient(network, context);
    const account = getAccount(network, context);

    // Prepare transaction request
    const transactionRequest: any = {
      to: to as Hex,
      account,
    };

    // Add optional parameters if provided
    if (value) transactionRequest.value = BigInt(value);
    if (data) transactionRequest.data = data as Hex;
    if (gas) transactionRequest.gas = BigInt(gas);
    if (gasPrice) transactionRequest.gasPrice = BigInt(gasPrice);
    if (maxFeePerGas) transactionRequest.maxFeePerGas = BigInt(maxFeePerGas);
    if (maxPriorityFeePerGas)
      transactionRequest.maxPriorityFeePerGas = BigInt(maxPriorityFeePerGas);
    if (nonce !== undefined) transactionRequest.nonce = nonce;
    if (chain) transactionRequest.chain = Number(chain);

    // Send transaction
    const transactionHash = await client.sendTransaction(transactionRequest);

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            transactionHash,
            from: account.address,
            to,
          }),
        },
      ],
    };
  };
