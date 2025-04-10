import { z } from 'zod';
import { ZANContext } from './types.js';

export const network = z
  .enum(['solana/mainnet', 'solana/devnet'])
  .optional()
  .default('solana/mainnet')
  .describe(
    "Network name and type (e.g., 'solana/mainnet', 'solana/devnet'). Supports solana mainnet and devnet. Defaults to solana/mainnet."
  );

export type SolanaNetwork = z.infer<typeof network>;

export const getRpcUrl = (network: SolanaNetwork, ctx: ZANContext): string => {
  return `${ctx.endpoint}/node/v1/${network}/${ctx.apiKey}`;
};
