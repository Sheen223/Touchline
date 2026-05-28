// scripts/deploy.js
import { ethers } from "ethers";
import fs from "fs";
import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying CupFolio Hook to X Layer...");
  
  // Get the signer from Hardhat
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📡 Deploying with: ${deployer.address}`);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} X`);
  
  const CupFolioHook = await hre.ethers.getContractFactory("CupFolioHook");
  const hook = await CupFolioHook.deploy();
  
  await hook.waitForDeployment();
  const hookAddress = await hook.getAddress();
  
  console.log(`\n✅ CupFolioHook deployed to: ${hookAddress}`);
  console.log(`🔗 Explorer: https://www.okx.com/xlayer/explorer/address/${hookAddress}`);
  
  await hook.setAIAgent(deployer.address);
  console.log(`\n🤖 AI Agent set to: ${deployer.address}`);
  
  const deploymentInfo = {
    hookAddress,
    network: "xlayer_testnet",
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    chainId: 196
  };
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n📄 Deployment info saved to deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});