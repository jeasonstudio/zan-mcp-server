// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/sign-typed-data.ts
import { ToolHandler } from '../../utils/types.js';
import { getWalletClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';
import { Hex } from 'viem';

export const name = 'sign_typed_data';

export const description =
  'Signs typed data according to EIP-712 and returns the signature. The account needs to be unlocked.';

export const paramsSchema = {
  network,
  account: z
    .string()
    .describe('The account address to sign the typed data with.'),
  domain: z
    .record(z.any())
    .describe('The domain of the typed data (EIP-712 domain).'),
  types: z
    .record(z.array(z.record(z.any())))
    .describe('The type definitions for the typed data (EIP-712 types).'),
  primaryType: z
    .string()
    .describe('The primary type of the message format (EIP-712 primaryType).'),
  message: z
    .record(z.any())
    .describe('The value of the typed data (EIP-712 message).'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({
    network = 'eth/mainnet',
    account,
    domain,
    types,
    primaryType,
    message,
  }) => {
    const client = getWalletClient(network, context);

    // EIP-712 requires 'EIP712Domain' not to be included in the types to sign
    const { EIP712Domain, ...typesToSign } = types;

    const signature = await client.signTypedData({
      account: account as Hex,
      domain,
      types: typesToSign,
      primaryType,
      message,
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            account,
            signature,
          }),
        },
      ],
    };
  };
