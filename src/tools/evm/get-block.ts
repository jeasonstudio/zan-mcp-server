// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/get-block.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'get_block';

export const description =
  'Retrieves a block from the blockchain with the provided block number or hash';

export const paramsSchema = {
  network,
  blockNumber: z
    .number()
    .optional()
    .describe('The number of the block to retrieve.'),
  blockHash: z
    .string()
    .optional()
    .describe('The hash of the block to retrieve.'),
  blockTag: z
    .enum(['latest', 'earliest', 'pending', 'safe', 'finalized'])
    .optional()
    .default('latest')
    .describe('The tag of the block to retrieve.'),
  includeTransactions: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'Whether or not to include the transactions in the block response.'
    ),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', ...args }) => {
    const client = getPublicClient(network, context);

    // 用户必须提供 blockNumber、blockHash 或 blockTag 中的至少一个
    if (!args.blockNumber && !args.blockHash && !args.blockTag) {
      args.blockTag = 'latest';
    }

    // 根据参数确定区块标识符
    const blockIdentifier = args.blockHash
      ? { blockHash: args.blockHash as `0x${string}` }
      : args.blockNumber
      ? { blockNumber: BigInt(args.blockNumber) }
      : { blockTag: args.blockTag };

    // 调用 viem 的 getBlock 方法
    const block = await client.getBlock({
      ...blockIdentifier,
      includeTransactions: args.includeTransactions,
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            block: {
              hash: block.hash,
              number: block.number?.toString(),
              timestamp: block.timestamp.toString(),
              parentHash: block.parentHash,
              nonce: block.nonce,
              difficulty: block.difficulty?.toString() || '0',
              gasLimit: block.gasLimit.toString(),
              gasUsed: block.gasUsed.toString(),
              miner: block.miner,
              extraData: block.extraData,
              baseFeePerGas: block.baseFeePerGas?.toString(),
              transactionsCount: block.transactions.length,
              transactions: args.includeTransactions
                ? block.transactions
                : undefined,
            },
          }),
        },
      ],
    };
  };
