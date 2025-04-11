# ZAN MCP Server

[English](README.md) | [中文](README.zh-CN.md)

Model Context Protocol Server for [ZAN.top](https://zan.top) node services.

## Introduction

ZAN MCP Server is a server implementation based on the Model Context Protocol specification, specifically designed for ZAN.top blockchain node services. It provides various tools and interfaces for blockchain interaction, enabling AI assistants to seamlessly access and process blockchain data through the MCP protocol.

## Features

- **Multi-chain Support**: Supports multiple EVM-compatible chains including Ethereum, Polygon, BSC, Arbitrum, and Optimism
- **Convenient Blockchain Queries**: Provides blockchain information, address resolution, and other features
- **High-reliability Node Service**: Based on ZAN.top's high-performance node service
- **Standard MCP Protocol**: Fully compliant with Model Context Protocol specification
- **Extensible Architecture**: Supports easy addition of new blockchain tools and services

## Supported Blockchains

- **Ethereum**: Mainnet, Sepolia, Holesky test networks
- **BSC**: Mainnet, testnet
- **Polygon**: Mainnet, Amoy testnet
- **Optimism**: Mainnet, Sepolia testnet
- **Arbitrum**: One (Mainnet), Sepolia testnet
- **Others**: Base, zkSync, Tron, Avalanche, Fantom, Taiko, Mantle

## Demo

![](https://mdn.alipayobjects.com/huamei_1hrimu/afts/img/A*MmLYTIJYfEUAAAAAAAAAAAAAep95AQ/original)

## API

### Resources

- **EVM Chain Service**: Provides various operation interfaces for Ethereum Virtual Machine compatible chains

### Tools

- **evm_get_chain_info**
  - Get chain information for a specific EVM network
  - Input: `network` (string, e.g., 'eth/mainnet', 'polygon/mainnet')
  - Returns: Chain ID, name, currency symbol, RPC URLs, latest block height, etc.

- **evm_resolve_ens**
  - Resolve Ethereum Name Service (ENS)
  - Input: `name` (string), `network` (optional)
  - Returns: Corresponding Ethereum address

- **evm_get_supported_networks**
  - Get a list of all supported networks
  - No input parameters required
  - Returns: List of supported networks and details

- **evm_get_contract_address**
  - Get deployed smart contract address information
  - Input: `name` (string), `network` (optional)
  - Returns: Contract address and related information

## Usage

### Installation

```bash
npm install zan-mcp-server
# or
pnpm add zan-mcp-server
```

### Using CLI

```bash
# Global installation
npm install -g zan-mcp-server

# Run server
zan-mcp-server [options]
```

### Using NPX

Run directly without installation using npx:

```bash
npx zan-mcp-server --stdio --api-key YOUR_ZAN_API_KEY
```

### MCP Client Configuration

```json
{
  "mcpServers": {
    "zan": {
      "command": "npx",
      "args": [
        "zan-mcp-server",
        "--stdio",
        "--api-key",
        "<zan_api_key>"
      ]
    }
  }
}
```

### Project Integration

```javascript
import { createStdioServer } from 'zan-mcp-server';

// Create and start server
const server = createStdioServer({
  // Configuration options
});

// Handle server lifecycle
```

## Configuration

Can be set through environment variables or configuration files:

- `ZAN_API_KEY`: ZAN.top API key
- `ZAN_RPC_URL`: Custom RPC URL (optional)

## Development

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build
pnpm build

# Test with MCP inspector
pnpm inspect
```

## License

MIT License
