import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Production: Always use the real Sepolia contract
const CONTRACT_ADDRESS = '0x43aF2D5749758E2668d46Cb5BA1A2Efc74C27Cc8';
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';

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
    [sepolia.id]: http(SEPOLIA_RPC_URL, {
      retryCount: 2,
      timeout: 30000,
    }),
  },
  ssr: false, // Disable SSR to avoid hydration issues
});

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        retryDelay: 1000,
        staleTime: 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  });
}

export function getContractAddress(): string {
  return CONTRACT_ADDRESS;
}

export function isContractConfigured(): boolean {
  return true; // Always configured in production
}
