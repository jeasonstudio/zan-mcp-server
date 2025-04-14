// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/get-balance.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'get_balance';

export const description =
  'Get the balance of an Ethereum address in a specific currency';

export const paramsSchema = {
  network,
  address: z.string().describe('The address to get the balance for'),
  blockNumber: z
    .number()
    .optional()
    .describe('The block number to perform the balance lookup against.'),
  blockTag: z
    .enum(['latest', 'earliest', 'pending', 'safe', 'finalized'])
    .optional()
    .default('latest')
    .describe('The block tag to perform the balance lookup against.'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', address, ...args }) => {
    const client = getPublicClient(network, context);

    const balance = await client.getBalance({
      address: address as `0x${string}`,
      ...(args as any),
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            address,
            balance: balance.toString(),
            formattedBalance: `${balance.toString()} Wei`,
          }),
        },
      ],
    };
  };
