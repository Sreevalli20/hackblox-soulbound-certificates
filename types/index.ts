export interface Certificate {
  tokenId: bigint;
  recipient: string;
  recipientName: string;
  certificateTitle: string;
  courseName: string;
  institution: string;
  issueDate: bigint;
  grade: string;
  issuer: string;
  isRevoked: boolean;
  revocationDate: bigint;
  revocationReason: string;
  metadataURI: string;
}

export interface Issuer {
  address: string;
  name: string;
  role: string;
  isActive: boolean;
  addedDate: bigint;
}

export interface CertificateMetadata {
  name: string;
  description: string;
  image?: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export interface CertificateFormData {
  recipient: string;
  recipientName: string;
  certificateTitle: string;
  courseName: string;
  institution: string;
  grade: string;
  metadataURI: string;
}

export interface IssuerFormData {
  address: string;
  name: string;
  role: string;
}

export interface VerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  error?: string;
}

export interface TransactionState {
  status: 'idle' | 'preparing' | 'waiting' | 'submitted' | 'confirming' | 'success' | 'error';
  hash?: string;
  error?: string;
  tokenId?: bigint;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const SEPOLIA_NETWORK: NetworkConfig = {
  chainId: 11155111,
  name: 'Sepolia',
  rpcUrl: 'https://rpc.sepolia.org',
  blockExplorer: 'https://sepolia.etherscan.io',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
};
