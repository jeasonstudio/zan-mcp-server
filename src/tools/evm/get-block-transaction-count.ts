// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/get-block-transaction-count.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';
import { GetBlockTransactionCountParameters, Hash } from 'viem';

export const name = 'get_block_transaction_count';

export const description = 'Returns the number of transactions in a block';

export const paramsSchema = {
  network,
  blockHash: z
    .string()
    .optional()
    .describe('The block hash to get the transaction count for'),
  blockNumber: z
    .number()
    .optional()
    .describe('The block number to get the transaction count for'),
  blockTag: z
    .enum(['latest', 'earliest', 'pending', 'safe', 'finalized'])
    .optional()
    .default('latest')
    .describe('The block tag to get the transaction count for'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', blockHash, blockNumber, blockTag }) => {
    const client = getPublicClient(network, context);

    // 检查参数确保至少提供了一个区块标识符
    if (!blockHash && blockNumber === undefined && !blockTag) {
      blockTag = 'latest'; // 默认使用最新区块
    }

    const params: GetBlockTransactionCountParameters = {};

    if (blockHash) {
      params.blockHash = blockHash as Hash;
    } else if (blockNumber !== undefined) {
      params.blockNumber = BigInt(blockNumber);
    } else if (blockTag) {
      params.blockTag = blockTag;
    }

    const transactionCount = await client.getBlockTransactionCount(params);

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            transactionCount: transactionCount.toString(),
            // 返回所使用的区块标识符信息
            blockInfo: blockHash
              ? { blockHash }
              : blockNumber !== undefined
              ? { blockNumber: blockNumber.toString() }
              : { blockTag },
          }),
        },
      ],
    };
  };
