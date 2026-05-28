// scripts/deploy-mainnet.cjs
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CupFolioHook to X Layer MAINNET...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log(`📡 Deployer: ${deployer.address}`);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} OKB\n`);
  
  if (parseFloat(hre.ethers.formatEther(balance)) < 0.01) {
    throw new Error("Insufficient OKB. Need at least 0.01 OKB for deployment");
  }
  
  console.log("📝 Deploying contract...");
  const CupFolioHook = await hre.ethers.getContractFactory("CupFolioHook");
  const hook = await CupFolioHook.deploy();
  
  await hook.waitForDeployment();
  const address = await hook.getAddress();
  
  console.log(`\n✅ CupFolioHook deployed to: ${address}`);
  console.log(`🔗 https://www.okx.com/xlayer/explorer/address/${address}`);
  
  // Set AI agent
  await hook.setAIAgent(deployer.address);
  console.log(`\n🤖 AI Agent: ${deployer.address}`);
  
  // Save deployment info
  const fs = require("fs");
  fs.writeFileSync("deployment-mainnet.json", JSON.stringify({
    address,
    deployer: deployer.address,
    network: "xlayer_mainnet",
    chainId: 196,
    timestamp: new Date().toISOString()
  }, null, 2));
  
  console.log("\n📄 Deployment info saved to deployment-mainnet.json");
}

main().catch(console.error);