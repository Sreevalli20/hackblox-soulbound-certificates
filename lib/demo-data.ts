// Demo mode data and utilities for when contract is not deployed

export interface DemoCertificate {
  tokenId: string;
  recipient: string;
  recipientName: string;
  certificateTitle: string;
  courseName: string;
  institution: string;
  grade: string;
  issueDate: string;
  issuer: string;
  issuerName: string;
  issuerRole: string;
  isRevoked: boolean;
  revocationDate?: string;
  revocationReason?: string;
  metadataURI: string;
}

export interface DemoIssuer {
  address: string;
  name: string;
  role: string;
  isActive: boolean;
  addedDate: string;
}

// Demo certificate for Kommavarapu Kanmeswari Sreevalli
export const DEMO_CERTIFICATE: DemoCertificate = {
  tokenId: '1',
  recipient: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  recipientName: 'Kommavarapu Kanmeswari Sreevalli',
  certificateTitle: 'Certificate of Completion',
  courseName: 'Advanced Web3 Development',
  institution: 'HackBlox University',
  grade: 'A',
  issueDate: new Date('2024-01-15').toISOString(),
  issuer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  issuerName: 'HackBlox University',
  issuerRole: 'University Admin',
  isRevoked: false,
  metadataURI: 'ipfs://demo-metadata-cid',
};

// Demo issuers
export const DEMO_ISSUERS: DemoIssuer[] = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    name: 'HackBlox University',
    role: 'University Admin',
    isActive: true,
    addedDate: new Date('2024-01-01').toISOString(),
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    name: 'Computer Science Department',
    role: 'Department Issuer',
    isActive: true,
    addedDate: new Date('2024-01-05').toISOString(),
  },
];

// Demo transaction hashes (simulated)
export const DEMO_TX_HASH = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

// Get demo certificate by token ID
export function getDemoCertificate(tokenId: string): DemoCertificate | null {
  if (tokenId === '1') {
    return DEMO_CERTIFICATE;
  }
  return null;
}

// Get demo certificates by wallet address
export function getDemoCertificatesByAddress(address: string): DemoCertificate[] {
  if (address.toLowerCase() === DEMO_CERTIFICATE.recipient.toLowerCase()) {
    return [DEMO_CERTIFICATE];
  }
  return [];
}

// Get demo issuer info
export function getDemoIssuer(address: string): DemoIssuer | null {
  return DEMO_ISSUERS.find(
    issuer => issuer.address.toLowerCase() === address.toLowerCase()
  ) || null;
}

// Check if address is authorized demo issuer
export function isDemoAuthorizedIssuer(address: string): boolean {
  const issuer = getDemoIssuer(address);
  return issuer?.isActive ?? false;
}

// Get all demo issuers
export function getAllDemoIssuers(): DemoIssuer[] {
  return DEMO_ISSUERS;
}

// Simulate certificate verification
export function verifyDemoCertificate(tokenId: string): boolean {
  const cert = getDemoCertificate(tokenId);
  return cert ? !cert.isRevoked : false;
}
