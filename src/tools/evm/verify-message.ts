// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/verify-message.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';
import { Hex } from 'viem';

export const name = 'verify_message';

export const description =
  'Verifies that a message was signed by the provided address';

export const paramsSchema = {
  network,
  address: z.string().describe('The address that signed the message'),
  message: z.string().describe('The original message that was signed'),
  signature: z.string().describe('The signature to verify'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', address, message, signature }) => {
    const client = getPublicClient(network, context);
    const isValid = await client.verifyMessage({
      address: address as unknown as Hex,
      message,
      signature: signature as `0x${string}`,
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            address,
            isValid,
          }),
        },
      ],
    };
  };
