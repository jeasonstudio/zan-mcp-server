import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { EvmAgentKit, ACTIONS, zodToMCPShape, Action } from 'evm-agent-kit';
import { getRpcUrl, network } from '../../utils/solana.js';
import { ZANContext } from '../../utils/types.js';
import { handleError } from '../../utils/error.js';

export const registerEVMTools = (server: McpServer, ctx: ZANContext) => {
  // TODO@jeason: 需要根据是否提供 evm private key 来决定注册哪些 tools
  const actions: Action[] = [
    ACTIONS.WALLET_ADDRESS_ACTION,
    
  ];

  for (let index = 0; index < actions.length; index += 1) {
    const action = actions[index];
    const { result: mcpSchema } = zodToMCPShape(action.schema);
    server.tool(
      `evm_${action.name}`,
      action.description,
      { network, ...mcpSchema },
      async (args: any, extra) => {
        try {
          const n = args.network || 'solana/mainnet';
          const rpcUrl = getRpcUrl(n, ctx);

          // Initialize with private key and optional RPC URL
          const agent = new EvmAgentKit(ctx.evmPrivateKey || '', rpcUrl, {});

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
