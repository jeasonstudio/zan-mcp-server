// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/send-raw-transaction.ts
import { ToolHandler } from '../../utils/types.js';
import { getWalletClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';
import { Hex } from 'viem';

export const name = 'send_raw_transaction';

export const description =
  'Sends a signed transaction to the network. Returns the transaction hash.';

export const paramsSchema = {
  network,
  serializedTransaction: z
    .string()
    .describe('The signed serialized transaction as a hex string'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', serializedTransaction }) => {
    if (!serializedTransaction.startsWith('0x')) {
      throw new Error(
        'Invalid serialized transaction. Must be a hex string starting with 0x'
      );
    }

    const client = getWalletClient(network, context);
    const transactionHash = await client.sendRawTransaction({
      serializedTransaction: serializedTransaction as Hex,
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            transactionHash,
          }),
        },
      ],
    };
  };
