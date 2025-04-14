import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'create_access_list';

export const description = 'Creates an access list for a transaction';

export const paramsSchema = {
  network,
  transaction: z.object({
    to: z.string().optional().describe('The contract address to call'),
    from: z.string().optional().describe('The account to send the transaction from'),
    data: z.string().optional().describe('Transaction data (hex string)'),
    value: z.string().optional().describe('The value in wei to send with the transaction'),
    gasPrice: z.string().optional().describe('The gas price for the transaction in wei'),
    nonce: z.number().optional().describe('The transaction nonce'),
    gas: z.string().optional().describe('The maximum amount of gas for the transaction'),
    chainId: z.number().optional().describe('The chain ID for the transaction')
  }).describe('Transaction object to create access list for'),
  blockNumber: z
    .number()
    .optional()
    .describe('The block number to perform the call against'),
  blockTag: z
    .enum(['latest', 'earliest', 'pending', 'safe', 'finalized'])
    .optional()
    .default('latest')
    .describe('The block tag to perform the call against'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', transaction, ...args }) => {
    const client = getPublicClient(network, context);
    
    const accessList = await client.createAccessList({
      ...transaction,
      ...(args as any),
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            accessList: accessList.accessList,
            gasUsed: accessList.gasUsed,
          }),
        },
      ],
    };
  };