import { defineChain } from "@reown/appkit/networks";

export const ganacheTestChain = defineChain({
    id: 1337,
    name: 'Ganache Test Network',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: {
      default: {
        http: ['https://ganache.btiplatform.com'],
      },
    },
    testnet: true
});
