// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { Logo } from '../ui/Logo';
import { DepositModal } from '../modals/DepositModal';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'portfolio', name: 'Portfolio', icon: TrendingUp, path: '/portfolio' },
  { id: 'transactions', name: 'Transactions', icon: Wallet, path: '/transactions' },
];

export const Sidebar = () => {
  const { address, balance, disconnect } = useWallet();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white shadow-sm border border-gray-200"
      >
        {isMobileOpen ? <X className="w-5 h-5 text-gray-900" /> : <Menu className="w-5 h-5 text-gray-900" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 bottom-0 z-40 
        bg-white border-r border-gray-200 shadow-sm
        transition-all duration-300 ease-out flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo Section */}
        <div className={`px-4 py-6 border-b border-gray-100 ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'}`}>
            <Logo className={isCollapsed ? 'w-12 h-12' : 'w-32 h-auto'} animated={false} />
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-24 z-50 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> : <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={({ isActive }) => `
                relative flex items-center w-full rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'}
                ${isActive 
                  ? 'bg-gray-100 text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className={`absolute left-0 w-1 h-5 bg-black rounded-r-full ${isCollapsed ? 'left-0' : ''}`} />
                  )}
                  
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                  
                  {!isCollapsed && (
                    <span className="flex-1 text-left">{item.name}</span>
                  )}
                  
                  {isCollapsed && hoveredItem === item.name && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 rounded-lg text-xs font-semibold text-white whitespace-nowrap z-50 shadow-xl">
                      {item.name}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Wallet Section - Bottom */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className={`flex items-center w-full rounded-xl bg-white border border-gray-200 shadow-sm ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-3'}`}>
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{shortAddress}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] font-medium text-gray-500">{balance} SOL</p>
                    <button onClick={copyAddress} className="p-0.5 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <button onClick={disconnect} className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer group">
                  <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
              </>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={() => setIsDepositOpen(true)}
              className="w-full mt-3 py-2.5 bg-black text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-900 transition-colors cursor-pointer"
            >
              Deposit SOL
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
      
      {/* Deposit Modal */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </>
  );
};