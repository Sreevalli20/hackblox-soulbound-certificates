'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import { getContractAddress, isContractConfigured } from '@/lib/wagmi-config';

const CONTRACT_ABI = parseAbi([
  // Read functions
  'function getCertificate(uint256 tokenId) view returns (address recipient, string recipientName, string certificateTitle, string courseName, string institution, uint256 issueDate, string grade, address issuer, bool isRevoked, uint256 revocationDate, string revocationReason)',
  'function verifyCertificate(uint256 tokenId) view returns (bool)',
  'function isAuthorizedIssuer(address issuer) view returns (bool)',
  'function issuers(address) view returns (string name, string role, bool isActive, uint256 addedDate)',
  'function getRecipientCertificates(address recipient) view returns (uint256[])',
  'function totalCertificates() view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  
  // Write functions
  'function issueCertificate(address recipient, string recipientName, string certificateTitle, string courseName, string institution, string grade, string metadataURI) returns (uint256)',
  'function revokeCertificate(uint256 tokenId, string reason)',
  'function addIssuer(address issuer, string name, string role)',
  'function removeIssuer(address issuer)',
  'function updateIssuer(address issuer, string name, string role)',
  
  // Events
  'event CertificateIssued(uint256 indexed tokenId, address indexed recipient, string recipientName, address indexed issuer, uint256 issueDate)',
  'event CertificateRevoked(uint256 indexed tokenId, address indexed issuer, uint256 revocationDate, string reason)',
]);

export function useCertificate(tokenId: bigint) {
  const contractAddress = getContractAddress();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getCertificate',
    args: [tokenId],
    query: {
      enabled: isContractConfigured() && tokenId !== undefined,
    },
  });
}

export function useVerifyCertificate(tokenId: bigint) {
  const contractAddress = getContractAddress();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'verifyCertificate',
    args: [tokenId],
    query: {
      enabled: isContractConfigured() && tokenId !== undefined,
    },
  });
}

export function useIsAuthorizedIssuer(address: string) {
  const contractAddress = getContractAddress();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'isAuthorizedIssuer',
    args: [address as `0x${string}`],
    query: {
      enabled: isContractConfigured() && address !== undefined,
    },
  });
}

export function useIssuerInfo(address: string) {
  const contractAddress = getContractAddress();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'issuers',
    args: [address as `0x${string}`],
    query: {
      enabled: isContractConfigured() && address !== undefined,
    },
  });
}

export function useRecipientCertificates(address: string) {
  const contractAddress = getContractAddress();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getRecipientCertificates',
    args: [address as `0x${string}`],
    query: {
      enabled: isContractConfigured() && address !== undefined,
    },
  });
}

export function useTotalCertificates() {
  const contractAddress = getContractAddress();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'totalCertificates',
    query: {
      enabled: isContractConfigured(),
    },
  });
}

export function useIssueCertificate() {
  const contractAddress = getContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const issueCertificate = (
    recipient: `0x${string}`,
    recipientName: string,
    certificateTitle: string,
    courseName: string,
    institution: string,
    grade: string,
    metadataURI: string
  ) => {
    if (!isContractConfigured()) {
      throw new Error('Contract not configured');
    }
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'issueCertificate',
      args: [recipient, recipientName, certificateTitle, courseName, institution, grade, metadataURI],
    });
  };

  return {
    issueCertificate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useRevokeCertificate() {
  const contractAddress = getContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const revokeCertificate = (tokenId: bigint, reason: string) => {
    if (!isContractConfigured()) {
      throw new Error('Contract not configured');
    }
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'revokeCertificate',
      args: [tokenId, reason],
    });
  };

  return {
    revokeCertificate,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useAddIssuer() {
  const contractAddress = getContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const addIssuer = (issuer: `0x${string}`, name: string, role: string) => {
    if (!isContractConfigured()) {
      throw new Error('Contract not configured');
    }
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'addIssuer',
      args: [issuer, name, role],
    });
  };

  return {
    addIssuer,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useRemoveIssuer() {
  const contractAddress = getContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const removeIssuer = (issuer: `0x${string}`) => {
    if (!isContractConfigured()) {
      throw new Error('Contract not configured');
    }
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'removeIssuer',
      args: [issuer],
    });
  };

  return {
    removeIssuer,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useUpdateIssuer() {
  const contractAddress = getContractAddress();
  
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const updateIssuer = (issuer: `0x${string}`, name: string, role: string) => {
    if (!isContractConfigured()) {
      throw new Error('Contract not configured');
    }
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'updateIssuer',
      args: [issuer, name, role],
    });
  };

  return {
    updateIssuer,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
