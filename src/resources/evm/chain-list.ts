import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceHandler, ZANContext } from '../../utils/types.js';
import { networkMap } from '../../utils/evm.js';

export const name = 'evm_chain_list';

export const template = new ResourceTemplate('evm://chains', {
  list: undefined,
});

export const handler: ResourceHandler =
  (ctx: ZANContext) => async (uri, variables, extra) => {
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(Object.keys(networkMap), null, 2),
        },
      ],
    };
  };
