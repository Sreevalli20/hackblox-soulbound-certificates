const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x43aF2D5749758E2668d46Cb5BA1A2Efc74C27Cc8";
  const TOKEN_ID = 0;
  const REVOCATION_REASON = "Test revocation for verification";

  console.log("=== Revoking Certificate ===");
  console.log("Contract:", CONTRACT_ADDRESS);
  console.log("Token ID:", TOKEN_ID);
  console.log("Reason:", REVOCATION_REASON);

  const contract = await hre.ethers.getContractAt("SoulboundCertificate", CONTRACT_ADDRESS);
  
  console.log("\nChecking current status...");
  const certBefore = await contract.getCertificate(TOKEN_ID);
  console.log("Current isRevoked:", certBefore.isRevoked);

  if (certBefore.isRevoked) {
    console.log("Certificate is already revoked. Skipping revocation.");
    return;
  }

  console.log("\nRevoking certificate...");
  const tx = await contract.revokeCertificate(TOKEN_ID, REVOCATION_REASON);
  console.log("Transaction submitted. Hash:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("✓ Transaction confirmed in block:", receipt.blockNumber);

  console.log("\nVerifying revocation...");
  const certAfter = await contract.getCertificate(TOKEN_ID);
  console.log("New isRevoked:", certAfter.isRevoked);
  console.log("Revocation Date:", new Date(Number(certAfter.revocationDate) * 1000).toISOString());
  console.log("Revocation Reason:", certAfter.revocationReason);

  const isValid = await contract.verifyCertificate(TOKEN_ID);
  console.log("Certificate Valid:", isValid);

  console.log("\n=== RESULTS ===");
  console.log("Revocation Transaction Hash:", tx.hash);
  console.log("Certificate Revoked:", certAfter.isRevoked);
  console.log("Certificate URL:", `https://sepolia.etherscan.io/tx/${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
