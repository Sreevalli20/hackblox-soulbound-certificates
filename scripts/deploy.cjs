const hre = require("hardhat");

async function main() {
  console.log("Deploying SoulboundCertificate to Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  const SoulboundCertificate = await hre.ethers.getContractFactory("SoulboundCertificate");
  const contract = await SoulboundCertificate.deploy(
    "Soulbound Certificate",
    "SBC",
    deployer.address
  );

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  const deploymentTx = contract.deploymentTransaction();

  console.log("\n✓ Deployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Transaction Hash:", deploymentTx?.hash);
  console.log("Block Number:", deploymentTx?.blockNumber);
  console.log("\nView on Etherscan:");
  console.log(`https://sepolia.etherscan.io/tx/${deploymentTx?.hash}`);
  console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);

  console.log("\n=== NEXT STEPS ===");
  console.log("1. Add this to your .env.local file:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n2. Verify the contract on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${contractAddress} "Soulbound Certificate" "SBC" ${deployer.address}`);
  console.log("\n3. Restart your development server to apply changes:");
  console.log("   npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n✗ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
