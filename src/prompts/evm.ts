import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ZANContext } from '../utils/types.js';
import { z } from 'zod';
import { network } from '../utils/evm.js';

export const registerEVMPrompts = (server: McpServer, context: ZANContext) => {
  server.prompt(
    'explore_block',
    'Explore information about a specific block',
    {
      network: network as any,
      blockNumber: z
        .string()
        .optional()
        .describe(
          'Block number to explore. If not provided, latest block will be used.'
        ),
    },
    ({ blockNumber, network = 'ethereum' }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: blockNumber
              ? `Please analyze block #${blockNumber} on the ${network} network and provide information about its key metrics, transactions, and significance.`
              : `Please analyze the latest block on the ${network} network and provide information about its key metrics, transactions, and significance.`,
          },
        },
      ],
    })
  );
};
