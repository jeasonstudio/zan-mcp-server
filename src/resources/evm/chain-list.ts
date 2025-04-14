import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceHandler, ZANContext } from '../../utils/types.js';
import { jsonStringify, networkMap } from '../../utils/evm.js';

export const name = 'evm_chain_list';

export const template = new ResourceTemplate('evm://chains', {
  list: undefined,
});

export const handler: ResourceHandler =
  (ctx: ZANContext) => async (uri, variables, extra) => {
    const chains = Object.entries(networkMap).map(([network, chain]) => {
      const [networkName, networkType] = network.split('/');
      return {
        network,
        networkName,
        networkType,
        chainId: chain.id,
        name: chain.name,
        nativeCurrency: chain.nativeCurrency,
      };
    });

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: jsonStringify(chains),
        },
      ],
    };
  };
