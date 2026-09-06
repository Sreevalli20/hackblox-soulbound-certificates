import { use } from 'react';
import { CertificateContent } from './CertificateContent';

export default function CertificateDetailPage({ params }: { params: Promise<{ tokenId: string }> }) {
  const resolvedParams = use(params);
  return <CertificateContent tokenId={resolvedParams.tokenId} />;
}