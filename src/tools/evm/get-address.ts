import { ToolHandler } from '../../utils/types.js';
import { z } from 'zod';
import { getAddress } from 'viem';
import { getChainByNetwork, jsonStringify, network } from '../../utils/evm.js';

export const name = 'get_address';

export const description =
  'Convert an Ethereum address to checksum encoded format (EIP-55), optionally supporting EIP-1191 for chain-specific checksums';

export const paramsSchema = {
  address: z
    .string()
    .describe('The Ethereum address to convert to checksum format'),
  network: network.describe(
    'When provided, applies chain-specific checksumming (EIP-1191)'
  ),
  useChainId: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'Whether to use chain ID from the specified network for EIP-1191 checksumming'
    ),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) => async (args) => {
    try {
      if (!args.address) {
        throw new Error('Address must be provided');
      }

      let chainId: number | undefined;

      // Extract chainId from network if requested
      if (args.useChainId && args.network) {
        try {
          const chain = getChainByNetwork(args.network);
          chainId = chain.id;
        } catch (error) {
          // Silently fail and use standard checksumming without chainId
        }
      }

      const checksumAddress = getAddress(args.address, chainId);

      return {
        content: [
          {
            type: 'text',
            text: jsonStringify({
              originalAddress: args.address,
              checksumAddress,
              usedChainId: chainId ?? null,
            }),
          },
        ],
      };
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to convert address to checksum format');
    }
  };
