// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/verify-typed-data.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';
import { Hex } from 'viem';

export const name = 'verify_typed_data';

export const description =
  'Verifies that an EIP-712 typed data was signed by the provided address';

export const paramsSchema = {
  network,
  address: z.string().describe('The address that signed the typed data'),
  domain: z
    .record(z.any())
    .describe(
      'The domain data for the typed data (name, version, chainId, etc.)'
    ),
  types: z
    .record(
      z.array(
        z.object({
          name: z.string(),
          type: z.string(),
        })
      )
    )
    .describe('The type definitions for the structured data'),
  primaryType: z.string().describe('The primary type to verify'),
  message: z.record(z.any()).describe('The message content of the typed data'),
  signature: z.string().describe('The signature to verify'),
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({
    network = 'eth/mainnet',
    address,
    domain,
    types,
    primaryType,
    message,
    signature,
  }) => {
    const client = getPublicClient(network, context);

    // 需要移除 types 中的 EIP712Domain
    const typesWithoutDomain = { ...types };
    delete typesWithoutDomain.EIP712Domain;

    const isValid = await client.verifyTypedData({
      address: address as Hex,
      domain,
      types: typesWithoutDomain as any,
      primaryType,
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
