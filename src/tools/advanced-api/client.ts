import { Account, Chain, createClient, Hex, http, Transport } from 'viem';
import { getChainByNetwork, ZANNetwork } from '../../utils/evm.js';
import { ZANContext } from '../../utils/types.js';

export type ZANRPCMethods = [
  {
    Method: 'zan_getNFTMetadata';
    Parameters: [address: Hex];
    ReturnType: {
      address: Hex;
      authentic: boolean;
      decimal: number;
      ecosystem: string;
      name: string;
      standard: 'ERC721' | 'ERC1155';
      symbol: string;
    };
  },
  {
    Method: 'zan_getNFTsByOwner';
    Parameters: [
      address: Hex,
      tokenType: string,
      pageSize: number,
      pageNumber: number
    ];
    ReturnType: {
      pageSize: number;
      pageKey: number;
      items: {
        tokenAddress: Hex;
        tokenId: string;
        holderAddress: Hex;
        addressBalance: string;
      }[];
    };
  },
  {
    Method: 'zan_getNFTIDs';
    Parameters: [contractAddress: Hex, topN: number];
    ReturnType: string[];
  }
];

export const getZANClient = (network: ZANNetwork, ctx: ZANContext) => {
  const rpcUrl = `${ctx.endpoint}/data/v1/${network}/${ctx.apiKey}`;
  const chain = getChainByNetwork(network);
  return createClient<Transport, Chain, Account, ZANRPCMethods>({
    chain,
    transport: http(rpcUrl),
  }).extend((client) => ({
    getNFTMetadata: async (args: { nftContractAddress: Hex }) =>
      client.request({
        method: 'zan_getNFTMetadata',
        params: [args.nftContractAddress],
      }),
    getNFTsByOwner: async (args: {
      address: Hex;
      tokenType: string;
      pageSize: number;
      pageNumber: number;
    }) =>
      client.request({
        method: 'zan_getNFTsByOwner',
        params: [args.address, args.tokenType, args.pageSize, args.pageNumber],
      }),
    getNFTIDs: async (args: { contractAddress: Hex; topN: number }) =>
      client.request({
        method: 'zan_getNFTIDs',
        params: [args.contractAddress, args.topN],
      }),
  }));
};
