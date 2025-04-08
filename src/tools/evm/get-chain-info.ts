import { z } from 'zod';
import { ToolHandler } from '../types.js';
import { getChainByNetwork, getRpcUrl, network } from './utils.js';
import { createPublicClient, http } from 'viem';

export const name = 'get_evm_chain_info';

export const description = 'Get information about an EVM network';

export const paramsSchema = {
  network,
};

export const handler: ToolHandler<typeof paramsSchema> =
  (apiKey) =>
  async ({ network = 'eth/mainnet' }) => {
    const rpcUrl = getRpcUrl(network, apiKey);
    const chain = getChainByNetwork(network);
    const client = createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
    const blockNumber = await client.getBlockNumber();
    const chainId = await client.getChainId();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              chainId,
              chainName: chain.name,
              currentyName: chain.nativeCurrency.name,
              currentySymbol: chain.nativeCurrency.symbol,
              currentyDecimals: chain.nativeCurrency.decimals,
              blockNumber: blockNumber.toString(10),
            },
            null,
            2
          ),
        },
      ],
    };
  };
