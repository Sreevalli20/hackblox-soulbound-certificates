'use client';

import { useState } from 'react';
import { useCertificate, useVerifyCertificate } from '@/hooks/useContract';
import { Button } from '@/components/ui/Button';
import QRCode from 'react-qr-code';
import { isContractConfigured } from '@/lib/wagmi-config';
import { getDemoCertificate, verifyDemoCertificate } from '@/lib/demo-data';

export default function CertificateDetailPage({ params }: { params: { tokenId: string } }) {
  const tokenId = BigInt(params.tokenId);
  const isDemoMode = !isContractConfigured();
  
  const { data: certificate, isLoading, error } = useCertificate(tokenId);
  const { data: isValid } = useVerifyCertificate(tokenId);
  
  // Demo mode data
  const demoCertificate = isDemoMode ? getDemoCertificate(params.tokenId) : null;
  const demoIsValid = isDemoMode && demoCertificate ? verifyDemoCertificate(params.tokenId) : false;
  
  const [showQR, setShowQR] = useState(false);

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

  const getVerificationURL = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/verify?tokenId=${params.tokenId}`;
    }
    return `/verify?tokenId=${params.tokenId}`;
  };

  const displayCertificate = isDemoMode ? demoCertificate : certificate;
  const displayIsLoading = isDemoMode ? false : isLoading;
  const displayError = isDemoMode ? (!demoCertificate) : error;
  const displayIsValid = isDemoMode ? demoIsValid : isValid;

  if (displayIsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (displayError || !displayCertificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificate Not Found</h3>
            <p className="text-gray-600 mb-4">
              No certificate exists with token ID {params.tokenId}
            </p>
            {isDemoMode && (
              <p className="text-sm text-gray-500 mb-4">
                Try token ID: <strong>1</strong> for the demo certificate
              </p>
            )}
            <Button onClick={() => window.location.href = '/verify'}>
              Search for Certificate
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const cert = displayCertificate as any;
  const isRevoked = cert.isRevoked;
  const isVerified = displayIsValid && !isRevoked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Certificate Details</h1>
          <p className="mt-2 text-gray-600">
            Token ID: {params.tokenId}
          </p>
        </div>

        {/* Certificate Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Certificate Header */}
          <div className={`bg-gradient-to-r ${
            isVerified ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'
          } px-8 py-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isVerified ? (
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <div>
                  <h2 className={`text-2xl font-bold text-white`}>
                    {isDemoMode ? (isVerified ? '✓ VERIFIED (DEMO MODE)' : '✕ CERTIFICATE REVOKED') : (isVerified ? '✓ VERIFIED ON-CHAIN' : '✕ CERTIFICATE REVOKED')}
                  </h2>
                  {isRevoked && (
                    <p className="text-white/80 text-sm mt-1">
                      Reason: {cert.revocationReason}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowQR(!showQR)}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  {showQR ? 'Hide QR' : 'Generate QR'}
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* QR Code Modal */}
          {showQR && (
            <div className="bg-gray-50 p-8 border-b">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan to Verify</h3>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <QRCode value={getVerificationURL()} size={200} />
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Scan this QR code to verify this certificate on-chain
                </p>
              </div>
            </div>
          )}

          {/* Certificate Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Certificate Info */}
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{cert.certificateTitle}</h3>
                  <p className="text-lg text-gray-600">{cert.courseName}</p>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Recipient
                  </h4>
                  <p className="text-xl font-semibold text-gray-900">{cert.recipientName}</p>
                  <p className="text-sm text-gray-600 font-mono mt-1">{formatAddress(cert.recipient)}</p>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Issuing Institution
                  </h4>
                  <p className="text-lg font-medium text-gray-900">{cert.institution}</p>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                <div className="border-t pt-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Certificate Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issue Date</span>
                      <span className="font-medium text-gray-900">{formatDate(cert.issueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade</span>
                      <span className="font-medium text-gray-900">{cert.grade || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-medium ${isRevoked ? 'text-red-600' : 'text-green-600'}`}>
                        {isRevoked ? 'Revoked' : 'Valid'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Blockchain Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 block text-sm">Token ID</span>
                      <span className="font-medium text-gray-900">{params.tokenId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-sm">Issuer</span>
                      <span className="font-medium text-gray-900 font-mono">{formatAddress(cert.issuer)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-sm">Network</span>
                      <span className="font-medium text-gray-900">Ethereum Sepolia</span>
                    </div>
                    {cert.metadataURI && (
                      <div>
                        <span className="text-gray-600 block text-sm">Metadata URI</span>
                        <span className="font-medium text-gray-900 text-sm break-all">{cert.metadataURI}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isRevoked && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-900 mb-2">Revocation Details</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-red-800">
                        <span className="font-medium">Revoked on:</span> {formatDate(cert.revocationDate)}
                      </p>
                      <p className="text-red-800">
                        <span className="font-medium">Reason:</span> {cert.revocationReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
              {!isDemoMode && (
                <Button
                  onClick={() => window.open(`https://sepolia.etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${params.tokenId}`, '_blank')}
                  variant="outline"
                >
                  View on Etherscan
                </Button>
              )}
              <Button
                onClick={() => window.location.href = '/verify'}
                variant="ghost"
              >
                Verify Another Certificate
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            {isDemoMode ? 'This is a demo certificate for demonstration purposes.' : 'This certificate is secured on the Ethereum Sepolia testnet and cannot be transferred or modified.'}
          </p>
          <p className="mt-1">
            Built for HackBlox 2026 by Kommavarapu Kanmeswari Sreevalli
          </p>
        </div>
      </div>
    </div>
  );
}
