// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/estimate-gas.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'estimate_gas';

export const description =
  'Estimates gas needed for a transaction to be executed on the blockchain';

export const paramsSchema = {
  network,
  to: z
    .string()
    .optional()
    .describe('The address the transaction is directed to'),
  from: z
    .string()
    .optional()
    .describe('The address the transaction is sent from'),
  data: z
    .string()
    .optional()
    .describe(
      'The encoded data for the transaction (e.g., function signature and parameters)'
    ),
  value: z
    .string()
    .optional()
    .describe('The value (in wei) to be sent with the transaction'),
  nonce: z.number().optional().describe('The nonce of the transaction'),
  gasPrice: z
    .string()
    .optional()
    .describe('The price of gas (in wei) for the transaction'),
  maxFeePerGas: z
    .string()
    .optional()
    .describe('Max fee per gas (in wei) for EIP-1559 transactions'),
  maxPriorityFeePerGas: z
    .string()
    .optional()
    .describe('Max priority fee per gas (in wei) for EIP-1559 transactions'),
  accessList: z
    .array(
      z.object({
        address: z.string(),
        storageKeys: z.array(z.string()),
      })
    )
    .optional()
    .describe('The access list for EIP-2930 transactions'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', ...args }) => {
    const client = getPublicClient(network, context);

    // 格式化参数
    const params: any = {};
    if (args.to) params.to = args.to as `0x${string}`;
    if (args.from) params.from = args.from as `0x${string}`;
    if (args.data) params.data = args.data as `0x${string}`;
    if (args.value) params.value = BigInt(args.value);
    if (args.nonce !== undefined) params.nonce = args.nonce;
    if (args.gasPrice) params.gasPrice = BigInt(args.gasPrice);
    if (args.maxFeePerGas) params.maxFeePerGas = BigInt(args.maxFeePerGas);
    if (args.maxPriorityFeePerGas)
      params.maxPriorityFeePerGas = BigInt(args.maxPriorityFeePerGas);
    if (args.accessList) {
      params.accessList = args.accessList.map((item: any) => ({
        address: item.address as `0x${string}`,
        storageKeys: item.storageKeys.map(
          (key: string) => key as `0x${string}`
        ),
      }));
    }

    // 估算燃气费用
    const gasEstimate = await client.estimateGas(params);

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            gasEstimate: gasEstimate.toString(),
            ...params,
          }),
        },
      ],
    };
  };
