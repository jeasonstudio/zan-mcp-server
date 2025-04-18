// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/sign-transaction.ts
import { ToolHandler } from '../../utils/types.js';
import { getWalletClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'sign_transaction';

export const description =
  'Signs a transaction with the account stored in the wallet, but does not send it.';

export const paramsSchema = {
  network,
  to: z.string().describe('The recipient address of the transaction'),
  value: z
    .string()
    .optional()
    .describe('The value (in wei) to be transferred'),
  data: z
    .string()
    .optional()
    .describe('The transaction data (e.g., smart contract function call)'),
  accessList: z
    .array(
      z.object({
        address: z.string(),
        storageKeys: z.array(z.string()),
      })
    )
    .optional()
    .describe('Access list for EIP-2930 transactions'),
  chainId: z.number().optional().describe('The chain ID'),
  gas: z.string().optional().describe('The gas limit for the transaction'),
  gasPrice: z
    .string()
    .optional()
    .describe('The gas price (in wei) - for legacy transactions'),
  maxFeePerGas: z
    .string()
    .optional()
    .describe('Maximum fee per gas (in wei) - for EIP-1559 transactions'),
  maxPriorityFeePerGas: z
    .string()
    .optional()
    .describe('Maximum priority fee per gas (in wei) - for EIP-1559 transactions'),
  nonce: z.number().optional().describe('The transaction nonce'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({
    network = 'eth/mainnet',
    to,
    value,
    data,
    accessList,
    chainId,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
  }) => {
    const client = getWalletClient(network, context);

    // Prepare transaction parameters
    const txParams: any = {
      to,
    };

    // Add optional parameters if provided
    if (value !== undefined) txParams.value = BigInt(value);
    if (data !== undefined) txParams.data = data;
    if (accessList !== undefined) txParams.accessList = accessList;
    if (chainId !== undefined) txParams.chainId = chainId;
    if (gas !== undefined) txParams.gas = BigInt(gas);
    if (gasPrice !== undefined) txParams.gasPrice = BigInt(gasPrice);
    if (maxFeePerGas !== undefined) txParams.maxFeePerGas = BigInt(maxFeePerGas);
    if (maxPriorityFeePerGas !== undefined)
      txParams.maxPriorityFeePerGas = BigInt(maxPriorityFeePerGas);
    if (nonce !== undefined) txParams.nonce = nonce;

    const signedTransaction = await client.signTransaction(txParams);

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            signedTransaction,
          }),
        },
      ],
    };
  };