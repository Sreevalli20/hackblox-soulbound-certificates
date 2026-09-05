'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useCertificate, useVerifyCertificate } from '@/hooks/useContract';
import { Button } from '@/components/ui/Button';
import { isContractConfigured } from '@/lib/wagmi-config';
import { getDemoCertificate, verifyDemoCertificate, getDemoCertificatesByAddress } from '@/lib/demo-data';

export default function VerifyPage() {
  const [searchType, setSearchType] = useState<'tokenId' | 'wallet'>('tokenId');
  const [tokenId, setTokenId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [searched, setSearched] = useState(false);
  
  const { address } = useAccount();
  const isDemoMode = !isContractConfigured();
  
  const tokenIdBigInt = tokenId ? BigInt(tokenId) : BigInt(0);
  
  const { data: certificate, isLoading: isLoadingCert, error: certError } = useCertificate(tokenIdBigInt);
  const { data: isValid, isLoading: isLoadingValid } = useVerifyCertificate(tokenIdBigInt);

  // Demo mode data
  const demoCertificate = isDemoMode && searched ? getDemoCertificate(tokenId) : null;
  const demoIsValid = isDemoMode && demoCertificate ? verifyDemoCertificate(tokenId) : false;
  const demoWalletCerts = isDemoMode && searched ? getDemoCertificatesByAddress(walletAddress) : [];

  const handleSearch = () => {
    if (searchType === 'tokenId' && tokenId) {
      setSearched(true);
    } else if (searchType === 'wallet' && walletAddress) {
      setSearched(true);
    }
  };

  const formatDate = (timestamp: bigint | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const displayCertificate = isDemoMode ? demoCertificate : certificate;
  const displayIsValid = isDemoMode ? demoIsValid : isValid;
  const displayIsLoading = isDemoMode ? false : (isLoadingCert || isLoadingValid);
  const displayError = isDemoMode ? (!demoCertificate && searched) : certError;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verify Certificate</h1>
          <p className="mt-2 text-gray-600">
            Enter a certificate token ID or wallet address to verify authenticity on-chain
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSearchType('tokenId')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'tokenId'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              By Token ID
            </button>
            <button
              onClick={() => setSearchType('wallet')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchType === 'wallet'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              By Wallet Address
            </button>
          </div>

          {searchType === 'tokenId' ? (
            <div className="flex gap-4">
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Enter certificate token ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={handleSearch} disabled={!tokenId}>
                Verify
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter wallet address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={handleSearch} disabled={!walletAddress}>
                Search
              </Button>
            </div>
          )}
        </div>

        {/* Verification Results */}
        {searched && searchType === 'tokenId' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {displayIsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Verifying certificate...</p>
              </div>
            ) : displayError ? (
              <div className="text-center py-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate Not Found</h3>
                <p className="text-gray-600">
                  No certificate exists with token ID {tokenId}
                </p>
                {isDemoMode && (
                  <p className="text-sm text-gray-500 mt-2">
                    Try token ID: <strong>1</strong> for the demo certificate
                  </p>
                )}
              </div>
            ) : displayCertificate && displayIsValid !== undefined ? (
              <div>
                {/* Verification Status */}
                <div className={`mb-6 p-4 rounded-lg ${
                  displayIsValid && !(displayCertificate as any).isRevoked
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {displayIsValid && !(displayCertificate as any).isRevoked ? (
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <div>
                      <h3 className={`font-semibold ${
                        displayIsValid && !(displayCertificate as any).isRevoked ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {isDemoMode ? '✓ VERIFIED (DEMO MODE)' : (displayIsValid && !(displayCertificate as any).isRevoked ? '✓ VERIFIED ON-CHAIN' : '✕ CERTIFICATE REVOKED')}
                      </h3>
                      {(displayCertificate as any).isRevoked && (
                        <p className="text-sm text-red-700 mt-1">
                          Reason: {(displayCertificate as any).revocationReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Token ID</p>
                      <p className="font-medium text-gray-900">{tokenId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium ${(displayCertificate as any).isRevoked ? 'text-red-600' : 'text-green-600'}`}>
                        {(displayCertificate as any).isRevoked ? 'Revoked' : 'Valid'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Recipient Name</p>
                    <p className="font-medium text-gray-900">{(displayCertificate as any).recipientName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Recipient Wallet</p>
                    <p className="font-medium text-gray-900 font-mono">{formatAddress((displayCertificate as any).recipient)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Certificate Title</p>
                    <p className="font-medium text-gray-900">{(displayCertificate as any).certificateTitle}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Course/Program</p>
                    <p className="font-medium text-gray-900">{(displayCertificate as any).courseName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Institution</p>
                    <p className="font-medium text-gray-900">{(displayCertificate as any).institution}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Issue Date</p>
                      <p className="font-medium text-gray-900">{formatDate((displayCertificate as any).issueDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Grade</p>
                      <p className="font-medium text-gray-900">{(displayCertificate as any).grade || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Issuer</p>
                    <p className="font-medium text-gray-900 font-mono">{formatAddress((displayCertificate as any).issuer)}</p>
                  </div>

                  {(displayCertificate as any).metadataURI && (
                    <div>
                      <p className="text-sm text-gray-500">Metadata URI</p>
                      <p className="font-medium text-gray-900 text-sm break-all">{(displayCertificate as any).metadataURI}</p>
                    </div>
                  )}

                  {(displayCertificate as any).isRevoked && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Revocation Details</p>
                      <p className="font-medium text-red-900">Revoked on: {formatDate((displayCertificate as any).revocationDate)}</p>
                      <p className="font-medium text-red-900">Reason: {(displayCertificate as any).revocationReason}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={() => window.location.href = `/certificate/${tokenId}`}
                    variant="outline"
                  >
                    View Full Certificate
                  </Button>
                  {!isDemoMode && (
                    <Button
                      onClick={() => window.open(`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${tokenId}`, '_blank')}
                      variant="ghost"
                    >
                      View on Etherscan
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Wallet Search Results */}
        {searched && searchType === 'wallet' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {isDemoMode ? (
              demoWalletCerts.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificates Found</h3>
                  <div className="space-y-4">
                    {demoWalletCerts.map((cert) => (
                      <div key={cert.tokenId} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{cert.recipientName}</p>
                            <p className="text-sm text-gray-600">{cert.certificateTitle}</p>
                            <p className="text-sm text-gray-500">Token ID: {cert.tokenId}</p>
                          </div>
                          <Button
                            onClick={() => window.location.href = `/certificate/${cert.tokenId}`}
                            variant="outline"
                            size="sm"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Found</h3>
                  <p className="text-gray-600">
                    No certificates found for wallet address {formatAddress(walletAddress)}
                  </p>
                  {isDemoMode && (
                    <p className="text-sm text-gray-500 mt-2">
                      Try address: <strong>0x742d...f44e</strong> for the demo certificate
                    </p>
                  )}
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Wallet search is only available in demo mode. Use token ID search for real contract verification.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
