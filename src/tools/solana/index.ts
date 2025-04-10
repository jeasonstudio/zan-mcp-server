import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  SolanaAgentKit,
  ACTIONS,
  zodToMCPShape,
  Action,
} from 'solana-agent-kit';
import { getRpcUrl, network } from '../../utils/solana.js';
import { ZANContext } from '../../utils/types.js';
import { handleError } from '../../utils/error.js';

export const registerSolanaTools = (server: McpServer, ctx: ZANContext) => {
  // TODO@jeason: 需要根据是否提供 solana private key 来决定注册哪些 tools
  const actions: Action[] = [...Object.values(ACTIONS)];

  for (let index = 0; index < actions.length; index += 1) {
    const action = actions[index];
    const { result: mcpSchema } = zodToMCPShape(action.schema);
    server.tool(
      `solana_${action.name}`,
      action.description,
      { network, ...mcpSchema },
      async (args: any, extra) => {
        try {
          const n = args.network || 'solana/mainnet';
          const rpcUrl = getRpcUrl(n, ctx);

          // Initialize with private key and optional RPC URL
          const agent = new SolanaAgentKit(
            ctx.solanaPrivateKey || '',
            rpcUrl,
            {}
          );

          const content = await action.handler(agent, args);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(content, null, 2),
              },
            ],
          };
        } catch (error) {
          return handleError(error);
        }
      }
    );
  }
};
