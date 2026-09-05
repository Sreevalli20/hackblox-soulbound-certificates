'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useIssuerInfo, useIsAuthorizedIssuer } from '@/hooks/useContract';
import { Button } from '@/components/ui/Button';
import { isContractConfigured } from '@/lib/wagmi-config';

export default function IssuersPage() {
  const { address } = useAccount();
  const { data: isAuthorized } = useIsAuthorizedIssuer(address || '');
  
  const [searchAddress, setSearchAddress] = useState('');
  const [searched, setSearched] = useState(false);
  
  const { data: issuerInfo, isLoading } = useIssuerInfo(searchAddress || '');

  const handleSearch = () => {
    if (searchAddress) {
      setSearched(true);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isContractConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contract Not Configured</h3>
            <p className="text-gray-600">
              Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Authorized Issuers</h1>
          <p className="mt-2 text-gray-600">
            Search for authorized certificate issuers on the platform
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button onClick={handleSearch} disabled={!searchAddress}>
              Search
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searched && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading issuer information...</p>
              </div>
            ) : issuerInfo && (issuerInfo as any).isActive ? (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{(issuerInfo as any).name}</h2>
                    <p className="text-gray-600">{(issuerInfo as any).role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Wallet Address</p>
                    <p className="font-medium text-gray-900 font-mono">{formatAddress(searchAddress)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-900">{(issuerInfo as any).role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Added Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(Number((issuerInfo as any).addedDate) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button
                    onClick={() => window.open(`https://sepolia.etherscan.io/address/${searchAddress}`, '_blank')}
                    variant="outline"
                  >
                    View on Etherscan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Issuer Not Found</h3>
                <p className="text-gray-600">
                  The address {formatAddress(searchAddress)} is not an authorized issuer.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">About Authorized Issuers</h3>
          <p className="text-gray-700 text-sm">
            Authorized issuers are institutions and organizations that have been granted permission to issue 
            soulbound certificates. Each issuer is registered on-chain with their role and status. 
            Only authorized issuers can mint certificates to recipient wallets.
          </p>
          {isAuthorized === true && (
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                You are an authorized issuer
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
