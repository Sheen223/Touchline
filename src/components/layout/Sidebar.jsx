// src/components/layout/Sidebar.jsx (Updated with balance)
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
  { id: 'portfolio', name: 'Portfolio', icon: TrendingUp, section: 'portfolio', badge: '8 active' },
  { id: 'transactions', name: 'Transactions', icon: Wallet, section: 'transactions' },
];

export const Sidebar = ({ activeSection, onNavigate }) => {
  const { address, balance, disconnect } = useWallet();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [copied, setCopied] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
      >
        {isMobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 bottom-0 z-40 
        bg-black/95 backdrop-blur-xl border-r border-white/10
        transition-all duration-300 ease-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo Section */}
        <div className={`px-4 py-5 border-b border-white/10 ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-base font-bold text-white">CupFolio</h1>
                <p className="text-[10px] text-white/30">AI Portfolio Manager</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-white" /> : <ChevronLeft className="w-3.5 h-3.5 text-white" />}
        </button>

        {/* Navigation */}
        <nav className="px-3 py-6 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.section)}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                relative flex items-center w-full rounded-lg text-sm transition-all duration-200
                ${isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'}
                ${activeSection === item.section 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {activeSection === item.section && (
                <div className={`absolute left-0 w-0.5 h-5 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full ${isCollapsed ? 'left-0' : ''}`} />
              )}
              
              <item.icon className="w-4 h-4" />
              
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {isCollapsed && hoveredItem === item.name && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 rounded-lg text-xs text-white whitespace-nowrap z-50 border border-white/10">
                  {item.name}
                  {item.badge && ` (${item.badge})`}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Wallet Section - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className={`flex items-center w-full rounded-lg ${isCollapsed ? 'justify-center p-2' : 'gap-2.5 p-2'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{shortAddress}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-white/30">{balance} X</p>
                    <button onClick={copyAddress} className="p-0.5 rounded hover:bg-white/10 transition-colors">
                      {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-white/30" />}
                    </button>
                  </div>
                </div>
                <button onClick={disconnect} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <LogOut className="w-3.5 h-3.5 text-white/40" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  );
};