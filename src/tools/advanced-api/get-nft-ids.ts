import { ToolHandler } from '../../utils/types.js';
import { getZANClient, jsonStringify } from '../../utils/evm.js';
import { z } from 'zod';
import { Hex } from 'viem';

export const name = 'evm_get_nft_ids';

export const description = 'Retrieves the tokenId list of NFT token address';

export const paramsSchema = {
  network: z
    .enum(['eth/mainnet', 'bsc/mainnet', 'polygon/mainnet'])
    .optional()
    .default('eth/mainnet')
    .describe('Network name and type. Defaults to eth/mainnet.'),
  contractAddress: z
    .string()
    .describe('The contract address, starting with 0x'),
  topN: z
    .number()
    .optional()
    .default(10)
    .describe('The number of NFT IDs to return'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', contractAddress, topN = 10 }) => {
    const client = getZANClient(network, context);

    // 执行调用
    const result = await client.getNFTIDs({
      contractAddress: contractAddress as Hex,
      topN,
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            tokenIdList: result,
          }),
        },
      ],
    };
  };
