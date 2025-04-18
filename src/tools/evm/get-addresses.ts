import { ToolHandler } from '../../utils/types.js';
import { getAccount, jsonStringify, network } from '../../utils/evm.js';

export const name = 'get_addresses';

export const description =
  'Returns a list of account addresses owned by the wallet or client.';

export const paramsSchema = {
  network,
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet' }) => {
    const account = getAccount(network, context);

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            accounts: [account.address],
          }),
        },
      ],
    };
  };
