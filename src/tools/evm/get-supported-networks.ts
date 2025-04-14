import { ToolHandler } from '../../utils/types.js';
import { jsonStringify, networkMap } from '../../utils/evm.js';

export const name = 'get_supported_networks';

export const description = 'Get a list of supported EVM networks';

export const paramsSchema = {};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) => async () => {
    const networks = Object.keys(networkMap).map((network) => {
      const [networkName, networkType] = network.split('/');
      return { networkName, networkType };
    });

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify(networks),
        },
      ],
    };
  };
