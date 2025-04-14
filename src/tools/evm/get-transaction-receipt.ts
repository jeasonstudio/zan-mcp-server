// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/get-transaction-receipt.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'get_transaction_receipt';

export const description =
  'Gets the transaction receipt for a given transaction hash';

export const paramsSchema = {
  network,
  hash: z.string().describe('Hash of the transaction'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', hash }) => {
    const client = getPublicClient(network, context);
    const receipt = await client.getTransactionReceipt({
      hash: hash as `0x${string}`,
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            hash,
            receipt,
          }),
        },
      ],
    };
  };
