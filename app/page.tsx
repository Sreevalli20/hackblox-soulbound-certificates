import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-300 ring-1 ring-white/10 hover:ring-white/20">
                Built for HackBlox 2026 by Kommavarapu Kanmeswari Sreevalli
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Credentials You Can Verify.
                <span className="block text-blue-400">Trust You Can Prove.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Tamper-resistant academic credentials secured by Ethereum and verified instantly. 
                Non-transferable soulbound certificates that prove authenticity on-chain.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/verify">
                  <Button size="lg">
                    Verify a Certificate
                  </Button>
                </Link>
                <Link href="/issuer">
                  <Button variant="outline" size="lg">
                    Issue Certificate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Traditional vs On-Chain Verification
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              See how blockchain technology transforms credential verification
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-blue-50 p-2 ring-1 ring-inset ring-blue-700/10">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <dt className="mt-4 font-semibold text-gray-900">Days → Seconds</dt>
                <dd className="mt-2 leading-7 text-gray-600">
                  Traditional verification takes days. On-chain verification is instant.
                </dd>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-blue-50 p-2 ring-1 ring-inset ring-blue-700/10">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <dt className="mt-4 font-semibold text-gray-900">Email → Cryptographic</dt>
                <dd className="mt-2 leading-7 text-gray-600">
                  Replace email verification with cryptographic proof on the blockchain.
                </dd>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-blue-50 p-2 ring-1 ring-inset ring-blue-700/10">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <dt className="mt-4 font-semibold text-gray-900">Paper → On-Chain</dt>
                <dd className="mt-2 leading-7 text-gray-600">
                  Move from paper records to immutable on-chain proof of credentials.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Certificate Preview Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Premium Certificate Presentation
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Beautiful, verifiable certificates that recipients can proudly share
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="relative rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/10">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl"></div>
              <div className="border-2 border-blue-200 rounded-lg p-6 bg-white">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Certificate of Completion</h3>
                  <p className="text-lg text-gray-600 mb-4">Advanced Web3 Development</p>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-gray-900 font-semibold">Kommavarapu Kanmeswari Sreevalli</p>
                    <p className="text-sm text-gray-500 mt-1">HackBlox University</p>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>✓ VERIFIED ON-CHAIN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Issue Your First Certificate?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Connect your wallet and start issuing verifiable, soulbound certificates today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/issuer">
                <Button size="lg" variant="outline">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="ghost">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
