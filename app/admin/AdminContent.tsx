'use client';

import { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useAddIssuer, useRemoveIssuer, useUpdateIssuer, useIsAuthorizedIssuer } from '@/hooks/useContract';
import { Button } from '@/components/ui/Button';
import { isContractConfigured } from '@/lib/wagmi-config';
import { isDemoAuthorizedIssuer, DEMO_ISSUERS } from '@/lib/demo-data';
import { sepolia } from 'wagmi/chains';

export function AdminContent() {
  const isDemoMode = !isContractConfigured();

  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  // Call wagmi hooks directly - the providers handle hydration
  const { data: isAuthorized } = useIsAuthorizedIssuer(address || '');
  const { addIssuer, isPending: isAdding, isSuccess: isAdded, hash: addHash } = useAddIssuer();
  const { removeIssuer, isPending: isRemoving, isSuccess: isRemoved, hash: removeHash } = useRemoveIssuer();
  const { updateIssuer, isPending: isUpdating, isSuccess: isUpdated, hash: updateHash } = useUpdateIssuer();
  
  const [activeTab, setActiveTab] = useState<'add' | 'remove' | 'update' | 'list'>('list');
  const [formData, setFormData] = useState({
    issuerAddress: '',
    name: '',
    role: '',
  });
  const [demoAction, setDemoAction] = useState<{ type: string; message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddIssuer = async () => {
    if (isDemoMode) {
      setDemoAction({ type: 'add', message: `Issuer "${formData.name}" added (DEMO MODE)` });
      setTimeout(() => setDemoAction(null), 3000);
      setFormData({ issuerAddress: '', name: '', role: '' });
      return;
    }
    try {
      await addIssuer(
        formData.issuerAddress as `0x${string}`,
        formData.name,
        formData.role
      );
      setFormData({ issuerAddress: '', name: '', role: '' });
    } catch (err) {
      console.error('Error adding issuer:', err);
    }
  };

  const handleRemoveIssuer = async () => {
    if (isDemoMode) {
      setDemoAction({ type: 'remove', message: `Issuer removed (DEMO MODE)` });
      setTimeout(() => setDemoAction(null), 3000);
      setFormData({ issuerAddress: '', name: '', role: '' });
      return;
    }
    try {
      await removeIssuer(formData.issuerAddress as `0x${string}`);
      setFormData({ issuerAddress: '', name: '', role: '' });
    } catch (err) {
      console.error('Error removing issuer:', err);
    }
  };

  const handleUpdateIssuer = async () => {
    if (isDemoMode) {
      setDemoAction({ type: 'update', message: `Issuer updated (DEMO MODE)` });
      setTimeout(() => setDemoAction(null), 3000);
      setFormData({ issuerAddress: '', name: '', role: '' });
      return;
    }
    try {
      await updateIssuer(
        formData.issuerAddress as `0x${string}`,
        formData.name,
        formData.role
      );
      setFormData({ issuerAddress: '', name: '', role: '' });
    } catch (err) {
      console.error('Error updating issuer:', err);
    }
  };

  // Demo mode authorization check
  const demoIsAuthorized = isDemoMode; // Allow demo mode access for all
  const displayIsAuthorized = isDemoMode ? demoIsAuthorized : isAuthorized;

  if (!isDemoMode && !isContractConfigured()) {
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

  if (!isDemoMode && !isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Wallet</h3>
            <p className="text-gray-600 mb-4">
              Connect your wallet to access the admin dashboard.
            </p>
            <Button onClick={() => window.location.reload()}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isDemoMode && chain?.id !== sepolia.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wrong Network</h3>
            <p className="text-gray-600 mb-4">
              Please switch to Sepolia testnet to manage issuers.
            </p>
            <Button onClick={() => switchChain({ chainId: sepolia.id })}>
              Switch to Sepolia
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Note: In a real app, you'd check for DEFAULT_ADMIN_ROLE instead of ISSUER_ROLE
  // For demo purposes, we'll allow any authorized issuer to see this page
  if (displayIsAuthorized === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Not Authorized</h3>
            <p className="text-gray-600 mb-4">
              You are not authorized to manage issuers. Contact an administrator.
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage authorized certificate issuers
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Admin Access Required:</strong> Only accounts with DEFAULT_ADMIN_ROLE can manage issuers. 
                This is a demo interface - in production, implement proper role checking.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              List Issuers
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`${
                activeTab === 'add'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Add Issuer
            </button>
            <button
              onClick={() => setActiveTab('remove')}
              className={`${
                activeTab === 'remove'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Remove Issuer
            </button>
            <button
              onClick={() => setActiveTab('update')}
              className={`${
                activeTab === 'update'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Update Issuer
            </button>
          </nav>
        </div>

        {/* Demo Action Notification */}
        {demoAction && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-amber-900">{demoAction.message}</p>
          </div>
        )}

        {/* List Issuers Tab */}
        {activeTab === 'list' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Authorized Issuers</h2>
            <div className="space-y-4">
              {(isDemoMode ? DEMO_ISSUERS : []).map((issuer) => (
                <div key={issuer.address} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{issuer.name}</p>
                      <p className="text-sm text-gray-600">{issuer.role}</p>
                      <p className="text-sm text-gray-500 font-mono mt-1">{issuer.address}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      issuer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {issuer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
              {isDemoMode && DEMO_ISSUERS.length === 0 && (
                <p className="text-gray-500 text-center py-4">No issuers in demo mode</p>
              )}
              {!isDemoMode && (
                <p className="text-gray-500 text-center py-4">
                  Connect to the contract to view real issuers
                </p>
              )}
            </div>
          </div>
        )}

        {/* Add Issuer Form */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Issuer</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuer Wallet Address
                </label>
                <input
                  type="text"
                  name="issuerAddress"
                  value={formData.issuerAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuer Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., University of Blockchain"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Department Issuer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {isAdded && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900">Issuer added successfully!</p>
                  {addHash && (
                    <p className="text-sm text-gray-600 mt-2">
                      Transaction: {(addHash as string).slice(0, 10)}...{(addHash as string).slice(-8)}
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={handleAddIssuer}
                disabled={isAdding || !formData.issuerAddress || !formData.name || !formData.role}
              >
                {isAdding ? 'Adding...' : isDemoMode ? 'Add Issuer (Demo)' : 'Add Issuer'}
              </Button>
            </div>
          </div>
        )}

        {/* Remove Issuer Form */}
        {activeTab === 'remove' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Remove Issuer</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuer Wallet Address
                </label>
                <input
                  type="text"
                  name="issuerAddress"
                  value={formData.issuerAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-900">
                  <strong>Warning:</strong> This action will revoke the issuer's ability to issue certificates. 
                  This action cannot be undone.
                </p>
              </div>

              {isRemoved && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900">Issuer removed successfully!</p>
                  {removeHash && (
                    <p className="text-sm text-gray-600 mt-2">
                      Transaction: {(removeHash as string).slice(0, 10)}...{(removeHash as string).slice(-8)}
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={handleRemoveIssuer}
                disabled={isRemoving || !formData.issuerAddress}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                {isRemoving ? 'Removing...' : isDemoMode ? 'Remove Issuer (Demo)' : 'Remove Issuer'}
              </Button>
            </div>
          </div>
        )}

        {/* Update Issuer Form */}
        {activeTab === 'update' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Update Issuer Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuer Wallet Address
                </label>
                <input
                  type="text"
                  name="issuerAddress"
                  value={formData.issuerAddress}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., University of Blockchain"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Department Issuer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {isUpdated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900">Issuer updated successfully!</p>
                  {updateHash && (
                    <p className="text-sm text-gray-600 mt-2">
                      Transaction: {(updateHash as string).slice(0, 10)}...{(updateHash as string).slice(-8)}
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={handleUpdateIssuer}
                disabled={isUpdating || !formData.issuerAddress || !formData.name || !formData.role}
              >
                {isUpdating ? 'Updating...' : isDemoMode ? 'Update Issuer (Demo)' : 'Update Issuer'}
              </Button>
            </div>
          </div>
        )}
        {isDemoMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">Demo Mode Active</h3>
            <p className="text-amber-800 text-sm">
              You can test the issuer management workflow in demo mode. No real blockchain transactions will occur.
              To manage real issuers, deploy the smart contract and configure NEXT_PUBLIC_CONTRACT_ADDRESS.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
