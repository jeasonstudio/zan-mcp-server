import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ToolDefinition, ZANContext } from '../../utils/types.js';
import { handleError } from '../../utils/error.js';

import * as getNFTMetadata from './get-nft-metadata.js';
import * as getNFTsByOwner from './get-nfts-by-owner.js';
import * as getNFTIDs from './get-nft-ids.js';

const tools: ToolDefinition[] = [getNFTMetadata, getNFTsByOwner, getNFTIDs];

export const registerAdvancedAPITools = (
  server: McpServer,
  ctx: ZANContext
) => {
  tools.forEach((tool) => {
    server.tool(
      `zan_${tool.name}`,
      tool.description,
      tool.paramsSchema,
      async (args: any, extra) => {
        try {
          return tool.handler(ctx)(args, extra);
        } catch (error) {
          return handleError(error);
        }
      }
    );
  });
};
