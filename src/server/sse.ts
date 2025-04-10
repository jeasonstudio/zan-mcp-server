import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { config } from '../utils/config.js';
import { ZANContext } from '../utils/types.js';

export interface SSEServerTransportOptions extends ZANContext {
  port: number;
}

/**
 * Creates, configures, and connects the main MCP server instance.
 * This function initializes the server with configuration values, registers
 * available resources and tools, and establishes communication via stdio.
 *
 * @async
 * @function startMcpSSEServer
 * @returns {Promise<McpServer>} A promise that resolves with the configured and connected McpServer instance.
 * @throws {Error} Throws an error if critical failures occur during registration or connection.
 */
export const startMcpSSEServer = async (
  ctx: SSEServerTransportOptions
): Promise<McpServer> => {
  throw new Error('SSE transport is not yet implemented.');
};
