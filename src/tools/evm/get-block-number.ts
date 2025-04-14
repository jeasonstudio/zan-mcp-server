// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/get-block-number.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'get_block_number';

export const description =
  'Returns the current block number (height) of the network';

export const paramsSchema = {
  network,
  cacheTime: z
    .number()
    .optional()
    .describe('The time (in ms) that this data can be cached for.'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', ...args }) => {
    const client = getPublicClient(network, context);
    const blockNumber = await client.getBlockNumber(args);

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            blockNumber,
          }),
        },
      ],
    };
  };
