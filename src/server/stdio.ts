import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from '../utils/config.js';
import { registerTools } from '../tools/index.js';
import { ZANContext } from '../utils/types.js';
import { registerResources } from '../resources/index.js';
import { registerPrompts } from '../prompts/index.js';

export interface StdioServerTransportOptions extends ZANContext {}

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
  ctx: StdioServerTransportOptions
): Promise<McpServer> => {
  // console.log('Initializing MCP server...');

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
        prompts: {},
      },
    }
  );

  // TODO
  // console.log('Registering resources, prompts and tools...');
  registerTools(server, ctx);
  registerResources(server, ctx);
  registerPrompts(server, ctx);

  // Connect the server using Stdio transport
  try {
    // console.log('Connecting server via Stdio transport...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // console.log(
    //   `${config.mcpServerName}@${config.mcpServerVersion} connected successfully via stdio`
    // );
  } catch (connectionError) {
    // The line below won't be reached if rethrow is true, but needed for type safety if rethrow were false
    throw connectionError;
  }

  // console.log('MCP server initialization complete.');
  return server;
};
