'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from './ui/Button';
import { sepolia } from 'wagmi/chains';
import { useEffect, useState } from 'react';
import { isContractConfigured } from '@/lib/wagmi-config';

export function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Button size="sm" disabled>
          Loading...
        </Button>
      </div>
    );
  }

  const isDemoMode = !isContractConfigured();
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleSwitchNetwork = () => {
    if (chain?.id !== sepolia.id) {
      switchChain({ chainId: sepolia.id });
    }
  };

  if (isDemoMode) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-600">
          <span className="text-blue-600">● Demo Mode</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled
        >
          No Wallet Required
        </Button>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">
          {chain?.id === sepolia.id ? (
            <span className="text-green-600">● Sepolia</span>
          ) : (
            <span className="text-red-600">● Wrong Network</span>
          )}
        </div>
        <div className="text-sm font-medium text-gray-900">
          {formatAddress(address)}
        </div>
        {chain?.id !== sepolia.id && (
          <Button
            onClick={handleSwitchNetwork}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Switch to Sepolia
          </Button>
        )}
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          size="sm"
        >
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      ))}
      {connectError && (
        <div className="text-xs text-red-600 max-w-xs">
          {connectError.message}
        </div>
      )}
    </div>
  );
}
