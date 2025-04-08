import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp';
import { ZodRawShape } from 'zod';

export type ToolHandler<Args extends undefined | ZodRawShape = undefined> = (
  apiKey: string
) => ToolCallback<Args>;

export interface ToolDefinition {
  name: string;
  description: string;
  paramsSchema: ZodRawShape;
  handler: ToolHandler<any>;
}

export interface ZANContext {
  apiKey: string;
  endpoint: string;
}
