# ZAN MCP Server

Model Context Protocol Server for [ZAN.top](https://zan.top) 节点服务。

## 简介

ZAN MCP Server 是一个基于 Model Context Protocol 规范开发的服务器实现，专为 ZAN.top 区块链节点服务设计。它提供了与区块链交互的各种工具和接口，使 AI 助手能够通过 MCP 协议无缝获取和处理区块链数据。

## 功能特点

- **多链支持**: 支持以太坊、Polygon、BSC、Arbitrum、Optimism 等多个 EVM 兼容链
- **便捷的区块链查询**: 提供区块链信息、地址解析等功能
- **高可靠节点服务**: 基于 ZAN.top 的高性能节点服务
- **标准 MCP 协议**: 完全兼容 Model Context Protocol 规范
- **可扩展架构**: 支持轻松添加新的区块链工具和服务

## 支持的区块链

- **以太坊**: 主网(Mainnet)、Sepolia、Holesky 测试网络
- **BSC**: 主网、测试网
- **Polygon**: 主网、Amoy 测试网
- **Optimism**: 主网、Sepolia 测试网
- **Arbitrum**: One(主网)、Sepolia 测试网
- **其他**: Base、zkSync、Tron、Avalanche、Fantom、Taiko、Mantle

## 效果展示

![](https://mdn.alipayobjects.com/huamei_1hrimu/afts/img/A*MmLYTIJYfEUAAAAAAAAAAAAAep95AQ/original)

## API

### 资源

- **EVM 链服务**: 提供以太坊虚拟机兼容链的各种操作接口

### 工具

- **evm_get_chain_info**
  - 获取特定 EVM 网络的链信息
  - 输入: `network` (字符串, 例如 'eth/mainnet', 'polygon/mainnet')
  - 返回: 链 ID、名称、货币符号、RPC URLs、最新区块高度等信息

- **evm_resolve_ens**
  - 解析以太坊域名服务(ENS)
  - 输入: `name` (字符串), `network` (可选)
  - 返回: 对应的以太坊地址

- **evm_get_supported_networks**
  - 获取所有支持的网络列表
  - 无需输入参数
  - 返回: 支持的网络列表及详情

- **evm_get_contract_address**
  - 获取已部署智能合约的地址信息
  - 输入: `name` (字符串), `network` (可选)
  - 返回: 合约地址及相关信息

## 使用方法

### 安装

```bash
npm install zan-mcp-server
# 或
pnpm add zan-mcp-server
```

### 使用 CLI

```bash
# 全局安装
npm install -g zan-mcp-server

# 运行服务器
zan-mcp-server [options]
```

### 使用 NPX

无需安装，可以直接通过 npx 来运行：

```bash
npx zan-mcp-server --stdio --api-key YOUR_ZAN_API_KEY
```

### 通过 MCP Client 设置

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

### 在项目中集成

```javascript
import { createStdioServer } from 'zan-mcp-server';

// 创建并启动服务器
const server = createStdioServer({
  // 配置选项
});

// 处理服务器生命周期
```

## 配置

可通过环境变量或配置文件进行设置：

- `ZAN_API_KEY`: ZAN.top API 密钥
- `ZAN_RPC_URL`: 自定义 RPC URL (可选)

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 使用 MCP inspector 进行测试
pnpm inspect
```

## 许可证

MIT License
