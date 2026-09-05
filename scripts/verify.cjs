const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("Please provide CONTRACT_ADDRESS in your environment variables");
    console.error("Example: CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.ts --network sepolia");
    process.exit(1);
  }

  console.log("Verifying SoulboundCertificate on Sepolia...");
  console.log("Contract Address:", contractAddress);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [
        "Soulbound Certificate",
        "SBC",
        process.env.DEPLOYER_ADDRESS || (await hre.ethers.getSigners())[0].address
      ],
    });
    console.log("\n✓ Contract verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✓ Contract is already verified on Etherscan");
    } else {
      console.error("\n✗ Verification failed:");
      console.error(error);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
