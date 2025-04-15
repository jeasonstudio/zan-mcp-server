// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/get-logs.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'get_logs';

export const description =
  'Returns a list of event logs matching the provided parameters.';

export const paramsSchema = {
  network,
  address: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('A contract address or a list of contract addresses.'),
  event: z.any().optional().describe('The event in ABI format.'),
  args: z.any().optional().describe('A list of indexed event arguments.'),
  fromBlock: z
    .union([
      z.bigint(),
      z.enum(['latest', 'earliest', 'pending', 'safe', 'finalized']),
    ])
    .optional()
    .describe(
      'Block to start including logs from. Mutually exclusive with blockHash.'
    ),
  toBlock: z
    .union([
      z.bigint(),
      z.enum(['latest', 'earliest', 'pending', 'safe', 'finalized']),
    ])
    .optional()
    .describe(
      'Block to stop including logs from. Mutually exclusive with blockHash.'
    ),
  blockHash: z
    .string()
    .optional()
    .describe(
      'Block hash to include logs from. Mutually exclusive with fromBlock/toBlock.'
    ),
  strict: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'A boolean value that when set to true will strictly propagate all ENS Universal Resolver Contract errors.'
    ),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', ...args }) => {
    const client = getPublicClient(network, context);
    const logs = await client.getLogs(args as any);

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            logs,
          }),
        },
      ],
    };
  };
