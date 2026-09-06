import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';

const CONTRACT_ADDRESS = '0x43aF2D5749758E2668d46Cb5BA1A2Efc74C27Cc8';
const CONTRACT_ABI = parseAbi([
  'function getCertificate(uint256 tokenId) view returns (address recipient, string recipientName, string certificateTitle, string courseName, string institution, uint256 issueDate, string grade, address issuer, bool isRevoked, uint256 revocationDate, string revocationReason)',
  'function verifyCertificate(uint256 tokenId) view returns (bool)',
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const resolvedParams = await params;
    const tokenId = BigInt(resolvedParams.tokenId);

    const client = createPublicClient({
      chain: sepolia,
      transport: http('https://rpc.sepolia.org', {
        timeout: 30000,
        retryCount: 3,
      }),
    });

    const certificate = await client.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getCertificate',
      args: [tokenId],
    }) as any;

    const isValid = await client.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'verifyCertificate',
      args: [tokenId],
    }) as boolean;

    return NextResponse.json({
      certificate,
      isValid,
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate', details: String(error) },
      { status: 500 }
    );
  }
}