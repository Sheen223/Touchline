// src/components/sections/ProfileSection.jsx
import React, { useState } from 'react';
import { User, Mail, Wallet, Calendar, Edit2, Copy, Check } from 'lucide-react';

export const ProfileSection = () => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('Alex Johnson');
  const [bio, setBio] = useState('Crypto enthusiast and World Cup fan. Managing my portfolio with AI.');
  
  const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5';
  
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        <p className="text-white/40 text-sm mt-1">Your account information</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">AJ</span>
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-white text-xl font-semibold"
                  />
                ) : (
                  <h3 className="text-xl font-semibold text-white">{username}</h3>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-3 h-3 text-white/30" />
                  <span className="text-sm text-white/40">alex@Touchline.io</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-white/30" />
                  <span className="text-sm text-white/40">Joined December 2024</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-white/60" />
            </button>
          </div>
          
          {isEditing ? (
            <div>
              <label className="block text-sm text-white/40 mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={() => setIsEditing(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <p className="text-white/60 text-sm leading-relaxed">{bio}</p>
          )}
        </div>
        
        {/* Wallet Info */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-medium">Wallet</h3>
          </div>
          
          <div className="bg-black/50 rounded-xl p-3 mb-4">
            <div className="text-xs text-white/30 mb-1">Connected Address</div>
            <div className="flex items-center justify-between">
              <code className="text-sm text-white font-mono">{walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}</code>
              <button onClick={copyAddress} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/40" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Total Deposits</span>
              <span className="text-white font-mono">$500.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Current Value</span>
              <span className="text-emerald-400 font-mono">$524.50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Total P&L</span>
              <span className="text-emerald-400 font-mono">+$24.50 (+4.9%)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trades', value: '24' },
          { label: 'Win Rate', value: '68%' },
          { label: 'Best Trade', value: '+$40' },
          { label: 'Avg Return', value: '+12.4%' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-white/40 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};