'use client';

import { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useIssueCertificate, useIsAuthorizedIssuer, useRecipientCertificates, useTotalCertificates } from '@/hooks/useContract';
import { Button } from '@/components/ui/Button';
import { isContractConfigured } from '@/lib/wagmi-config';
import { MetadataProviderFactory } from '@/lib/metadata-provider';
import { sepolia } from 'wagmi/chains';

export default function IssuerDashboard() {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { data: isAuthorized } = useIsAuthorizedIssuer(address || '');
  const { data: totalCertificates } = useTotalCertificates();
  const { data: recipientCerts } = useRecipientCertificates(address || '');
  
  const { issueCertificate, isPending, isConfirming, isSuccess, hash, error } = useIssueCertificate();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    recipientName: 'Kommavarapu Kanmeswari Sreevalli',
    certificateTitle: '',
    courseName: '',
    institution: '',
    grade: '',
  });
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  const handleBack = () => {
    setPreviewMode(false);
  };

  const handleIssue = async () => {
    try {
      const metadata = MetadataProviderFactory.createCertificateMetadata(
        formData.recipientName,
        formData.certificateTitle,
        formData.courseName,
        formData.institution,
        formData.grade,
        new Date()
      );

      const provider = MetadataProviderFactory.getProvider();
      const metadataURI = await provider.uploadMetadata(metadata);

      await issueCertificate(
        formData.recipient as `0x${string}`,
        formData.recipientName,
        formData.certificateTitle,
        formData.courseName,
        formData.institution,
        formData.grade,
        metadataURI
      );

      setShowForm(false);
      setPreviewMode(false);
      setFormData({
        recipient: '',
        recipientName: 'Kommavarapu Kanmeswari Sreevalli',
        certificateTitle: '',
        courseName: '',
        institution: '',
        grade: '',
      });
    } catch (err) {
      console.error('Error issuing certificate:', err);
    }
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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Wallet</h3>
            <p className="text-gray-600 mb-4">
              Connect your wallet to access the issuer dashboard.
            </p>
            <Button onClick={() => window.location.reload()}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (chain?.id !== sepolia.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wrong Network</h3>
            <p className="text-gray-600 mb-4">
              Please switch to Sepolia testnet to issue certificates.
            </p>
            <Button onClick={() => switchChain({ chainId: sepolia.id })}>
              Switch to Sepolia
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Authorized</h3>
            <p className="text-gray-600 mb-4">
              You are not authorized to issue certificates. Contact an administrator.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Issuer Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Issue and manage soulbound certificates
          </p>
        </div>

        {/* @ts-ignore - TypeScript error with ReactNode type */}
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total Certificates Issued</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {totalCertificates?.toString() || '0'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Your Certificates</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {(recipientCerts as any)?.length || '0'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Authorization Status</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              Authorized
            </div>
          </div>
        </div>

        {/* Issue Certificate Button */}
        <div className="mb-8">
          <Button onClick={() => setShowForm(true)} size="lg">
            Issue New Certificate
          </Button>
        </div>

        {/* Issue Certificate Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {previewMode ? 'Certificate Preview' : 'Issue Certificate'}
            </h2>

            {previewMode ? (
              <div className="space-y-6">
                {/* Preview */}
                <div className="border-2 border-blue-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-violet-50">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.certificateTitle}</h3>
                    <p className="text-lg text-gray-600 mb-4">{formData.courseName}</p>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-gray-900 font-semibold">{formData.recipientName}</p>
                      <p className="text-sm text-gray-500 mt-1">{formData.institution}</p>
                      {formData.grade && (
                        <p className="text-sm text-gray-500 mt-1">Grade: {formData.grade}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transaction Status */}
                {(isPending || isConfirming || isSuccess) && (
                  <div className={`p-4 rounded-lg ${
                    isSuccess ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    {isPending && (
                      <p className="text-blue-900">Waiting for wallet confirmation...</p>
                    )}
                    {isConfirming && (
                      <p className="text-blue-900">Confirming on Sepolia...</p>
                    )}
                    {isSuccess && (
                      <p className="text-green-900">Certificate issued successfully!</p>
                    )}
                    {hash && (
                      <p className="text-sm text-gray-600 mt-2">
                        Transaction: {(hash as string).slice(0, 10)}...{(hash as string).slice(-8)}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <Button onClick={handleBack} variant="outline">
                    Back to Edit
                  </Button>
                  <Button 
                    onClick={handleIssue} 
                    disabled={isPending || isConfirming}
                  >
                    {isPending ? 'Confirming...' : isConfirming ? 'Issuing...' : 'Issue Certificate'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Wallet Address
                  </label>
                  <input
                    type="text"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Title
                  </label>
                  <input
                    type="text"
                    name="certificateTitle"
                    value={formData.certificateTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Certificate of Completion"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course/Program Name
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    placeholder="e.g., Advanced Web3 Development"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="e.g., HackBlox University"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade (Optional)
                  </label>
                  <input
                    type="text"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    placeholder="e.g., A, B+, Pass"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-900">{error.message}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={() => setShowForm(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handlePreview} disabled={!formData.recipient || !formData.certificateTitle}>
                    Preview Certificate
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Certificates */}
        {recipientCerts && (recipientCerts as any).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Certificates</h2>
            <div className="space-y-4">
              {(recipientCerts as any).slice(0, 5).map((tokenId: bigint) => (
                <div key={tokenId.toString()} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Token ID: {tokenId.toString()}</p>
                    <p className="text-sm text-gray-600">Issued to your wallet</p>
                  </div>
                  <Button
                    onClick={() => window.location.href = `/certificate/${tokenId}`}
                    variant="outline"
                    size="sm"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
