const hre = require("hardhat");

async function main() {
  const CONTRACT_NAME = "Soulbound Certificate";
  const CONTRACT_SYMBOL = "SBC";

  console.log("Deploying SoulboundCertificate...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  const SoulboundCertificate = await hre.ethers.getContractFactory("SoulboundCertificate");
  const contract = await SoulboundCertificate.deploy(
    CONTRACT_NAME,
    CONTRACT_SYMBOL,
    deployer.address
  );

  await contract.deployed();
  console.log("SoulboundCertificate deployed to:", contract.address);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await contract.deployTransaction.wait(5);

  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", contract.address);
  console.log("Deployer:", deployer.address);
  console.log("Network:", (await hre.ethers.provider.getNetwork()).name);
  console.log("Transaction Hash:", contract.deployTransaction.hash);

  // Verify deployment
  const name = await contract.name();
  const symbol = await contract.symbol();
  console.log("\nContract Verification:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);

  console.log("\n=== Environment Variable ===");
  console.log("Add this to your .env.local file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contract.address}`);

  console.log("\n=== Next Steps ===");
  console.log("1. Add NEXT_PUBLIC_CONTRACT_ADDRESS to your .env.local file");
  console.log("2. Verify contract on Etherscan (if needed):");
  console.log(`   npx hardhat verify --network sepolia ${contract.address} "${CONTRACT_NAME}" "${CONTRACT_SYMBOL}" ${deployer.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
