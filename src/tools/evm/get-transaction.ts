// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/get-transaction.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'get_transaction';

export const description =
  'Gets information about a transaction with the given hash';

export const paramsSchema = {
  network,
  hash: z.string().describe('Hash of the transaction'),
  blockHash: z
    .string()
    .optional()
    .describe(
      'The block hash of the block where the transaction was included.'
    ),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', hash, ...args }) => {
    const client = getPublicClient(network, context);
    const transaction = await client.getTransaction({
      hash: hash as `0x${string}`,
      ...(args as any),
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            hash,
            transaction,
          }),
        },
      ],
    };
  };
