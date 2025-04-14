// filepath: /Users/jeason/Projects/github.com/jeasonstudio/zan-mcp-server/src/tools/evm/get-gas-price.ts
import { ToolHandler } from '../../utils/types.js';
import { getPublicClient, jsonStringify, network } from '../../utils/evm.js';
import { z } from 'zod';

export const name = 'get_gas_price';

export const description = 'Returns the current gas price in wei';

export const paramsSchema = {
  network,
};

export const handler: ToolHandler<typeof paramsSchema> =
  (context) =>
  async ({ network = 'eth/mainnet' }) => {
    const client = getPublicClient(network, context);
    const gasPrice = await client.getGasPrice();

    return {
      content: [
        {
          type: 'text',
          text: jsonStringify({
            network,
            gasPrice,
            formattedGasPrice: `${Number(gasPrice) / 10 ** 9} gwei`,
          }),
        },
      ],
    };
  };
