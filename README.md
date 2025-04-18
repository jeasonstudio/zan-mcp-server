# ZAN MCP Server

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/zan-mcp-server.svg?style=flat-square
[npm-url]: https://npmjs.org/package/zan-mcp-server

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

![zan-mcp-server-example](https://mdn.alipayobjects.com/huamei_1hrimu/afts/img/A*ZT1oQKizJdIAAAAAAAAAAAAAep95AQ/original)

## API

### Resources

- **EVM Chain Service**: Provides interfaces for Ethereum Virtual Machine compatible chains
- **Solana Chain Service**: Provides interfaces for Solana blockchain operations
- **Advanced API Service**: Provides advanced Web3 API services

### Tools

#### EVM Tools

- **evm_get_chain_info**: Get information about a specific EVM network
- **evm_resolve_ens**: Resolve Ethereum Name Service (ENS) domains
- **evm_get_supported_networks**: Get a list of all supported networks
- **evm_get_contract_address**: Get deployed smart contract address information
- **evm_get_address**: Get currently used Ethereum address
- **evm_create_access_list**: Create an access list for a transaction
- **evm_get_balance**: Get account balance
- **evm_get_transaction_count**: Get the number of transactions (nonce) for an address
- **evm_get_block**: Get block information by block number or hash
- **evm_get_block_number**: Get the latest block number
- **evm_get_block_transaction_count**: Get the number of transactions in a block
- **evm_call**: Execute a smart contract call
- **evm_estimate_gas**: Estimate gas needed for a transaction
- **evm_get_gas_price**: Get current gas price
- **evm_verify_message**: Verify a signed message
- **evm_verify_typed_data**: Verify a typed data signature
- **evm_get_transaction**: Get transaction details
- **evm_get_transaction_receipt**: Get transaction receipt
- **evm_get_logs**: Get logs matching specific filter criteria
- **evm_get_addresses**: Get list of available account addresses
- **evm_sign_message**: Sign a message

#### ZAN Advanced API Tools

- **zan_evm_get_nft_metadata**: Get metadata for a specific NFT contract address
- **zan_evm_get_nfts_by_owner**: Get NFTs owned by a specific wallet address
- **zan_evm_get_nft_ids**: Get token IDs list for an NFT contract address

#### Solana Tools (Under Development)

Provides a series of Solana blockchain interaction tools based on Solana Agent Kit

#### Other Blockchain Tools (Planned)

- **Bitcoin Tools**: Bitcoin blockchain interaction tools (planned)
- **Aptos Tools**: Aptos blockchain interaction tools (planned)  
- **Sui Tools**: Sui blockchain interaction tools (planned)

## Usage

### Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "zan": {
      "command": "npx",
      "args": [
        "-y",
        "zan-mcp-server",
        "--stdio",
        "--api-key",
        "<zan_api_key>"
      ]
    }
  }
}
```

### Cursor

```json
{
  "mcpServers": {
    "zan": {
      "command": "npx",
      "args": [
        "-y",
        "zan-mcp-server",
        "--stdio",
        "--api-key",
        "<zan_api_key>"
      ]
    }
  }
}
```

### VSCode

```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "zan_api_key",
      "description": "ZAN Node Service API Key",
      "password": false
    }
  ],
  "servers": {
    "zan": {
      "command": "npx",
      "args": [
        "zan-mcp-server",
        "--stdio",
        "--api-key",
        "${input:zan_api_key}"
      ]
    }
  }
}
```

> **Note**: For write operations (e.g., sending transactions, signing messages), you need to provide the corresponding chain's private key:
> - For EVM chains: `--evm-private-key <private-key>`
> - For Solana: `--solana-private-key <private-key-base58>`

### Project Integration

```javascript
import { createStdioServer } from 'zan-mcp-server';

// Create and start server
const server = createStdioServer({
  // Configuration options
});

// Handle server lifecycle
```

## Development

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev:watch

# Build
pnpm build

# Test with MCP inspector
pnpm inspect
```

## License

[MIT License by Jeason](LICENSE)
