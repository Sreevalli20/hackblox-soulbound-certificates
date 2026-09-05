import { CertificateMetadata } from '@/types';

export interface IMetadataProvider {
  uploadMetadata(metadata: CertificateMetadata): Promise<string>;
  getMetadata(cid: string): Promise<CertificateMetadata>;
  getProviderName(): string;
}

export class LocalMetadataProvider implements IMetadataProvider {
  private storage: Map<string, CertificateMetadata> = new Map();

  async uploadMetadata(metadata: CertificateMetadata): Promise<string> {
    const cid = `local-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.storage.set(cid, metadata);
    return cid;
  }

  async getMetadata(cid: string): Promise<CertificateMetadata> {
    const metadata = this.storage.get(cid);
    if (!metadata) {
      throw new Error('Metadata not found');
    }
    return metadata;
  }

  getProviderName(): string {
    return 'Local Demo Provider';
  }
}

export class IPFSMetadataProvider implements IMetadataProvider {
  private pinataJwt: string | null;
  private pinataGateway: string;

  constructor(pinataJwt: string | null = null) {
    this.pinataJwt = pinataJwt;
    this.pinataGateway = 'https://gateway.pinata.cloud/ipfs/';
  }

  async uploadMetadata(metadata: CertificateMetadata): Promise<string> {
    if (!this.pinataJwt) {
      throw new Error('Pinata JWT not configured. Using demo mode.');
    }

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.pinataJwt}`,
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }

      const data = await response.json();
      return data.IpfsHash;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      throw new Error('IPFS upload failed. Check your Pinata configuration.');
    }
  }

  async getMetadata(cid: string): Promise<CertificateMetadata> {
    try {
      const response = await fetch(`${this.pinataGateway}${cid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch from IPFS');
      }
      return await response.json();
    } catch (error) {
      console.error('IPFS fetch failed:', error);
      throw new Error('Failed to fetch metadata from IPFS');
    }
  }

  getProviderName(): string {
    return this.pinataJwt ? 'Pinata IPFS' : 'IPFS (Demo Mode)';
  }
}

export class MetadataProviderFactory {
  private static provider: IMetadataProvider;

  static initialize(pinataJwt: string | null = null): IMetadataProvider {
    if (pinataJwt && pinataJwt.trim() !== '') {
      this.provider = new IPFSMetadataProvider(pinataJwt);
    } else {
      this.provider = new LocalMetadataProvider();
    }
    return this.provider;
  }

  static getProvider(): IMetadataProvider {
    if (!this.provider) {
      this.provider = new LocalMetadataProvider();
    }
    return this.provider;
  }

  static createCertificateMetadata(
    recipientName: string,
    certificateTitle: string,
    courseName: string,
    institution: string,
    grade: string,
    issueDate: Date
  ): CertificateMetadata {
    return {
      name: certificateTitle,
      description: `Certificate of completion for ${courseName} at ${institution}`,
      attributes: [
        {
          trait_type: 'Recipient Name',
          value: recipientName,
        },
        {
          trait_type: 'Course',
          value: courseName,
        },
        {
          trait_type: 'Institution',
          value: institution,
        },
        {
          trait_type: 'Grade',
          value: grade,
        },
        {
          trait_type: 'Issue Date',
          value: issueDate.toISOString(),
        },
      ],
    };
  }
}
