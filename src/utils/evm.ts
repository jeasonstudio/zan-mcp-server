import * as chains from 'viem/chains';
import { z } from 'zod';
import { ZANContext } from './types.js';
import { createPublicClient, http } from 'viem';

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

export const getPublicClient = (network: ZANNetwork, ctx: ZANContext) => {
  const rpcUrl = getRpcUrl(network, ctx);
  const chain = getChainByNetwork(network);
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
};
