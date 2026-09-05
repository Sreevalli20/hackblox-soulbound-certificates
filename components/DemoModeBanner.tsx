'use client';

import { isContractConfigured } from '@/lib/wagmi-config';

export function DemoModeBanner() {
  if (isContractConfigured()) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center text-sm font-medium">
      <span className="inline-flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        Demo Mode - Using simulated blockchain data. Configure NEXT_PUBLIC_CONTRACT_ADDRESS for real Sepolia integration.
      </span>
    </div>
  );
}
