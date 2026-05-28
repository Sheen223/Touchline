// hardhat.config.js
import { config } from "dotenv";
config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

export default {
  solidity: "0.8.20",
  networks: {
    xlayer_mainnet: {
      type: "http",
      url: "https://rpc.xlayer.tech",
      chainId: 196,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 Gwei
    }
  }
};