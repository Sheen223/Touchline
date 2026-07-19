import { useState, useEffect } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, utils } from '@coral-xyz/anchor';
import { useWallet } from '../context/WalletContext';
import idl from '../idl.json';

const PROGRAM_ID = new PublicKey('4z5FB4Jbit1VqrCL4EXQyQ4K2nu26sxcRY5nA7mAuKww');
const NETWORK = 'https://api.devnet.solana.com';

export const useTouchlineContract = () => {
  const { address, isConnected } = useWallet();
  const [program, setProgram] = useState(null);
  const [aiAgent, setAiAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConnected || !window.phantom?.solana) return;

    const connection = new Connection(NETWORK, 'confirmed');
    const provider = new AnchorProvider(
      connection,
      window.phantom.solana,
      AnchorProvider.defaultOptions()
    );

    // Ensure IDL has address
    const programIdl = {
      ...idl,
      address: PROGRAM_ID.toString()
    };
    
    const programInstance = new Program(programIdl, provider);
    setProgram(programInstance);

    // Fetch PDA State to see current AI Agent
    const fetchState = async () => {
      try {
        const [statePda] = PublicKey.findProgramAddressSync(
          [utils.bytes.utf8.encode('state')],
          PROGRAM_ID
        );
        const stateAccount = await programInstance.account.portfolioState.fetch(statePda);
        setAiAgent(stateAccount.aiAgent.toString());
      } catch (err) {
        console.log("State account not initialized yet or error fetching:", err);
      }
    };
    
    fetchState();
  }, [isConnected, address]);

  const ensureInitialized = async (programInstance, statePda, provider) => {
    try {
      await programInstance.account.portfolioState.fetch(statePda);
    } catch (err) {
      console.log("Initializing state...");
      await programInstance.methods.initialize()
        .accounts({
          state: statePda,
          signer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    }
  };

  const updateProbability = async (team, probability) => {
    if (!program || !isConnected) throw new Error("Wallet not connected to Solana");
    setIsLoading(true);
    
    try {
      const provider = program.provider;
      const [statePda] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('state')],
        PROGRAM_ID
      );

      await ensureInitialized(program, statePda, provider);

      console.log(`📡 Updating ${team} probability to ${probability}% on-chain...`);
      const txHash = await program.methods.updateProbability(team, probability)
        .accounts({
          state: statePda,
          signer: provider.wallet.publicKey,
        })
        .rpc();
      
      console.log(`✅ Transaction successful: ${txHash}`);
      return { hash: txHash };
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const setAIAgent = async () => {
    if (!program || !isConnected) throw new Error("Wallet not connected to Solana");
    setIsLoading(true);
    
    try {
      const provider = program.provider;
      const newAgentPubkey = provider.wallet.publicKey;
      const [statePda] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode('state')],
        PROGRAM_ID
      );

      await ensureInitialized(program, statePda, provider);

      console.log(`📡 Setting AI Agent on-chain to: ${newAgentPubkey.toString()}`);
      const txHash = await program.methods.setAiAgent(newAgentPubkey)
        .accounts({
          state: statePda,
          signer: newAgentPubkey,
        })
        .rpc();
      
      setAiAgent(newAgentPubkey.toString());
      console.log(`✅ AI Agent set successfully: ${txHash}`);
      return { hash: txHash };
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Failed to set AI agent");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contract: program,
    aiAgent,
    isLoading,
    error,
    setAIAgent,
    updateProbability,
  };
};