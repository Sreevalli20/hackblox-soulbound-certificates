# Soulbound Certificates - HackBlox 2026

A full-stack Web3 dApp for issuing and verifying non-transferable NFT certificates on Ethereum Sepolia testnet. Built for HackBlox 2026 Web3 Track Problem Statement 2.

## Overview

Soulbound Certificates enables authorized institutions to issue tamper-resistant academic credentials that are:
- **Non-transferable**: Certificates cannot be sold, traded, or transferred between wallets
- **Instantly verifiable**: Anyone can verify authenticity on-chain without contacting the issuer
- **Cryptographically secure**: Built on Ethereum with OpenZeppelin contracts
- **Decentralized metadata**: IPFS integration with local fallback for demo mode

## Features

### Smart Contract Features
- ERC721 soulbound implementation with transfer restrictions
- Role-based access control (DEFAULT_ADMIN_ROLE, ISSUER_ROLE)
- Multi-tier issuer system (University Admin, Department Issuer)
- Certificate minting with on-chain metadata
- Certificate revocation with reasons
- Events for issuance, revocation, and issuer management
- Custom errors for better security and gas optimization

### Frontend Features
- Wallet connection with MetaMask support
- Network detection (Sepolia testnet)
- Public verification page (by token ID or wallet address)
- Certificate detail page with QR code generation
- Issuer dashboard for minting certificates
- Issuer search and information display
- Admin dashboard for issuer management
- Blockchain explorer integration (Sepolia Etherscan)
- Responsive design with Tailwind CSS
- Premium dark theme with glass morphism effects

## Tech Stack

### Blockchain
- **Solidity 0.8.24**: Smart contract development
- **OpenZeppelin Contracts 4.9.6**: Secure contract building blocks
- **Hardhat 2.29.1**: Development, testing, and deployment
- **Ethereum Sepolia**: Testnet deployment (Chain ID: 11155111)

### Frontend
- **Next.js 16.3.4**: React framework with App Router and Turbopack
- **React 19.2.8**: UI library
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Wagmi 3.7.7**: React hooks for Ethereum
- **Viem 2.56.3**: TypeScript Ethereum library
- **React QR Code 2.2.0**: QR code generation
- **TanStack Query 5.102.8**: Data fetching and caching

### Infrastructure
- **IPFS**: Decentralized metadata storage (Pinata with local fallback)
- **Vercel**: Frontend deployment
- **Public RPC**: No API keys required (uses public Sepolia RPC)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard for issuer management
│   ├── certificate/[tokenId]/ # Certificate detail page
│   ├── issuer/            # Issuer dashboard
│   ├── issuers/           # Issuers list page
│   ├── verify/            # Verification page
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx     # Navigation bar
│   ├── Providers.tsx     # Wagmi/Query providers
│   ├── WalletConnect.tsx # Wallet connection component
│   └── ui/               # UI components (Button)
├── contracts/             # Solidity contracts
│   └── SoulboundCertificate.sol
├── hooks/                 # Custom React hooks
│   └── useContract.ts    # Wagmi contract hooks
├── lib/                   # Utilities
│   ├── metadata-provider.ts # IPFS metadata abstraction
│   └── wagmi-config.ts   # Wagmi configuration
├── scripts/               # Deployment scripts
│   └── deploy.ts         # Contract deployment script
├── test/                  # Hardhat tests
│   └── SoulboundCertificate.test.cjs
├── types/                 # TypeScript types
│   └── index.ts
├── hardhat.config.cjs     # Hardhat configuration
├── next.config.ts         # Next.js configuration
├── package.json          # Dependencies
└── env.example           # Environment variables template
```

## Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
# Required for frontend to work
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address_here

# Optional: Pinata JWT for IPFS metadata upload (DO NOT commit actual JWT)
# PINATA_JWT=your_pinata_jwt_here

# Optional: WalletConnect Project ID
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Optional: Sepolia RPC URL (defaults to public RPC if not set)
# SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Deployment Configuration (for contract deployment only - DO NOT commit)
# PRIVATE_KEY=your_private_key_here
# ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**Important**: Never commit `.env.local` or any file containing private keys or API keys to GitHub.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Sreevalli20/hackblox-soulbound-certificates.git
cd hackblox-soulbound-certificates
```

2. Install dependencies:
```bash
npm install
```

## Smart Contract Development

### Compile Contract
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

Expected output: 16 passing tests covering deployment, issuance, soulbound behavior, revocation, and verification.

