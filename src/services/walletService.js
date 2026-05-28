// src/services/walletService.js
import { ethers } from 'ethers';

const XLAYER_TESTNET = {
  chainId: '0xc4',
  chainName: 'X Layer Testnet',
  nativeCurrency: {
    name: 'OKB',
    symbol: 'OKB',
    decimals: 18,
  },
  rpcUrls: ['https://testnet.xlayer.tech'],
  blockExplorerUrls: ['https://testnet.xlayer.tech'],
};

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
    this.isConnected = false;
  }

  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }

  async switchToXLayer() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: XLAYER_TESTNET.chainId }],
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [XLAYER_TESTNET],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
          return false;
        }
      }
      console.error('Failed to switch network:', error);
      return false;
    }
  }

  async connect() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('Please install MetaMask or OKX Wallet to continue');
    }

    try {
      // First, check if already connected
      const existingAccounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      // If already connected, use existing accounts
      let accounts = existingAccounts;
      
      if (!accounts || accounts.length === 0) {
        // Request access - this triggers the popup
        accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your wallet first.');
      }

      // Get the selected account
      this.address = accounts[0];
      
      // Create provider
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Get chain ID
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);
      this.isConnected = true;

      return {
        address: this.address,
        chainId: this.chainId,
        isConnected: true,
      };
    } catch (error) {
      console.error('Connection error details:', error);
      
      if (error.code === 4001) {
        throw new Error('Connection rejected. Please approve the request in your wallet.');
      }
      throw new Error(error.message || 'Failed to connect wallet. Please make sure MetaMask is unlocked.');
    }
  }

  async getBalance() {
    if (!this.provider || !this.address) return '0';
    try {
      const balance = await this.provider.getBalance(this.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  async disconnect() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
    this.isConnected = false;
  }
}

export const walletService = new WalletService();