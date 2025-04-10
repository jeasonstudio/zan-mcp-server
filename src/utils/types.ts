import {
  ReadResourceTemplateCallback,
  ToolCallback,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { ZodRawShape } from 'zod';

export type ToolHandler<Args extends undefined | ZodRawShape = undefined> = (
  ctx: ZANContext
) => ToolCallback<Args>;

export interface ToolDefinition {
  name: string;
  description: string;
  paramsSchema: ZodRawShape;
  handler: ToolHandler<any>;
}

export type ResourceHandler = (ctx: ZANContext) => ReadResourceTemplateCallback;

export interface ResourceDefinition {
  name: string;
  template: ResourceTemplate;
  handler: ResourceHandler;
}

export interface ZANContext {
  apiKey: string;
  endpoint: string;
  evmPrivateKey: string | null;
  solanaPrivateKey: string | null;
}
