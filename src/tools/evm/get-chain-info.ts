import { ToolHandler } from '../../utils/types.js';
import {
  getChainByNetwork,
  getRpcUrl,
  jsonStringify,
  network,
} from '../../utils/evm.js';

export const name = 'get_chain_info';

export const description = 'Get information about an EVM network';

export const paramsSchema = {
  network,
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet' }) => {
    const rpcUrl = getRpcUrl(network, context);
    const chain = getChainByNetwork(network);

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            ...chain,
            rpcUrls: {
              default: {
                http: [rpcUrl],
              },
            },
          }),
        },
      ],
    };
  };
