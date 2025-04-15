// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/call.ts
import { ToolHandler } from '../../utils/types.js';
import { getZANClient, jsonStringify } from '../../utils/evm.js';
import { z } from 'zod';
import { Hex } from 'viem';

export const name = 'evm_get_nfts_by_owner';

export const description =
  'Retrieves a list of NFTs that belong to the account wallet address';

export const paramsSchema = {
  network: z
    .enum(['eth/mainnet', 'bsc/mainnet', 'polygon/mainnet'])
    .optional()
    .default('eth/mainnet')
    .describe('Network name and type. Defaults to eth/mainnet.'),
  address: z
    .string()
    .describe('The address of nft owner account, starting with 0x'),
  tokenType: z
    .enum(['ERC721', 'ERC1155'])
    .optional()
    .default('ERC721')
    .describe(
      'Please specify the type of token you query for, e.g. "ERC721", "ERC1155", etc.'
    ),
  limit: z
    .number()
    .optional()
    .default(10)
    .describe('The number of NFTs to return'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({
    network = 'eth/mainnet',
    address,
    tokenType = 'ERC721',
    limit = 10,
  }) => {
    const client = getZANClient(network, context);

    // 执行调用
    const result = await client.getNFTsByOwner({
      address: address as Hex,
      tokenType: tokenType as 'ERC721' | 'ERC1155',
      pageSize: limit,
      pageNumber: 1,
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