### Deploy to Sepolia

First, ensure you have Sepolia ETH in your wallet. Then:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

The deployment script will:
- Deploy the contract with your account as admin
- Output the contract address
- Provide the environment variable to add
- Provide the verification command

Add the contract address to your `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### Verify Contract on Etherscan

If you have an Etherscan API key in your `.env`:
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "Soulbound Certificate" "SBC" <DEPLOYER_ADDRESS>
```

## Frontend Development

### Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

The build will succeed even without a configured contract address (shows warning messages).

## Demo Flow

### Sample Participant Name
For all demo certificates, use the name:
**Kommavarapu Kanmeswari Sreevalli**

### End-to-End Demo

1. **Admin Setup** (one-time):
   - Deploy contract as admin
   - Admin wallet is automatically registered as initial issuer

2. **Add Issuer** (optional):
   - Navigate to `/admin`
   - Connect admin wallet
   - Add new issuer address with name and role

3. **Issue Certificate**:
   - Navigate to `/issuer`
   - Connect authorized issuer wallet
   - Click "Issue New Certificate"
   - Fill in:
     - Recipient Wallet: `0x...` (recipient's address)
     - Recipient Name: `Kommavarapu Kanmeswari Sreevalli`
     - Certificate Title: `Certificate of Completion`
     - Course Name: `Blockchain & Web3 Credentials`
     - Institution: `HackBlox University`
     - Grade: `A`
   - Preview certificate
   - Confirm and issue (requires wallet confirmation)
   - Wait for transaction confirmation
   - Note the token ID

4. **Verify Certificate**:
   - Navigate to `/verify`
   - Enter the token ID
   - View verification status (VALID/REVOKED)
   - Click "View Full Certificate"

5. **Generate QR Code**:
   - On certificate detail page, click "Generate QR"
   - QR code points to public verification URL
   - Scan to verify on mobile

6. **Revoke Certificate** (optional):
   - Navigate to certificate detail page
   - As authorized issuer, revoke with reason
   - Verification status changes to REVOKED

## Usage Guide

### For Certificate Issuers

1. **Connect Wallet**: Click "Connect Wallet" in the navigation
2. **Switch to Sepolia**: Ensure your wallet is on Ethereum Sepolia testnet (auto-switch available)
3. **Access Issuer Dashboard**: Navigate to "/issuer"
4. **Issue Certificate**:
   - Click "Issue New Certificate"
   - Fill in recipient wallet address
   - Enter recipient name, certificate title, course name, institution, and grade
   - Preview the certificate
   - Confirm and issue (requires gas)
5. **View Issued Certificates**: Check "Your Recent Certificates" section
6. **Manage Issuers (Admin)**: Navigate to "/admin" to add, remove, or update authorized issuers

### For Certificate Verification

1. **Navigate to Verify Page**: Go to "/verify"
2. **Search by Token ID**: Enter the certificate token ID
3. **View Results**: See verification status and certificate details
4. **View Full Certificate**: Click "View Full Certificate" for detailed view with QR code

### For Certificate Recipients

1. **View Your Certificates**: Navigate to "/verify" and search by your wallet address
2. **Generate QR Code**: Click "Generate QR" on certificate detail page
3. **Share Verification**: Share the QR code or verification URL

## Smart Contract Functions

### Read Functions
- `getCertificate(tokenId)`: Get certificate details
- `verifyCertificate(tokenId)`: Check if certificate is valid
- `isAuthorizedIssuer(address)`: Check if address is authorized issuer
- `issuers(address)`: Get issuer information
- `getRecipientCertificates(address)`: Get all certificates for a recipient
- `totalCertificates()`: Get total number of certificates issued
- `ownerOf(tokenId)`: Get owner of a token
- `tokenURI(tokenId)`: Get token metadata URI

### Write Functions (Issuer Only)
- `issueCertificate(recipient, recipientName, certificateTitle, courseName, institution, grade, metadataURI)`: Issue new certificate
- `revokeCertificate(tokenId, reason)`: Revoke a certificate

### Write Functions (Admin Only)
- `addIssuer(address, name, role)`: Add new authorized issuer
- `removeIssuer(address)`: Remove issuer
- `updateIssuer(address, name, role)`: Update issuer info

### Events
- `CertificateIssued(tokenId, recipient, recipientName, issuer, issueDate)`: Emitted when certificate is issued
- `CertificateRevoked(tokenId, issuer, revocationDate, reason)`: Emitted when certificate is revoked
- `IssuerAdded(issuer, name, role, addedDate)`: Emitted when issuer is added
- `IssuerRemoved(issuer)`: Emitted when issuer is removed
- `IssuerUpdated(issuer, name, role)`: Emitted when issuer is updated

## Deployment to Vercel

1. **Push to GitHub**: Push your code to the GitHub repository
2. **Connect to Vercel**: Import the repository in Vercel dashboard
3. **Configure Environment Variables**: Add `NEXT_PUBLIC_CONTRACT_ADDRESS` in Vercel settings
4. **Deploy**: Vercel will automatically deploy the Next.js app
5. **Verify**: Check the deployed URL to ensure everything works

**Note**: The build will succeed without a contract address, but the app will show a configuration warning.

## Testing

The project includes comprehensive Solidity tests covering:
- Deployment verification (name, symbol, roles)
- Certificate issuance (authorized, unauthorized, zero address)
- Soulbound behavior (transferFrom, approve, setApprovalForAll restrictions)
- Certificate revocation (revoke, double revocation prevention)
- Certificate verification (valid, revoked, non-existent)
- Access control (role-based permissions)

Run tests with:
```bash
npx hardhat test
```

Expected output: 16 passing tests

## Security Considerations

- **No Private Keys**: Private keys are never stored in the frontend
- **Environment Variables**: Sensitive data is stored in environment variables and never committed
- **Role-Based Access**: Only authorized issuers can mint certificates
- **Soulbound Design**: Certificates cannot be transferred or sold
- **On-Chain Verification**: All verification happens on-chain
- **Custom Errors**: Uses Solidity custom errors for gas optimization
- **Reentrancy Protection**: OpenZeppelin contracts provide reentrancy guards
- **Access Control**: OpenZeppelin AccessControl for role management

## Known Limitations

- **Sepolia Testnet**: Currently designed for Sepolia testnet only
- **IPFS Fallback**: Uses local storage if IPFS is not configured (demo mode)
- **Admin Role**: Admin dashboard uses ISSUER_ROLE check instead of DEFAULT_ADMIN_ROLE for demo purposes
- **Gas Costs**: Users need Sepolia ETH for transactions
- **No Backend**: Fully decentralized, no traditional backend server

## Architecture Decisions

- **No API Keys**: Uses public RPC endpoints to avoid requiring Alchemy/Infura keys
- **Local Metadata Fallback**: App works without Pinata for demo purposes
- **Client-Side Only**: No backend server required, fully decentralized
- **OpenZeppelin**: Industry-standard contracts for security
- **TypeScript**: Type safety throughout the stack
- **Turbopack**: Faster Next.js builds with Turbopack

## HackBlox 2026 Judging Criteria

### Working Demo (40%)
✅ Smart contract deployed to Sepolia testnet
✅ Frontend deployed to Vercel
✅ Wallet connection and transaction flow
✅ Certificate issuance and verification
✅ QR code generation and scanning

### Smart Contract Correctness/Security (25%)
✅ ERC721 soulbound implementation
✅ Role-based access control (DEFAULT_ADMIN_ROLE, ISSUER_ROLE)
✅ Transfer restrictions (transferFrom, approve, setApprovalForAll)
✅ Certificate revocation mechanism
✅ Custom errors for gas optimization
✅ Comprehensive test suite (16 tests passing)
✅ OpenZeppelin contracts used

### UI/UX (20%)
✅ Premium dark theme with glass morphism
✅ Responsive design (mobile, tablet, desktop)
✅ Clear wallet connection flow
✅ Network switching (Sepolia)
✅ Transaction state feedback (pending, confirming, success)
✅ Error handling and user feedback
✅ Certificate preview before minting
✅ QR code generation

### Creativity (15%)
✅ QR verification feature
✅ IPFS metadata integration with fallback
✅ Issuer management system
✅ Certificate revocation with reasons
✅ Public verification page
✅ Premium certificate presentation
✅ Explorer integration

## Participant Information

**Name**: Kommavarapu Kanmeswari Sreevalli
**Hackathon**: HackBlox 2026
**Track**: Web3 Track
**Problem Statement**: PS2 - On-Chain Verifiable Credentials (Soulbound Certificates)

## License

MIT License - Feel free to use this project for learning and development.

## Support

For issues or questions, please open an issue on the GitHub repository:
https://github.com/Sreevalli20/hackblox-soulbound-certificates
