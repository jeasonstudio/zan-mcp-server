import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceDefinition, ZANContext } from '../../utils/types.js';
import * as chainList from './chain-list.js';

const resources: ResourceDefinition[] = [chainList];

export const registerEVMResources = (server: McpServer, ctx: ZANContext) => {
  resources.forEach((resource) => {
    server.resource(resource.name, resource.template, resource.handler(ctx));
  });
};
