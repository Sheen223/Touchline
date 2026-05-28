// src/components/ui/NeonButton.jsx
import React from 'react';

export const NeonButton = ({ children, onClick, variant = 'primary', size = 'md', disabled = false }) => {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25',
    secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20',
    outline: 'border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes[size]}
        ${variants[variant]}
        rounded-xl font-semibold
        transition-all duration-300
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
};