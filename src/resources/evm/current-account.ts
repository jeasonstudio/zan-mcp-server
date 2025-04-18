import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceHandler, ZANContext } from '../../utils/types.js';
import { getAccount, jsonStringify, networkMap } from '../../utils/evm.js';
import { address } from '@solana/kit';

export const name = 'current_account';

export const template = new ResourceTemplate('evm://account', {
  list: undefined,
});

export const handler: ResourceHandler =
  (ctx: ZANContext) => async (uri, variables, extra) => {
    const account = getAccount('eth/mainnet', ctx);

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: jsonStringify({
            address: account.address,
            source: account.source,
            type: account.type,
          }),
        },
      ],
    };
  };
