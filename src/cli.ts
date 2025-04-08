import { Command } from 'commander';
import { config } from './config.js';
import { startMcpStdioServer } from './server/stdio.js';

const program = new Command();

program
  .name(config.mcpServerName)
  .description(config.mcpServerDescription)
  .version(config.mcpServerVersion);

program
  .command('stdio')
  .description('start mcp server via stdio transport')
  .option('-k, --api-key <zan-api-key>', 'zan node service api key', 'public')
  .option(
    '-e, --endpoint <url>',
    'zan node service api endpoint',
    'https://api.zan.top'
  )
  .action((options) => {
    console.log('apikey:', options);
    startMcpStdioServer({ ...options });
  });

program
  .command('sse')
  .description('start mcp server via http sse transport')
  .option('-k, --api-key <zan-api-key>', 'zan node service api key', 'public')
  .option('-p, --port <string>', 'http service port', '3000')
  .option(
    '-e, --endpoint <url>',
    'zan node service api endpoint',
    'https://api.zan.top'
  )
  .action((zanApiKey, options) => {
    // startMcpStdioServer({ apiKey: zanApiKey, ...options });
    console.log('sse not implemented yet');
  });

program.parse();
