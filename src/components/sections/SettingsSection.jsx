import React, { useState } from 'react';
import { Bell, Shield, Eye, Globe, Key, User, Save } from 'lucide-react';

const SettingToggle = ({ label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/10">
    <div>
      <div className="text-white font-medium">{label}</div>
      <div className="text-sm text-white/30">{description}</div>
    </div>
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-white/20'
      }`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-5' : 'translate-x-0.5'
      }`} />
    </button>
  </div>
);

export const SettingsSection = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: true,
    autoRebalance: true,
    darkMode: true,
    analytics: false
  });
  
  const [displayName, setDisplayName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex@Touchline.io');
  
  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-white/40 text-sm mt-1">Manage your account preferences</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-medium">Profile Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/40 mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-white/40 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <button className="w-full mt-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
        
        {/* Wallet Settings */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-medium">Wallet Connection</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-black/50 rounded-xl p-4 border border-white/10">
              <div className="text-sm text-white/40 mb-1">Connected Wallet</div>
              <div className="text-white font-mono">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5</div>
            </div>
            <button className="w-full px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 transition-colors">
              Disconnect Wallet
            </button>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-medium">Notifications</h3>
          </div>
          
          <SettingToggle
            label="Email Notifications"
            description="Receive trade confirmations and alerts via email"
            enabled={settings.emailNotifications}
            onToggle={() => toggleSetting('emailNotifications')}
          />
          <SettingToggle
            label="Push Notifications"
            description="Real-time alerts for agent actions"
            enabled={settings.pushNotifications}
            onToggle={() => toggleSetting('pushNotifications')}
          />
        </div>
        
        {/* Security */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-medium">Security</h3>
          </div>
          
          <SettingToggle
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            enabled={settings.twoFactorAuth}
            onToggle={() => toggleSetting('twoFactorAuth')}
          />
          <SettingToggle
            label="Auto-Rebalance"
            description="Allow AI agent to automatically rebalance portfolio"
            enabled={settings.autoRebalance}
            onToggle={() => toggleSetting('autoRebalance')}
          />
        </div>
        
        {/* Preferences */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-medium">Preferences</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <SettingToggle
              label="Dark Mode"
              description="Use dark theme across the platform"
              enabled={settings.darkMode}
              onToggle={() => toggleSetting('darkMode')}
            />
            <SettingToggle
              label="Analytics"
              description="Share anonymous usage data to improve the platform"
              enabled={settings.analytics}
              onToggle={() => toggleSetting('analytics')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};