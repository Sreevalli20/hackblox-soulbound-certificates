const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x43aF2D5749758E2668d46Cb5BA1A2Efc74C27Cc8";
  const EXPECTED_DEPLOYER = "0x448f9Cee1b4684f0e7b6929D8C2F57F0A3938fad";
  const RECIPIENT_NAME = "Kommavarapu Kanmeswari Sreevalli";

  console.log("=== Step 1: Verify Deployment Wallet ===");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address from wallet:", deployer.address);
  console.log("Expected deployer address:", EXPECTED_DEPLOYER);
  
  if (deployer.address.toLowerCase() !== EXPECTED_DEPLOYER.toLowerCase()) {
    throw new Error(`Deployer address mismatch! Expected ${EXPECTED_DEPLOYER}, got ${deployer.address}`);
  }
  console.log("✓ Deployer address verified");

  console.log("\n=== Step 2: Verify ISSUER_ROLE on Contract ===");
  const contract = await hre.ethers.getContractAt("SoulboundCertificate", CONTRACT_ADDRESS);
  const ISSUER_ROLE = await contract.ISSUER_ROLE();
  const hasIssuerRole = await contract.hasRole(ISSUER_ROLE, deployer.address);
  console.log("Has ISSUER_ROLE:", hasIssuerRole);
  
  if (!hasIssuerRole) {
    throw new Error(`Deployer ${deployer.address} does not have ISSUER_ROLE on contract ${CONTRACT_ADDRESS}`);
  }
  console.log("✓ ISSUER_ROLE verified");

  console.log("\n=== Step 3: Mint Certificate ===");
  const recipient = deployer.address;
  const certificateTitle = "Certificate of Achievement";
  const courseName = "Blockchain Development";
  const institution = "HackBlox 2026";
  const grade = "A";
  const metadataURI = "ipfs://QmPlaceholder";

  console.log("Recipient:", recipient);
  console.log("Recipient Name:", RECIPIENT_NAME);
  console.log("Certificate Title:", certificateTitle);
  console.log("Course:", courseName);
  console.log("Institution:", institution);
  console.log("Grade:", grade);

  const tx = await contract.issueCertificate(
    recipient,
    RECIPIENT_NAME,
    certificateTitle,
    courseName,
    institution,
    grade,
    metadataURI
  );

  console.log("Transaction submitted. Hash:", tx.hash);
  console.log("Waiting for confirmation...");
  
  const receipt = await tx.wait();
  console.log("✓ Transaction confirmed in block:", receipt.blockNumber);

  console.log("\n=== Step 4: Extract Token ID ===");
  const event = receipt.logs.find((log) => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed && parsed.name === "CertificateIssued";
    } catch (e) {
      return false;
    }
  });

  if (!event) {
    throw new Error("CertificateIssued event not found in transaction logs");
  }

  const parsedEvent = contract.interface.parseLog(event);
  const tokenId = parsedEvent.args.tokenId;
  console.log("✓ Token ID:", tokenId.toString());

  console.log("\n=== Step 5: Verify Certificate on Chain ===");
  const certificate = await contract.getCertificate(tokenId);
  console.log("Certificate Details:");
  console.log("- Recipient:", certificate.recipient);
  console.log("- Recipient Name:", certificate.recipientName);
  console.log("- Certificate Title:", certificate.certificateTitle);
  console.log("- Course:", certificate.courseName);
  console.log("- Institution:", certificate.institution);
  console.log("- Grade:", certificate.grade);
  console.log("- Issue Date:", new Date(Number(certificate.issueDate) * 1000).toISOString());
  console.log("- Issuer:", certificate.issuer);
  console.log("- Is Revoked:", certificate.isRevoked);

  const isValid = await contract.verifyCertificate(tokenId);
  console.log("Certificate Valid:", isValid);

  console.log("\n=== RESULTS ===");
  console.log("Token ID:", tokenId.toString());
  console.log("Mint Transaction Hash:", tx.hash);
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("Network: Sepolia");
  console.log("Certificate URL:", `https://sepolia.etherscan.io/tx/${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
