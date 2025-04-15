// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/call.ts
import { ToolHandler } from '../../utils/types.js';
import { getZANClient, jsonStringify } from '../../utils/evm.js';
import { z } from 'zod';
import { Hex } from 'viem';

export const name = 'evm_get_nft_metadata';

export const description =
  'Retrieves the metadata that belongs to a particular NFT contract address';

export const paramsSchema = {
  network: z
    .enum(['eth/mainnet', 'bsc/mainnet', 'polygon/mainnet'])
    .optional()
    .default('eth/mainnet')
    .describe('Network name and type. Defaults to eth/mainnet.'),
  nftContractAddress: z
    .string()
    .describe('The NFT contract address, starting with 0x'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', nftContractAddress }) => {
    const client = getZANClient(network, context);

    // 执行调用
    const result = await client.getNFTMetadata({
      nftContractAddress: nftContractAddress as Hex,
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            ...result,
          }),
        },
      ],
    };
  };
