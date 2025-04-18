import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceDefinition, ZANContext } from '../../utils/types.js';

import * as chainList from './chain-list.js';
import * as currentAccount from './current-account.js';

const resources: ResourceDefinition[] = [chainList, currentAccount];

export const registerEVMResources = (server: McpServer, ctx: ZANContext) => {
  resources.forEach((resource) => {
    server.resource(
      `evm_${resource.name}`,
      resource.template,
      resource.handler(ctx)
    );
  });
};
