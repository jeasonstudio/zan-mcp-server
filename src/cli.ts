#!/usr/bin/env node

import { Command } from 'commander';
import { config } from './utils/config.js';
import { startMcpStdioServer } from './server/stdio.js';
import { ZANContext } from './utils/types.js';
import { startMcpSSEServer } from './server/sse.js';

const program = new Command();

program
  .name(config.mcpServerName)
  .description(config.mcpServerDescription)
  .version(config.mcpServerVersion);

program
  .description('start mcp server via stdio/sse transport')
  .requiredOption(
    '--api-key <zan-api-key>',
    'zan node service api key',
    'public'
  )
  .option('--stdio', 'use stdio transport')
  .option('--sse', 'use http sse transport')
  .option('-p, --port', 'http sse port (only for sse)', '3000')
  .option(
    '--evm-private-key <private-key>',
    'evm chain wallet private key as hex string with 0x prefix'
  )
  .option(
    '--solana-private-key <private-key>',
    'solana wallet private key as base58'
  )
  .option(
    '-e, --endpoint <url>',
    'zan node service api endpoint',
    'https://api.zan.top'
  )
  .action(
    ({
      apiKey,
      stdio = true,
      sse = false,
      port = 3000,
      evmPrivateKey = '0x5a9b820525dfb8e2960f3e450774a3c5eca65f3c7544fe1479d041cf90acbe08',
      solanaPrivateKey = 'NeZS6si9oLre7LZ8F9dVF6jvtPC5bmmcqEdg415WHYpdMWeLCjoq8TWTYrVYuNziGmj4wbW9KBM94RMX8tGbeMq',
      endpoint = 'https://api.zan.top',
    }) => {
      const context: ZANContext = {
        apiKey,
        endpoint,
        evmPrivateKey,
        solanaPrivateKey,
      };

      if (stdio) {
        startMcpStdioServer(context);
      }
      if (sse) {
        startMcpSSEServer({
          ...context,
          port: Number(port),
        });
      }
    }
  );

program.parse();
