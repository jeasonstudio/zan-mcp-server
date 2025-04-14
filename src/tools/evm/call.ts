// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/call.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';
import { formatEther, hexToString, hexToNumber, Hex } from 'viem';

export const name = 'call';

export const description =
  'Execute a new message call immediately without creating a transaction on the blockchain';

export const paramsSchema = {
  network,
  to: z.string().describe('The contract address to call'),
  data: z
    .string()
    .describe(
      'The encoded data to send with the call (e.g., function signature and parameters)'
    ),
  account: z.string().optional().describe('The address to execute the call as'),
  value: z
    .string()
    .optional()
    .describe('The value (in wei) to send with the call'),
  blockNumber: z
    .number()
    .optional()
    .describe('The block number to perform the read against'),
  blockTag: z
    .enum(['latest', 'earliest', 'pending', 'safe', 'finalized'])
    .optional()
    .default('latest')
    .describe('The block tag to perform the read against'),
  gasLimit: z.string().optional().describe('Gas limit for the call'),
  format: z
    .enum(['hex', 'number', 'string', 'ether'])
    .optional()
    .default('hex')
    .describe(
      'Format to convert the result to: hex (default), number, string, or ether'
    ),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', to, data, format = 'hex', ...args }) => {
    const client = getPublicClient(network, context);

    // 执行调用
    const result = await client.call({
      to: to as `0x${string}`,
      data: data as `0x${string}`,
      ...(args as any),
    });

    // 根据指定格式格式化结果
    let formattedResult: any = result;
    try {
      if (format === 'number' && result) {
        formattedResult = hexToNumber(result as unknown as Hex);
      } else if (format === 'string' && result) {
        formattedResult = hexToString(result as unknown as Hex);
      } else if (format === 'ether' && result) {
        formattedResult = formatEther(BigInt(result as unknown as Hex));
      }
    } catch (error) {
      // 如果格式转换失败，保留原始hex结果
      console.error(`Failed to format result as ${format}:`, error);
    }

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            to,
            result: formattedResult,
          }),
        },
      ],
    };
  };
