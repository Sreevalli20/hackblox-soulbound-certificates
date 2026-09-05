import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';

// Production: Always use the real Sepolia contract
const CONTRACT_ADDRESS = '0x43aF2D5749758E2668d46Cb5BA1A2Efc74C27Cc8';
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/alch_zmsob4pfTIgtVW0AIhpym';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default',
      showQrModal: false 
    }),
  ],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC_URL),
  },
  ssr: true,
});

export const queryClient = new QueryClient();

export function getContractAddress(): string {
  return CONTRACT_ADDRESS;
}

export function isContractConfigured(): boolean {
  return true; // Always configured in production
}
