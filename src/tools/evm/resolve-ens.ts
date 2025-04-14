import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';
import { normalize } from 'viem/ens';

export const name = 'resolve_ens';

export const description = 'Resolve an ENS name to an Ethereum address';

export const paramsSchema = {
  network,
  ensName: z.string().describe("ENS name to resolve (e.g., 'vitalik.eth')"),
  blockNumber: z
    .number()
    .optional()
    .describe('The block number to perform the read against.'),
  blockTag: z
    .enum(['latest', 'earliest', 'pending', 'safe', 'finalized'])
    .optional()
    .default('latest')
    .describe('The block tag to perform the read against.'),
  coinType: z
    .number()
    .optional()
    .describe('The ENSIP-9 coin type to fetch the address for'),
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
  async ({ network = 'eth/mainnet', ensName, ...args }) => {
    if (!ensName.includes('.eth')) {
      throw new Error('Invalid ENS name. ENS names must end with .eth');
    }

    const client = getPublicClient(network, context);
    const normalizedEnsName = normalize(ensName);
    const ensAddress = await client.getEnsAddress({
      name: normalizedEnsName,
      ...(args as any),
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            ensName: normalizedEnsName,
            ensAddress,
          }),
        },
      ],
    };
  };
