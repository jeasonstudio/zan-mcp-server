import * as chains from 'viem/chains';
import { z } from 'zod';
import { ZANContext } from './types.js';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export const network = z
  .enum([
    'eth/mainnet',
    'eth/sepolia',
    'eth/holesky',
    'bsc/mainnet',
    'bsc/testnet',
    'polygon/mainnet',
    'polygon/amoy',
    'opt/mainnet',
    'opt/sepolia',
    'arb/one',
    'arb/sepolia',
    'base/mainnet',
    'zksync/mainnet',
    'tron/mainnet',
    'avax/mainnet',
    'avax/testnet',
    'ftm/mainnet',
    'taiko/mainnet',
    'mantle/mainnet',
    'mint/mainnet',
  ])
  .optional()
  .default('eth/mainnet')
  .describe(
    "Network name and type (e.g., 'eth/mainnet', 'eth/holesky', 'opt/mainnet', 'arb/one' etc.). Supports mant EVM-compatible networks mainnet and testnet. Defaults to eth/mainnet."
  );

export type ZANNetwork = z.infer<typeof network>;

export const networkMap: Record<ZANNetwork, chains.Chain> = {
  'eth/mainnet': chains.mainnet,
  'eth/sepolia': chains.sepolia,
  'eth/holesky': chains.holesky,
  'bsc/mainnet': chains.bsc,
  'bsc/testnet': chains.bscTestnet,
  'polygon/mainnet': chains.polygon,
  'polygon/amoy': chains.polygonAmoy,
  'opt/mainnet': chains.optimism,
  'opt/sepolia': chains.optimismSepolia,
  'arb/one': chains.arbitrum,
  'arb/sepolia': chains.arbitrumSepolia,
  'base/mainnet': chains.base,
  'zksync/mainnet': chains.zksync,
  'tron/mainnet': chains.tron,
  'avax/mainnet': chains.avalanche,
  'avax/testnet': chains.avalancheFuji,
  'ftm/mainnet': chains.fantom,
  'taiko/mainnet': chains.taiko,
  'mantle/mainnet': chains.mantle,
  'mint/mainnet': chains.mint,
};

export const getRpcUrl = (network: ZANNetwork, ctx: ZANContext): string => {
  return `${ctx.endpoint}/node/v1/${network}/${ctx.apiKey}`;
};

export const getChainByNetwork = (network: ZANNetwork) => {
  const chain = networkMap[network];
  if (!chain) {
    throw new Error(`Unsupported network: ${network}`);
  }
  return chain;
};

/**
 * 增强版的 JSON.stringify，支持 BigInt、Map、Set、Date 等类型的序列化
 * @param value 要序列化的值
 * @param space 缩进空格数或字符串
 * @returns 序列化后的 JSON 字符串
 */
export const jsonStringify = (
  value: unknown,
  space?: number | string
): string => {
  return JSON.stringify(
    value,
    (_, val) => {
      // 处理 BigInt 类型
      if (typeof val === 'bigint') {
        return val.toString();
      }
      // 处理 Map 类型
      if (val instanceof Map) {
        return {
          __type: 'Map',
          value: Array.from(val.entries()),
        };
      }
      // 处理 Set 类型
      if (val instanceof Set) {
        return {
          __type: 'Set',
          value: Array.from(val.values()),
        };
      }
      // 处理 Date 类型
      if (val instanceof Date) {
        return {
          __type: 'Date',
          value: val.toISOString(),
        };
      }
      // 处理 Error 类型
      if (val instanceof Error) {
        return {
          __type: 'Error',
          message: val.message,
          stack: val.stack,
        };
      }
      return val;
    },
    space
  );
};

export const getPublicClient = (network: ZANNetwork, ctx: ZANContext) => {
  const rpcUrl = getRpcUrl(network, ctx);
  const chain = getChainByNetwork(network);
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
};

export const getWalletClient = (network: ZANNetwork, ctx: ZANContext) => {
  if (!ctx.evmPrivateKey) {
    throw new Error('EVM private key is required for wallet client');
  }
  const rpcUrl = getRpcUrl(network, ctx);
  const chain = getChainByNetwork(network);
  const account: any = privateKeyToAccount(ctx.evmPrivateKey as `0x${string}`);
  const client = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });
  return client;
};
