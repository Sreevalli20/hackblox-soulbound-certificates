import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">About Soulbound Certificates</h1>
          <p className="mt-4 text-xl text-gray-600">
            Tamper-resistant academic credentials secured by Ethereum
          </p>
        </div>

        {/* What are Soulbound Certificates */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What are Soulbound Certificates?</h2>
          <p className="text-gray-600 mb-4">
            Soulbound certificates are non-transferable NFTs that represent academic credentials, certifications, 
            and achievements. Unlike traditional NFTs, they cannot be sold, traded, or transferred between wallets, 
            ensuring that the certificate remains permanently bound to the recipient.
          </p>
          <p className="text-gray-600">
            Built on Ethereum Sepolia testnet, these certificates provide cryptographically verifiable proof of 
            authenticity that anyone can verify instantly without contacting the issuing institution.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Authorized Issuers</h3>
                <p className="text-gray-600">
                  Only authorized institutions and organizations can issue certificates. 
                  Issuers are registered on-chain with their roles and permissions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Certificate Issuance</h3>
                <p className="text-gray-600">
                  Issuers mint certificates directly to a recipient's wallet address with all 
                  relevant metadata stored on-chain and on IPFS.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instant Verification</h3>
                <p className="text-gray-600">
                  Anyone can verify a certificate's authenticity by checking the blockchain, 
                  eliminating the need for email verification or contacting institutions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Revocation Protection</h3>
                <p className="text-gray-600">
                  Issuers can revoke certificates if needed (e.g., for academic dishonesty), 
                  and revocation is permanently recorded on-chain.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Verification</h3>
              <p className="text-gray-600">
                Verify credentials in seconds instead of days. No need to contact institutions 
                or wait for email responses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tamper-Resistant</h3>
              <p className="text-gray-600">
                Blockchain immutability ensures certificates cannot be forged or altered 
                without detection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Non-Transferable</h3>
              <p className="text-gray-600">
                Soulbound design prevents certificate trading or transfer, ensuring 
                credentials remain with the rightful owner.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Global Access</h3>
              <p className="text-gray-600">
                Anyone with internet access can verify certificates from anywhere in the world, 
                at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Blockchain</h3>
              <p className="text-gray-600">
                Ethereum Sepolia testnet with ERC721 soulbound implementation using OpenZeppelin contracts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
              <p className="text-gray-600">
                Next.js 14 with TypeScript, Tailwind CSS, Wagmi, and viem for Web3 integration.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Metadata Storage</h3>
              <p className="text-gray-600">
                IPFS for decentralized metadata storage with local fallback for demo mode.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Development</h3>
              <p className="text-gray-600">
                Hardhat for smart contract compilation, testing, and deployment.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/90 mb-6">
            Connect your wallet and start issuing verifiable certificates today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/verify">
              <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Verify a Certificate
              </Button>
            </Link>
            <Link href="/issuer">
              <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Issue Certificate
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Built for HackBlox 2026 by Kommavarapu Kanmeswari Sreevalli</p>
          <p className="mt-1">
            This project demonstrates the power of blockchain technology for academic credential verification.
          </p>
        </div>
      </div>
    </div>
  );
}
