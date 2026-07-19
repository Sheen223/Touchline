import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Shield, Zap, CheckCircle, ArrowRight, Wallet } from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

export const DepositModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(0.5);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentPubKey, setAgentPubKey] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3001/api/agent')
        .then(res => res.json())
        .then(data => setAgentPubKey(data.publicKey))
        .catch(err => console.error("Failed to fetch agent pubkey", err));
    }
  }, [isOpen]);

  const handleDeposit = async () => {
    if (!publicKey || !agentPubKey) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const lamports = amount * 1e9;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(agentPubKey),
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      setTxHash(signature);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      setStep(3);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Fund Agent Treasury</h2>
            <p className="text-sm text-gray-500 mt-1">Deposit SOL to enable autonomous trading</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 font-medium mb-2">Amount (SOL)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">◎</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-10 py-3 text-gray-900 text-lg font-bold focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Non-Custodial Note</h4>
                    <p className="text-xs text-blue-700 mt-1">Funds will be sent directly to the AI Agent's on-chain wallet on Devnet.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={amount <= 0 || !agentPubKey}
                className="w-full py-3.5 rounded-xl bg-black text-white font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all cursor-pointer disabled:opacity-50"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Confirm Transfer</h3>
                  <p className="text-sm text-gray-500 mt-1">Review transaction details</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium text-sm">Send Amount</span>
                  <span className="text-gray-900 font-bold">{amount} SOL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium text-sm">To Agent</span>
                  <span className="text-blue-600 font-mono text-xs bg-blue-50 px-2 py-1 rounded">
                    {agentPubKey ? `${agentPubKey.slice(0, 6)}...${agentPubKey.slice(-4)}` : 'Loading...'}
                  </span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium text-sm">Network</span>
                  <span className="text-gray-700 font-semibold text-sm">Devnet</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleDeposit}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 rounded-xl bg-black text-white font-bold hover:bg-gray-900 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Signing...' : 'Approve'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Treasury Funded!</h3>
                <p className="text-gray-500 mt-2 text-sm">The agent now has capital to deploy.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Transaction Hash</p>
                <a 
                  href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 font-mono mt-1 hover:underline block"
                >
                  {txHash?.slice(0, 16)}...
                </a>
              </div>
              <button
                onClick={onClose}
                className="w-full mt-4 py-3.5 rounded-xl bg-gray-100 text-gray-900 font-bold hover:bg-gray-200 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};