import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from '../config.js';
import Stream from 'node:stream';
import { registerTools } from '../tools/index.js';

export interface StdioServerTransportOptions {
  apiKey: string;
  stdin?: Stream.Readable;
  stdout?: Stream.Writable;
}

/**
 * Creates, configures, and connects the main MCP server instance.
 * This function initializes the server with configuration values, registers
 * available resources and tools, and establishes communication via stdio.
 *
 * @async
 * @function startMcpStdioServer
 * @returns {Promise<McpServer>} A promise that resolves with the configured and connected McpServer instance.
 * @throws {Error} Throws an error if critical failures occur during registration or connection.
 */
export const startMcpStdioServer = async (
  options?: StdioServerTransportOptions
): Promise<McpServer> => {
  console.info('Initializing MCP server...', options);

  // Create the server instance using McpServer
  const server = new McpServer(
    {
      name: config.mcpServerName,
      version: config.mcpServerVersion,
    },
    {
      // Capabilities are defined dynamically via registration functions below
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // TODO
  console.info('Registering resources, prompts and tools...');
  registerTools(server, options!.apiKey);

  // Connect the server using Stdio transport
  try {
    console.info('Connecting server via Stdio transport...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.info(
      `${config.mcpServerName}@${config.mcpServerVersion} connected successfully via stdio`
    );
  } catch (connectionError) {
    // The line below won't be reached if rethrow is true, but needed for type safety if rethrow were false
    throw connectionError;
  }

  console.info('MCP server initialization complete.');
  return server;
};
