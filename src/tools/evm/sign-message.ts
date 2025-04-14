// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/sign-message.ts
import { ToolHandler } from '../../utils/types.js';
import {
  getAccount,
  getWalletClient,
  jsonStringify,
  network,
} from '../../utils/evm.js';
import { z } from 'zod';
import { SignableMessage } from 'viem';

export const name = 'sign_message';

export const description =
  'Signs a message using the wallet account and returns the signature';

export const paramsSchema = {
  network,
  message: z
    .union([
      z.string().describe('The UTF-8 message to sign'),
      z.object({
        raw: z
          .string()
          .describe('The hex data representation of the message to sign'),
      }),
    ])
    .describe('Message to sign, either as a string or raw hex data'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', message }) => {
    const client = getWalletClient(network, context);
    const account = getAccount(network, context);

    const signature = await client.signMessage({
      account,
      message: message as unknown as SignableMessage,
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            account: account.address,
            message:
              typeof message === 'string'
                ? message
                : '0x' +
                  Buffer.from(message.raw.slice(2), 'hex').toString('hex'),
            signature,
          }),
        },
      ],
    };
  };
