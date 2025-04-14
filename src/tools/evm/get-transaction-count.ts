// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/get-transaction-count.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'get_transaction_count';

export const description =
  'Get the number of transactions sent from an address (also known as the nonce)';

export const paramsSchema = {
  network,
  address: z
    .string()
    .describe('The account address to get the transaction count for'),
  blockNumber: z
    .number()
    .optional()
    .describe('The block number to perform the read against.'),
  blockTag: z
    .enum(['latest', 'earliest', 'pending', 'safe', 'finalized'])
    .optional()
    .default('latest')
    .describe('The block tag to perform the read against.'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', address, ...args }) => {
    const client = getPublicClient(network, context);

    const transactionCount = await client.getTransactionCount({
      address: address as `0x${string}`,
      ...(args as any),
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            address,
            transactionCount,
            network,
          }),
        },
      ],
    };
  };
