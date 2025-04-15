import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';
import { normalize } from 'viem/ens';

export const name = 'resolve_ens';

export const description =
  "Resolve an ENS name to an Ethereum address and it' metadata";

export const paramsSchema = {
  network,
  ensName: z.string().describe("ENS name to resolve (e.g., 'vitalik.eth')"),
  blockNumber: z
    .number()
    .optional()
    .describe('The block number to perform the read against.'),
  blockTag: z
    .enum(['latest', 'earliest', 'pending', 'safe', 'finalized'])
    .optional()
    .default('latest')
    .describe('The block tag to perform the read against.'),
  coinType: z
    .number()
    .optional()
    .describe('The ENSIP-9 coin type to fetch the address for'),
  strict: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'A boolean value that when set to true will strictly propagate all ENS Universal Resolver Contract errors.'
    ),
};

/**
 * 获取远程图片并转换为 base64
 * @param url 图片的 URL
 * @returns base64 格式的图片数据
 */
async function fetchImageAsBase64(url: string): Promise<[string, string]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    // 获取 MIME 类型，默认为 image/png
    const contentType = response.headers.get('content-type') || 'image/png';

    return [contentType, `data:${contentType};base64,${base64Data}`];
  } catch (error) {
    console.error(`Error fetching image as base64: ${error}`);
    return ['', ''];
  }
}

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet', ensName, ...args }) => {
    if (!ensName.includes('.eth')) {
      throw new Error('Invalid ENS name. ENS names must end with .eth');
    }

    const client = getPublicClient(network, context);
    const normalizedEnsName = normalize(ensName);
    const ensAddress = await client.getEnsAddress({
      ...(args as any),
      name: normalizedEnsName,
    });

    const ensAvatarUri = await client.getEnsAvatar({
      ...(args as any),
      name: normalizedEnsName,
    });

    const result = jsonStringify({
      ensName: normalizedEnsName,
      ensAddress,
      ensAvatarUri,
    });

    // if (ensAvatarUri) {
    //   // 获取图片并转换为 base64
    //   const [mimeType, base64Image] = await fetchImageAsBase64(ensAvatarUri);

    //   return {
    //     content: [
    //       {
    //         type: 'text',
    //         text: result,
    //       },
    //       {
    //         type: 'image',
    //         data: base64Image,
    //         mimeType, // 使用图片的实际 MIME 类型
    //       },
    //     ],
    //   };
    // }

    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  };
