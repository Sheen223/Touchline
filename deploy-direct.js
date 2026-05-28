// deploy-direct.js
import { ethers } from "ethers";
import fs from "fs";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = "https://rpc.xlayer.tech";

async function main() {
  console.log("🚀 Direct deployment to X Layer Mainnet...");
  
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log(`📡 Deployer: ${wallet.address}`);
  
  const balance = await provider.getBalance(wallet.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} OKB`);
  
  // Contract ABI and bytecode - get from artifacts
  const artifact = JSON.parse(fs.readFileSync("./artifacts/contracts/CupFolioHook.sol/CupFolioHook.json"));
  
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log(`\n✅ CupFolioHook deployed to: ${address}`);
  console.log(`🔗 https://www.okx.com/xlayer/explorer/address/${address}`);
}

main().catch(console.error);